const axios = require('axios');

exports.forecastHabit = async (req, res) => {
  try {
    const { habitName, habitDescription, mermaidCode } = req.body;

    const prompt = `
Given the following habit system:

Habit Name: ${habitName}
Description: ${habitDescription}
Mermaid Diagram:
${mermaidCode}

Forecast the likely outcomes and changes for this habit system at 30, 90, and 365 days. 
For each time point, provide:
- A summary of expected progress or changes
- Potential challenges
- Motivation tips

Format your response as a JSON object with keys: "30", "90", "365".
`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a behavioral scientist and expert habit forecaster. Your answers are concise, practical, and based on the provided habit system."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Try to parse the JSON from the response
    let forecast = {};
    try {
      const content = response.data.choices[0]?.message?.content || '{}';
      forecast = JSON.parse(content.match(/{[\s\S]*}/)?.[0] || '{}');
    } catch (err) {
      forecast = { error: "Could not parse forecast." };
    }

    res.json(forecast);
  } catch (error) {
    console.error("Forecast error:", error);
    res.status(500).json({ error: "Failed to generate forecast." });
  }
};