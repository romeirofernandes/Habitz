const axios = require('axios');
const Visualization = require('../models/visualization');

/**
 * Generate visualization for a habit using Groq API
 * @route POST /api/visualizer/generate
 * @access Private
 */
exports.generateVisualization = async (req, res) => {
  try {
    const { habitName, habitDescription } = req.body;
    const userId = req.user.id;

    if (!habitName) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    // Generate mermaid code using Groq API
    const mermaidCode = await generateMermaidWithGroq(habitName, habitDescription);
    
    // Create a temporary visualization record
    const visualization = new Visualization({
      user: userId,
      habitName,
      habitDescription: habitDescription || '',
      mermaidCode,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save the visualization
    const savedVisualization = await visualization.save();
    
    res.status(200).json({
      mermaidCode,
      id: savedVisualization._id
    });
    
  } catch (error) {
    console.error('Error generating visualization:', error);
    res.status(500).json({ message: 'Failed to generate visualization' });
  }
};

/**
 * Save an existing visualization
 * @route POST /api/visualizer/save
 * @access Private
 */
exports.saveVisualization = async (req, res) => {
  try {
    const { habitName, habitDescription, mermaidCode, visualizationId } = req.body;
    const userId = req.user.id;

    if (!habitName || !mermaidCode) {
      return res.status(400).json({ message: 'Habit name and mermaid code are required' });
    }

    let visualization;
    
    if (visualizationId) {
      // Update existing visualization
      visualization = await Visualization.findOne({
        _id: visualizationId,
        user: userId
      });
      
      if (!visualization) {
        return res.status(404).json({ message: 'Visualization not found' });
      }
      
      visualization.habitName = habitName;
      visualization.habitDescription = habitDescription || '';
      visualization.mermaidCode = mermaidCode;
      visualization.updatedAt = new Date();
    } else {
      // Create new visualization
      visualization = new Visualization({
        user: userId,
        habitName,
        habitDescription: habitDescription || '',
        mermaidCode,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await visualization.save();
    
    res.status(200).json({
      message: 'Visualization saved successfully',
      id: visualization._id
    });
    
  } catch (error) {
    console.error('Error saving visualization:', error);
    res.status(500).json({ message: 'Failed to save visualization' });
  }
};

/**
 * Get all visualizations for a user
 * @route GET /api/visualizer/all
 * @access Private
 */
exports.getAllVisualizations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const visualizations = await Visualization.find({ user: userId })
      .sort({ updatedAt: -1 })
      .select('habitName habitDescription updatedAt _id');
    
    res.status(200).json(visualizations);
    
  } catch (error) {
    console.error('Error fetching visualizations:', error);
    res.status(500).json({ message: 'Failed to fetch visualizations' });
  }
};

/**
 * Get a single visualization
 * @route GET /api/visualizer/:id
 * @access Private
 */
exports.getVisualization = async (req, res) => {
  try {
    const userId = req.user.id;
    const visualizationId = req.params.id;
    
    const visualization = await Visualization.findOne({
      _id: visualizationId,
      user: userId
    });
    
    if (!visualization) {
      return res.status(404).json({ message: 'Visualization not found' });
    }
    
    res.status(200).json(visualization);
    
  } catch (error) {
    console.error('Error fetching visualization:', error);
    res.status(500).json({ message: 'Failed to fetch visualization' });
  }
};

/**
 * Delete a visualization
 * @route DELETE /api/visualizer/:id
 * @access Private
 */
exports.deleteVisualization = async (req, res) => {
  try {
    const userId = req.user.id;
    const visualizationId = req.params.id;
    
    const visualization = await Visualization.findOneAndDelete({
      _id: visualizationId,
      user: userId
    });
    
    if (!visualization) {
      return res.status(404).json({ message: 'Visualization not found' });
    }
    
    res.status(200).json({ message: 'Visualization deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting visualization:', error);
    res.status(500).json({ message: 'Failed to delete visualization' });
  }
};
// Add this to your existing code
const validateAndFixMermaidCode = (mermaidCode, habitName) => {
    try {
      // Clean up the response
      let fixedCode = mermaidCode.replace(/```mermaid\s*/g, '').replace(/```\s*$/g, '').trim();
      
      // Ensure it starts with flowchart TD
      if (!fixedCode.startsWith('flowchart')) {
        fixedCode = 'flowchart TD\n' + fixedCode;
      }
      
      // Check for and remove problematic ::: style syntax
      fixedCode = fixedCode.replace(/:::\s*(\w+)/g, '');
      
      // Check for unclosed subgraphs
      const subgraphStarts = (fixedCode.match(/subgraph/g) || []).length;
      const subgraphEnds = (fixedCode.match(/\send\s/g) || []).length;
      
      if (subgraphStarts > subgraphEnds) {
        // Add missing end statements
        for (let i = 0; i < subgraphStarts - subgraphEnds; i++) {
          fixedCode += '\n    end';
        }
      }
      
      // Check if style definitions exist, add if missing
      if (!fixedCode.includes('classDef')) {
        fixedCode += `
      classDef habitStyle fill:#9333EA,color:#fff,stroke:#7E22CE,stroke-width:2px
      classDef triggerStyle fill:#3B82F6,color:#fff,stroke:#2563EB,stroke-width:1px
      classDef stepStyle fill:#10B981,color:#fff,stroke:#059669,stroke-width:1px
      classDef rewardStyle fill:#F59E0B,color:#fff,stroke:#D97706,stroke-width:1px
      classDef obstacleStyle fill:#EF4444,color:#fff,stroke:#DC2626,stroke-width:1px
        `;
      }
      
      // Check if class applications exist, add if missing
      if (!fixedCode.includes('class ')) {
        // Find the main node ID 
        const mainNodeMatch = fixedCode.match(/\s+(\w+)\["([^"]*?(?:habit|main)[^"]*?)"\]/i);
        const mainNodeId = mainNodeMatch ? mainNodeMatch[1] : 'id1';
        
        fixedCode += `\n    class ${mainNodeId} habitStyle`;
      }
      
      return fixedCode;
    } catch (error) {
      console.error('Error validating Mermaid code:', error);
      return generateFallbackMermaid(habitName);
    }
  };
/**
 * Generate mermaid code using Groq API
 */
const generateMermaidWithGroq = async (habitName, habitDescription = '') => {
    try {
      // Check if Groq API key is available
      if (!process.env.GROQ_API_KEY) {
        return generateFallbackMermaid(habitName, habitDescription);
      }
  
      const prompt = `
Create a Mermaid diagram that visualizes the habit "${habitName}" ${habitDescription ? `described as: "${habitDescription}"` : ''}.

The diagram should include:
1. The main habit as a central node
2. Key components or steps involved in this habit
3. Triggers that start the habit
4. Rewards or benefits from the habit
5. Potential obstacles or challenges
6. Related habits or supporting activities

IMPORTANT: Follow these instructions exactly for valid Mermaid syntax:
- Use flowchart TD (top-down) syntax
- Each node MUST have a unique ID (like id1, id2, etc.)
- Node text must be in quotes like id1["Node text"]
- Always close subgraphs with "end"
- Leave spaces between node connections and arrows
- For obstacles, use dotted lines (-.->)
- DO NOT use ::: syntax for styling
- Add style definitions with classDef at the end
- Apply styles with class statements (e.g., class id1 habitStyle)
- Ensure proper indentation for readability

Return ONLY valid mermaid code without explanation or markdown tags.

Example of correct syntax:
flowchart TD
    id1["Main Habit"]
    
    subgraph Triggers
        id2["Trigger 1"]
        id3["Trigger 2"]
    end
    
    id2 --> id1
    id3 --> id1
    
    classDef habitStyle fill:#9333EA,color:#fff,stroke:#7E22CE,stroke-width:2px
    class id1 habitStyle
`;
  
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are an expert at creating valid Mermaid diagrams with perfect syntax. You always create diagrams that parse correctly."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5, // Reduced temperature for more consistent outputs
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      let mermaidCode = response.data.choices[0]?.message?.content || '';
      mermaidCode = validateAndFixMermaidCode(mermaidCode, habitName);
      // Clean up the response
      // Remove markdown code blocks if they exist
      mermaidCode = mermaidCode.replace(/```mermaid\s*/g, '').replace(/```\s*$/g, '').trim();
      
      // Basic validation - check for common syntax errors
      if (!mermaidCode.startsWith('flowchart')) {
        mermaidCode = 'flowchart TD\n' + mermaidCode;
      }
      
      // Check for unclosed subgraphs
      const subgraphStarts = (mermaidCode.match(/subgraph/g) || []).length;
      const subgraphEnds = (mermaidCode.match(/\send\s/g) || []).length;
      
      if (subgraphStarts > subgraphEnds) {
        // Add missing end statements
        for (let i = 0; i < subgraphStarts - subgraphEnds; i++) {
          mermaidCode += '\n    end';
        }
      }
      
      // Attempt to sanitize node IDs with spaces or special characters
      const lines = mermaidCode.split('\n');
      const sanitizedLines = lines.map(line => {
        // Skip lines that are indentation, comments, or keywords
        if (line.trim() === '' || line.trim().startsWith('%') || 
            line.trim() === 'end' || line.trim().startsWith('flowchart')) {
          return line;
        }
        
        // Look for patterns like "Something With Spaces"["Label"] or similar problematic node definitions
        const nodeDefMatch = line.match(/([^"[(\s]+)\s+([^"[(\s]+)(\[".*"\])/);
        if (nodeDefMatch) {
          // Replace the space with underscore in the ID
          return line.replace(nodeDefMatch[0], `${nodeDefMatch[1]}_${nodeDefMatch[2]}${nodeDefMatch[3]}`);
        }
        
        return line;
      });
      
      mermaidCode = sanitizedLines.join('\n');
      
      return mermaidCode || generateFallbackMermaid(habitName, habitDescription);
      
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return generateFallbackMermaid(habitName, habitDescription);
    }
  };

/**
 * Generate a fallback mermaid diagram if API fails
 */
const generateFallbackMermaid = (habitName, habitDescription = '') => {
    // Very simple and reliable diagram structure
    let code = 'flowchart TD\n';
    
    // Main habit node - sanitize the habit name to avoid special chars
    const safeHabitName = habitName.replace(/[^\w\s]/gi, '');
    code += `    main["${safeHabitName}"] :::habitStyle\n\n`;
    
    // Simple structure with minimal connections
    code += '    subgraph triggers["Triggers"]\n';
    code += '        t1["Morning Alarm"] :::triggerStyle\n';
    code += '        t2["Reminder"] :::triggerStyle\n';
    code += '    end\n\n';
    
    code += '    subgraph steps["Steps"]\n';
    code += '        s1["Preparation"] :::stepStyle\n';
    code += '        s2["Execution"] :::stepStyle\n';
    code += '        s3["Completion"] :::stepStyle\n';
    code += '    end\n\n';
    
    code += '    subgraph benefits["Benefits"]\n';
    code += '        b1["Improved Health"] :::rewardStyle\n';
    code += '        b2["Mental Clarity"] :::rewardStyle\n';
    code += '    end\n\n';
    
    code += '    subgraph challenges["Challenges"]\n';
    code += '        c1["Time Constraints"] :::obstacleStyle\n';
    code += '        c2["Motivation Issues"] :::obstacleStyle\n';
    code += '    end\n\n';
    
    // Simple connections
    code += '    t1 --> main\n';
    code += '    t2 --> main\n';
    code += '    main --> steps\n';
    code += '    s1 --> s2 --> s3\n';
    code += '    s3 --> b1\n';
    code += '    s3 --> b2\n';
    code += '    c1 -.-> main\n';
    code += '    c2 -.-> main\n';
    
    // Class definitions for styling
    code += '\n    classDef habitStyle fill:#9333EA,color:#fff,stroke:#7E22CE,stroke-width:2px\n';
    code += '    classDef triggerStyle fill:#3B82F6,color:#fff,stroke:#2563EB,stroke-width:1px\n';
    code += '    classDef stepStyle fill:#10B981,color:#fff,stroke:#059669,stroke-width:1px\n';
    code += '    classDef rewardStyle fill:#F59E0B,color:#fff,stroke:#D97706,stroke-width:1px\n';
    code += '    classDef obstacleStyle fill:#EF4444,color:#fff,stroke:#DC2626,stroke-width:1px\n';
    
    return code;
  };