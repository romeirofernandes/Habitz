const axios = require('axios');
const Habit = require('../models/habitSchema');

// Helper function to get a reasonable icon for a habit based on its category
const getCategoryIcon = (category) => {
  const icons = {
    health: ["💧", "🏃‍♂️", "🥗", "💪", "🧘‍♀️", "🥦", "❤️", "🍎"],
    productivity: ["📝", "⏰", "✅", "📚", "💻", "📊", "🧠", "📈"],
    mindfulness: ["🧘", "🌱", "🌿", "🧠", "🌄", "🌅", "🌊", "🌼"],
    selfCare: ["🛁", "☕", "😌", "🌙", "🔋", "🧸", "🎭", "🧼"],
    social: ["👋", "🤝", "💬", "🎉", "👥", "📞", "🤗", "💌"],
    creativity: ["🎨", "🎵", "✏️", "📷", "🎭", "🖌️", "🎬", "🎮"],
    education: ["📚", "🔍", "🧪", "🔬", "🌎", "🧩", "📊", "📝"],
    default: ["✨", "🌟", "⭐", "🎯", "🚀", "🔔", "📌", "🎬"]
  };

  // Normalize category by removing spaces and converting to lowercase
  const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '') || 'default';
  
  // Get the array for this category or use default
  const categoryIcons = icons[normalizedCategory] || icons.default;
  
  // Return a random icon from the appropriate array
  return categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
};

// Get time of day based on hour
const getTimeOfDay = (hour) => {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
};

