import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import mermaid from "mermaid";
import ConfirmationModal from "../components/ConfirmationModal";

const HabitVisualizer = () => {
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    visualizationId: null,
  });
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [mermaidCode, setMermaidCode] = useState("");
  const [visualizationId, setVisualizationId] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [savedVisualizations, setSavedVisualizations] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [showCode, setShowCode] = useState(false);
  const mermaidRef = useRef(null);
  // Add at the top with other useState
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  // Handler to fetch forecast
  const handleForecast = async () => {
    setForecastLoading(true);
    setShowForecast(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/forecast/habit`,
        {
          habitName,
          habitDescription,
          mermaidCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setForecast(response.data);
    } catch (err) {
      setForecast({ error: "Could not fetch forecast." });
    } finally {
      setForecastLoading(false);
    }
  };
  const generateFallbackDiagram = (habitName) => {
    return `flowchart TD
      main["${habitName.replace(/"/g, "'")}"] :::habitStyle
      
      subgraph triggers["Triggers"]
        t1["Morning Reminder"] :::triggerStyle
        t2["Daily Routine"] :::triggerStyle
      end
      
      subgraph steps["Process"]
        s1["Preparation"] :::stepStyle
        s2["Action"] :::stepStyle
        s3["Completion"] :::stepStyle
      end
      
      subgraph benefits["Benefits"]
        b1["Mental Clarity"] :::rewardStyle
        b2["Physical Health"] :::rewardStyle
      end
      
      subgraph challenges["Challenges"]
        c1["Time Management"] :::obstacleStyle
        c2["Consistency"] :::obstacleStyle
      end
      
      t1 --> main
      t2 --> main
      main --> s1
      s1 --> s2
      s2 --> s3
      s3 --> b1
      s3 --> b2
      c1 -.-> main
      c2 -.-> main
      
      classDef habitStyle fill:#9333EA,color:#fff,stroke:#7E22CE,stroke-width:2px
      classDef triggerStyle fill:#3B82F6,color:#fff,stroke:#2563EB,stroke-width:1px
      classDef stepStyle fill:#10B981,color:#fff,stroke:#059669,stroke-width:1px
      classDef rewardStyle fill:#F59E0B,color:#fff,stroke:#D97706,stroke-width:1px
      classDef obstacleStyle fill:#EF4444,color:#fff,stroke:#DC2626,stroke-width:1px`;
  };
  useEffect(() => {
    // Initialize mermaid with dark theme
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
    });

    if (activeTab === "saved") {
      fetchVisualizations();
    }
  }, [activeTab]);

  useEffect(() => {
    if (mermaidCode && mermaidRef.current) {
      renderMermaidDiagram();
    }
  }, [mermaidCode]);

  const renderMermaidDiagram = () => {
    if (!mermaidRef.current) return;

    try {
      mermaidRef.current.innerHTML = "";

      // Pre-process the mermaid code to fix common syntax errors
      let fixedCode = mermaidCode;

      // Fix 1: Ensure flowchart declaration is present and correct
      if (!fixedCode.trim().startsWith("flowchart TD")) {
        fixedCode =
          "flowchart TD\n" + fixedCode.replace(/^flowchart\s+[^\n]+\n/, "");
      }

      // Fix 2: Correct "id1end" type issues by inserting a space
      fixedCode = fixedCode.replace(/(\w+)end\b/g, "$1 end");

      // Fix 3: Fix the style class syntax (:::style to class=style)
      fixedCode = fixedCode.replace(
        /(\w+)\["([^"]+)"\]\s*:::\s*(\w+)/g,
        '$1["$2"]'
      );

      // Extract all these classes to apply them at the end
      const classMatches = [];
      const classRegex = /(\w+)\["([^"]+)"\]\s*:::\s*(\w+)/g;
      let match;
      while ((match = classRegex.exec(mermaidCode)) !== null) {
        classMatches.push({ id: match[1], className: match[3] });
      }

      // Fix 4: Fix arrow connections with unusual formatting
      fixedCode = fixedCode.replace(/(\w+)\s*-->\s*_(\w+)/g, "$1 --> $2");
      // Remove :::style from node definitions
      fixedCode = fixedCode.replace(/:::\w+/g, "");

      // Fix multi-node class assignments (split by comma or space)
      fixedCode = fixedCode.replace(
        /^class\s+([^\n]+?)\s+(\w+)\s*$/gm,
        (match, ids, style) => {
          // ids can be comma or space separated
          // After removing :::style, add class assignments for each node
          const nodeClassRegex = /(\w+)\["[^"]*"\]\s*:::\s*(\w+)/g;
          let match1;
          let classAssignments = "";
          while ((match1 = nodeClassRegex.exec(mermaidCode)) !== null) {
            classAssignments += `class ${match1[1]} ${match1[3]}\n`;
          }
          fixedCode =
            fixedCode.replace(/:::\w+/g, "") + "\n" + classAssignments;
          return ids
            .split(/[,\s]+/)
            .filter(Boolean)
            .map((id) => `class ${id} ${style}`)
            .join("\n");
        }
      );
      // Fix 5: Handle duplicate node definitions
      const definedNodes = new Set();
      const lines = fixedCode.split("\n");
      const cleanedLines = [];

      for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue;

        // Check for node definitions like id1["Label"]
        const nodeMatch = line.match(/^\s*(\w+)\["([^"]+)"\]/);

        if (nodeMatch) {
          const nodeId = nodeMatch[1];
          if (definedNodes.has(nodeId)) {
            // Skip duplicate node definition
            continue;
          }
          definedNodes.add(nodeId);
        }

        // Check for malformed closing tags
        if (line.trim() === "end}" || line.trim() === "}end") {
          cleanedLines.push("end");
          continue;
        }

        cleanedLines.push(line);
      }

      fixedCode = cleanedLines.join("\n");

      // Fix 6: Check and fix subgraph/end balance
      const subgraphCount = (fixedCode.match(/subgraph/g) || []).length;
      const endCount = (fixedCode.match(/end(\s|$)/g) || []).length;

      if (subgraphCount > endCount) {
        for (let i = 0; i < subgraphCount - endCount; i++) {
          fixedCode += "\nend";
        }
      }

      // Fix 7: Add class definitions at the end if no style declarations exist
      let hasClassDefs = fixedCode.includes("classDef");

      if (!hasClassDefs) {
        fixedCode += `
        classDef habitStyle fill:#9333EA,color:#fff,stroke:#7E22CE,stroke-width:2px
        classDef triggerStyle fill:#3B82F6,color:#fff,stroke:#2563EB,stroke-width:1px
        classDef stepStyle fill:#10B981,color:#fff,stroke:#059669,stroke-width:1px
        classDef rewardStyle fill:#F59E0B,color:#fff,stroke:#D97706,stroke-width:1px
        classDef obstacleStyle fill:#EF4444,color:#fff,stroke:#DC2626,stroke-width:1px`;
      }

      // Fix 8: Fix multi-node class assignments (separate them)
      const classLines = [];
      const nonClassLines = [];

      // Split code into class definitions and everything else
      fixedCode.split("\n").forEach((line) => {
        const classMatch = line.trim().match(/^class\s+(.+)/);
        if (classMatch) {
          // Found a class assignment line
          const classList = classMatch[1].trim();

          // Check if it has multiple nodes (by looking for spaces before style name)
          if (/\w+\s+\w+\s+\w+/.test(classList)) {
            // Extract the style name (last word) and node IDs (all previous words)
            const parts = classList.split(/\s+/);
            const styleName = parts.pop(); // Last element is the style name

            // Create separate class assignments for each node
            parts.forEach((nodeId) => {
              classLines.push(`class ${nodeId} ${styleName}`);
            });
          } else {
            // Already a single class assignment, keep as is
            classLines.push(line);
          }
        } else {
          // Not a class line, keep as is
          nonClassLines.push(line);
        }
      });

      // Reconstruct the code with fixed class assignments
      fixedCode = nonClassLines.join("\n") + "\n" + classLines.join("\n");

      // Final fix for any other style issues
      fixedCode = fixedCode.replace(/:::(\w+)/g, "");

      // console.log("Rendering mermaid with fixed code:", fixedCode);

      mermaid.contentLoaded();

      // Use a random ID to avoid collisions across render attempts
      const diagramId = `mermaid-svg-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;

      mermaid
        .render(diagramId, fixedCode)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;

            // Make the SVG larger
            const svgElement = mermaidRef.current.querySelector("svg");
            if (svgElement) {
              svgElement.style.width = "100%";
              svgElement.style.height = "auto";
              svgElement.style.minHeight = "500px";
              svgElement.style.maxHeight = "700px";
            }
          }
        })
        .catch((error) => {
          console.error("Mermaid render error:", error);

          // If rendering fails even with fixes, fall back to a simple diagram
          const fallbackCode = generateFallbackDiagram(habitName);

          mermaid
            .render(`fallback-${Date.now()}`, fallbackCode)
            .then(({ svg }) => {
              if (mermaidRef.current) {
                mermaidRef.current.innerHTML = svg;

                // Add a note about the fallback
                const noteDiv = document.createElement("div");
                noteDiv.className =
                  "py-2 px-3 bg-amber-100 text-amber-800 text-xs rounded mt-2";
                noteDiv.innerText =
                  "Using simplified visualization due to syntax issues in the generated diagram.";
                mermaidRef.current.appendChild(noteDiv);

                // Make the SVG larger
                const svgElement = mermaidRef.current.querySelector("svg");
                if (svgElement) {
                  svgElement.style.width = "100%";
                  svgElement.style.height = "auto";
                  svgElement.style.minHeight = "500px";
                }
              }
            });
        });
    } catch (error) {
      console.error("Error in mermaid rendering process:", error);
      toast.error(
        "Visualization rendering failed. Try again or use a different habit description."
      );
    }
  };

  const fetchVisualizations = async () => {
    setLoadingSaved(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/visualizer/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedVisualizations(response.data);
    } catch (error) {
      console.error("Error fetching visualizations:", error);
      toast.error("Failed to fetch saved visualizations");
    } finally {
      setLoadingSaved(false);
    }
  };

  const loadVisualization = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/visualizer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabitName(response.data.habitName);
      setHabitDescription(response.data.habitDescription || "");
      setMermaidCode(response.data.mermaidCode);
      setVisualizationId(response.data._id);
      setActiveTab("create");
    } catch (error) {
      console.error("Error loading visualization:", error);
      toast.error("Failed to load visualization");
    }
  };

  // Replace the existing deleteVisualization function
  const deleteVisualization = async (id, e) => {
    e.stopPropagation();
    setDeleteConfirmation({
      isOpen: true,
      visualizationId: id,
    });
  };

  // Add this new function to handle the actual deletion
  const handleConfirmDelete = async () => {
    const id = deleteConfirmation.visualizationId;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/visualizer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Visualization deleted successfully");
      fetchVisualizations();

      if (visualizationId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting visualization:", error);
      toast.error("Failed to delete visualization");
    } finally {
      setDeleteConfirmation({ isOpen: false, visualizationId: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!habitName.trim()) {
      toast.warning("Please enter a habit name");
      return;
    }

    // Prevent multiple clicks
    if (loading) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/visualizer/generate`,
        {
          habitName,
          habitDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMermaidCode(response.data.mermaidCode);
      setVisualizationId(response.data.id);
      toast.success("Visualization created successfully!");
    } catch (error) {
      console.error("Error generating visualization:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate visualization"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVisualization = async () => {
    if (!mermaidCode) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/visualizer/save`,
        {
          habitName,
          habitDescription,
          mermaidCode,
          visualizationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Visualization saved successfully!");
      fetchVisualizations();
    } catch (error) {
      console.error("Error saving visualization:", error);
      toast.error("Failed to save visualization");
    }
  };

  const handleDownload = () => {
    if (!mermaidRef.current) return;

    const svgData = mermaidRef.current.querySelector("svg").outerHTML;
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(svgBlob);
    downloadLink.download = `habit-visualization-${habitName
      .replace(/\s+/g, "-")
      .toLowerCase()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const resetForm = () => {
    setHabitName("");
    setHabitDescription("");
    setMermaidCode("");
    setVisualizationId(null);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7] py-8">
      <main className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Habit Visualizer
          </h1>
          <p className="text-[#f5f5f7]/60 text-sm sm:text-base">
            Create a visual representation of your habit's structure and
            relationships
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#222] overflow-x-auto">
          {["create", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#A2BFFE]"
                  : "text-[#f5f5f7]/60 hover:text-[#f5f5f7]"
              }`}
            >
              {tab === "create" ? "Create New" : "Saved Visualizations"}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A2BFFE]"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === "create" ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-8">
              {/* Form + Actions & Diagram */}
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold mb-4">
                      Create Visualization
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#f5f5f7]/70 mb-2">
                          Habit Name
                        </label>
                        <input
                          type="text"
                          value={habitName}
                          onChange={(e) => setHabitName(e.target.value)}
                          placeholder="e.g., Morning Meditation"
                          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#f5f5f7]/70 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={habitDescription}
                          onChange={(e) => setHabitDescription(e.target.value)}
                          placeholder="Describe your habit in more detail..."
                          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2BFFE]/50 min-h-[100px] text-sm"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <motion.button
                          type="submit"
                          className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                        >
                          {loading ? (
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : null}
                          {loading ? "Generating..." : "Generate"}
                        </motion.button>
                        {visualizationId && (
                          <motion.button
                            type="button"
                            onClick={resetForm}
                            className="bg-[#222] hover:bg-[#333] px-3 py-2.5 rounded-lg text-sm flex-1 sm:flex-none"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Reset
                          </motion.button>
                        )}
                      </div>
                    </form>
                  </div>
                  {/* Actions & Forecast */}
                  <div>
                    {mermaidCode && (
                      <div className="mt-0 h-full">
                        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-4 gap-2">
                          <h3 className="font-medium text-base">
                            Diagram Actions
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <motion.button
                              onClick={handleSaveVisualization}
                              className="text-xs bg-[#222] hover:bg-[#333] text-[#f5f5f7] px-3 py-1 rounded-md flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {/* ...icon... */} Save
                            </motion.button>
                            <motion.button
                              onClick={handleDownload}
                              className="text-xs bg-[#222] hover:bg-[#333] text-[#f5f5f7] px-3 py-1 rounded-md flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {/* ...icon... */} Download
                            </motion.button>
                            <motion.button
                              onClick={() => setShowCode(!showCode)}
                              className={`text-xs ${
                                showCode
                                  ? "bg-[#A2BFFE] text-[#080808]"
                                  : "bg-[#222] hover:bg-[#333] text-[#f5f5f7]"
                              } px-3 py-1 rounded-md flex items-center`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {/* ...icon... */}
                              {showCode ? "Hide Code" : "View Code"}
                            </motion.button>
                            <motion.button
                              onClick={handleForecast}
                              className="text-xs bg-[#222] hover:bg-[#333] text-[#f5f5f7] px-3 py-1 rounded-md flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              🔮 Forecast
                            </motion.button>
                          </div>
                        </div>
                        {showCode && (
                          <div className="bg-[#111] rounded-md p-3 overflow-auto max-h-60 mb-4">
                            <pre className="text-xs text-[#f5f5f7]/70 whitespace-pre-wrap">
                              {mermaidCode}
                            </pre>
                          </div>
                        )}
                        {showForecast && (
                          <section className="mt-6 bg-[#18181b] rounded-xl p-4 sm:p-8 shadow-2xl border border-[#222]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                                🔮 Habit Forecast
                              </h2>
                              <button
                                className="text-[#A2BFFE] text-xl"
                                onClick={() => setShowForecast(false)}
                                aria-label="Close forecast"
                                type="button"
                              >
                                ×
                              </button>
                            </div>
                            {forecastLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2BFFE]"></div>
                              </div>
                            ) : forecast?.error ? (
                              <div className="text-red-400">
                                {forecast.error}
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {["30", "90", "365"].map((day) => (
                                  <div
                                    key={day}
                                    className="border-b border-[#333] pb-3 mb-3"
                                  >
                                    <h3 className="font-bold text-[#A2BFFE] mb-1">
                                      {day === "30"
                                        ? "30 Days"
                                        : day === "90"
                                        ? "90 Days"
                                        : "1 Year"}
                                    </h3>
                                    {forecast?.[day] &&
                                    typeof forecast[day] === "object" ? (
                                      <div className="space-y-3 text-sm text-[#f5f5f7]/90">
                                        {forecast[day][
                                          "Summary of expected progress or changes"
                                        ] && (
                                          <div>
                                            <h4 className="font-medium text-[#A2BFFE]/90">
                                              Progress & Changes
                                            </h4>
                                            <p className="mt-1">
                                              {
                                                forecast[day][
                                                  "Summary of expected progress or changes"
                                                ]
                                              }
                                            </p>
                                          </div>
                                        )}

                                        {forecast[day][
                                          "Potential challenges"
                                        ] && (
                                          <div>
                                            <h4 className="font-medium text-[#A2BFFE]/90">
                                              Challenges
                                            </h4>
                                            <p className="mt-1">
                                              {
                                                forecast[day][
                                                  "Potential challenges"
                                                ]
                                              }
                                            </p>
                                          </div>
                                        )}

                                        {forecast[day]["Motivation tips"] && (
                                          <div>
                                            <h4 className="font-medium text-[#A2BFFE]/90">
                                              Motivation & Tips
                                            </h4>
                                            <p className="mt-1">
                                              {forecast[day]["Motivation tips"]}
                                            </p>
                                          </div>
                                        )}

                                        {/* For any other properties we didn't explicitly handle */}
                                        {Object.entries(forecast[day])
                                          .filter(
                                            ([key]) =>
                                              ![
                                                "Summary of expected progress or changes",
                                                "Potential challenges",
                                                "Motivation tips",
                                              ].includes(key)
                                          )
                                          .map(([key, value]) => (
                                            <div key={key}>
                                              <h4 className="font-medium text-[#A2BFFE]/90">
                                                {key}
                                              </h4>
                                              <p className="mt-1">
                                                {typeof value === "string"
                                                  ? value
                                                  : JSON.stringify(value)}
                                              </p>
                                            </div>
                                          ))}
                                      </div>
                                    ) : (
                                      <pre className="whitespace-pre-wrap text-sm text-[#f5f5f7]/90">
                                        {forecast?.[day]
                                          ? typeof forecast[day] === "string"
                                            ? forecast[day]
                                            : JSON.stringify(
                                                forecast[day],
                                                null,
                                                2
                                              )
                                          : "No data."}
                                      </pre>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </section>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Visualization Preview */}
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">
                  Visualization Preview
                </h2>
                {!mermaidCode ? (
                  <div className="flex flex-col items-center justify-center h-[300px] sm:h-[500px] border border-dashed border-[#333] rounded-lg">
                    <svg
                      className="h-12 w-12 sm:h-16 sm:w-16 text-[#333]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-4 text-[#555] text-sm text-center">
                      Enter your habit details and generate a visualization
                    </p>
                  </div>
                ) : (
                  <div className="overflow-auto border border-[#222] rounded-lg p-2 sm:p-4 bg-[#0c0c0c] min-h-[300px] sm:min-h-[500px]">
                    {loading ? (
                      <div className="flex items-center justify-center h-[300px] sm:h-[500px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A2BFFE]"></div>
                      </div>
                    ) : (
                      <div
                        ref={mermaidRef}
                        className="mermaid-container flex justify-center"
                        style={{ minHeight: "300px" }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-6">
                Saved Visualizations
              </h2>
              {loadingSaved ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A2BFFE]"></div>
                </div>
              ) : savedVisualizations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    No Saved Visualizations
                  </h3>
                  <p className="text-[#f5f5f7]/60 mb-6">
                    Create and save habit visualizations to see them here
                  </p>
                  <motion.button
                    onClick={() => setActiveTab("create")}
                    className="bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] px-6 py-2.5 rounded-full font-bold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Visualization
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedVisualizations.map((visualization) => (
                    <motion.div
                      key={visualization._id}
                      className="bg-[#111] border border-[#222] rounded-lg p-4 cursor-pointer hover:border-[#A2BFFE]/30"
                      whileHover={{ y: -2 }}
                      onClick={() => loadVisualization(visualization._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#A2BFFE]">
                            {visualization.habitName}
                          </h3>
                          {visualization.habitDescription && (
                            <p className="text-sm text-[#f5f5f7]/60 mt-1 line-clamp-2">
                              {visualization.habitDescription}
                            </p>
                          )}
                          <p className="text-xs text-[#f5f5f7]/40 mt-2">
                            {new Date(
                              visualization.updatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.button
                          onClick={(e) =>
                            deleteVisualization(visualization._id, e)
                          }
                          className="text-[#f5f5f7]/60 hover:text-[#EF4444] p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={() =>
            setDeleteConfirmation({ isOpen: false, visualizationId: null })
          }
          onConfirm={handleConfirmDelete}
          title="Delete Visualization"
          message="Are you sure you want to delete this visualization? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </main>
    </div>
  );
};

export default HabitVisualizer;
