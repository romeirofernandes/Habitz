const axios = require('axios');
const User = require('../models/user');
const Habit = require('../models/habitSchema');

/**
 * Get coaching advice based on user habits and coach personality
 * @route POST /api/coach
 * @access Private
 */
exports.getCoachingAdvice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, coachType } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user's habits from database
    const habits = await Habit.find({ user: userId });
    
    // Get user data
    const user = await User.findById(userId);
    
    // Generate stats for context
    const stats = {
      totalHabits: habits.length,
      completedToday: habits.filter(h => {
        const today = new Date();
        return h.completedDates.some(date => {
          const d = new Date(date);
          return d.getDate() === today.getDate() &&
                 d.getMonth() === today.getMonth() &&
                 d.getFullYear() === today.getFullYear();
        });
      }).length,
      currentStreak: Math.max(...habits.map(h => h.currentStreak || 0), 0),
      longestStreak: Math.max(...habits.map(h => h.longestStreak || 0), 0)
    };
    
    // Define coach personalities and their prompts
    const coachPersonalities = {
      supportive: "You are a supportive and encouraging habit coach named Coach Alex. Use positive reinforcement, empathy, and gentle guidance. Focus on building confidence and celebrating small wins.",
      strict: "You are a strict, no-nonsense habit coach named Coach Drill. Be direct, firm but fair. Hold the user accountable and don't accept excuses. Focus on discipline and commitment.",
      funny: "You are a witty, humorous habit coach named Coach Chuckles. Use humor, puns and lighthearted jokes while providing solid habit advice. Keep things fun while being helpful.",
      analytical: "You are an analytical, data-driven habit coach named Coach Logic. Focus on metrics, patterns and evidence-based strategies. Be precise and methodical in your recommendations.",
      motivational: "You are an energetic, motivational habit coach named Coach Spark. Be inspiring and passionate, like a personal trainer or motivational speaker. Use powerful language to ignite action."
    };
    
    // Select coach personality or default to supportive
    const coachPrompt = coachPersonalities[coachType] || coachPersonalities.supportive;
    
    // Check if Groq API key exists
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    // Call Groq API
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `${coachPrompt} You're helping a user build and maintain good habits. Your responses should be concise (max 3-4 sentences per response) and actionable.`
          },
          {
            role: "user",
            content: `My name is ${user.username || 'User'}. 
            My current habit stats: 
            - Total habits: ${stats.totalHabits}
            - Completed today: ${stats.completedToday}
            - Current streak: ${stats.currentStreak}
            - Longest streak: ${stats.longestStreak}
            
            My habits are: ${habits.map(h => `${h.name} (${h.currentStreak} day streak)`).join(', ')}
            
            My question/message: ${message}`
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const response = groqResponse.data.choices[0].message.content;
    
    res.json({
      message: response,
      coachType
    });
    
  } catch (error) {
    console.error("Coach API Error:", error);
    res.status(500).json({ message: error.response?.data?.error || 'Failed to get coaching advice' });
  }
};