// Generate a random time within a specific part of the day
const getRandomTimeForPeriod = (period) => {
  let hour, minute;
  
  switch(period) {
    case "morning":
      hour = 5 + Math.floor(Math.random() * 7); // 5am to 11am
      break;
    case "afternoon":
      hour = 12 + Math.floor(Math.random() * 6); // 12pm to 5pm
      break;
    case "evening":
      hour = 18 + Math.floor(Math.random() * 4); // 6pm to 9pm
      break;
    case "night":
    default:
      hour = 22 + Math.floor(Math.random() * 7) % 24; // 10pm to 4am
      break;
  }
  
  minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
  
  // Format as HH:MM
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Generate personalized habit recommendations based on user data
 * @route POST /api/recommendations
 * @access Private
 */
exports.generateRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { existingHabits = [], categories = [], timePreferences = [] } = req.body;

    // Get user's actual habits from database
    const userHabits = await Habit.find({ user: userId }).select('name category timeOfDay currentStreak');
    
    // Combine existing habits from request with those from database
    const allHabitNames = [
      ...existingHabits,
      ...userHabits.map(h => h.name)
    ];
    
    // Determine preferred time of day based on existing habits
    const timePreferencesFromDB = userHabits.map(h => h.timeOfDay);
    const allTimePreferences = [...timePreferences, ...timePreferencesFromDB];
    
    // Extract hour numbers from time preferences
    const hours = allTimePreferences
      .map(time => {
        const match = time?.match(/^(\d{1,2}):/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(hour => hour !== null);

    // Determine the time of day user prefers
    let preferredPeriod = "morning"; // Default
    if (hours.length) {
      // Get the average hour
      const avgHour = hours.reduce((sum, h) => sum + h, 0) / hours.length;
      preferredPeriod = getTimeOfDay(avgHour);
    }
    
    // Determine categories user tends to focus on
    const categoriesFromDB = userHabits.map(h => h.category).filter(Boolean);
    const allCategories = [...new Set([...categories, ...categoriesFromDB])];
    
    // If GROQ API key is available, use AI to generate recommendations
    if (process.env.GROQ_API_KEY) {
      try {
        const groqResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: "You are a habit recommendation AI assistant. Generate unique, helpful habit recommendations based on user's existing habits and preferences."
              },
              {
                role: "user",
                content: `Generate 3 unique habit recommendations NOT in this list: ${allHabitNames.join(", ")}.
                Preferred time of day: ${preferredPeriod}.
                Categories of interest: ${allCategories.join(", ") || "any"}.
                
                FORMAT: Return a JSON array containing objects with these fields:
                - category (string): One word category like "health", "productivity", "mindfulness", etc.
                - title (string): A short title for the habit, max 5 words
                - recommendation (string): A 1-sentence explanation why this would be beneficial
                - timeOfDay (string): A time in 24hr format like "08:00" or "18:30", within the preferred period
                
                Do not include any explanatory text, just return a parseable JSON array.`
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Extract the content from the response
        const content = groqResponse.data.choices[0]?.message?.content || '';
        
        // Try to parse the response as JSON
        try {
          // Extract just the JSON part if there's any explanatory text
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          const jsonString = jsonMatch ? jsonMatch[0] : content;
          
          let recommendations = JSON.parse(jsonString);
          
          // Add icons based on categories
          recommendations = recommendations.map(rec => ({
            ...rec,
            icon: getCategoryIcon(rec.category)
          }));
          
          return res.json(recommendations);
        } catch (parseError) {
          console.error("Failed to parse GROQ response:", parseError);
        }
      } catch (groqError) {
        console.error("Error calling GROQ API:", groqError.message);
      }
    }
    
    // Fallback: Generate basic recommendations if AI fails or isn't available
    const possibleRecommendations = [
      {
        category: "health",
        title: "Drink water before breakfast",
        recommendation: "Hydrating first thing in the morning can boost metabolism and energy levels.",
        timeOfDay: getRandomTimeForPeriod("morning"),
        icon: "💧"
      },
      {
        category: "productivity",
        title: "Plan your day",
        recommendation: "Taking a few minutes to plan your day can improve focus and productivity.",
        timeOfDay: getRandomTimeForPeriod("morning"),
        icon: "📝"
      },
      {
        category: "mindfulness",
        title: "Morning meditation",
        recommendation: "A short meditation practice can reduce stress and improve mental clarity.",
        timeOfDay: getRandomTimeForPeriod("morning"),
        icon: "🧘"
      },
      {
        category: "health",
        title: "Midday stretch break",
        recommendation: "Regular stretching improves posture and reduces muscle tension.",
        timeOfDay: getRandomTimeForPeriod("afternoon"),
        icon: "🧍‍♂️"
      },
      {
        category: "productivity",
        title: "Email batch processing",
        recommendation: "Processing emails in batches reduces context switching and improves focus.",
        timeOfDay: getRandomTimeForPeriod("afternoon"),
        icon: "📨"
      },
      {
        category: "selfCare",
        title: "Tech-free lunch break",
        recommendation: "Taking a break from screens during lunch can reduce eye strain and mental fatigue.",
        timeOfDay: getRandomTimeForPeriod("afternoon"),
        icon: "🍽️"
      },
      {
        category: "health",
        title: "Evening walk",
        recommendation: "A short evening walk can improve sleep quality and reduce stress.",
        timeOfDay: getRandomTimeForPeriod("evening"),
        icon: "🚶‍♂️"
      },
      {
        category: "selfCare",
        title: "Reading before bed",
        recommendation: "Reading a physical book before sleep can improve sleep quality.",
        timeOfDay: getRandomTimeForPeriod("night"),
        icon: "📖"
      },
      {
        category: "productivity",
        title: "Digital declutter",
        recommendation: "Regularly organizing digital files can reduce mental load and improve focus.",
        timeOfDay: getRandomTimeForPeriod("evening"),
        icon: "🗂️"
      }
    ];
    
    // Filter out recommendations that match user's existing habits
    const existingHabitsLower = allHabitNames.map(h => h.toLowerCase());
    const filtered = possibleRecommendations.filter(rec => 
      !existingHabitsLower.includes(rec.title.toLowerCase())
    );
    
    // Select 3 random recommendations or fewer if not enough available
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const recommendations = shuffled.slice(0, Math.min(3, shuffled.length));
    
    // If no recommendations are available after filtering
    if (recommendations.length === 0) {
      return res.json([
        {
          category: "productivity",
          title: "Habit tracking review",
          recommendation: "Weekly review your habit progress to stay motivated and identify patterns.",
          timeOfDay: getRandomTimeForPeriod(preferredPeriod),
          icon: "📊"
        },
        {
          category: "creativity",
          title: "Creative time block",
          recommendation: "Dedicate time for creative activities to stimulate different parts of your brain.",
          timeOfDay: getRandomTimeForPeriod(preferredPeriod),
          icon: "🎨"
        },
        {
          category: "social",
          title: "Connection call",
          recommendation: "Regular check-ins with friends or family can boost mood and social well-being.",
          timeOfDay: getRandomTimeForPeriod(preferredPeriod),
          icon: "📞"
        }
      ]);
    }
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
};