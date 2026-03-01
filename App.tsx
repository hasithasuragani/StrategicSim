/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle, 
  ChevronRight, 
  Play, 
  RefreshCw, 
  Info, 
  BarChart3, 
  Cpu,
  BrainCircuit,
  Maximize2,
  X,
  Layers,
  TrendingUp,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---

interface TimelineStep {
  time: string;
  action: string;
  impact: string;
}

interface Strategy {
  name: string;
  explanation: string;
  steps: string[];
  timeline: TimelineStep[];
  risk_score: number;
  success_probability: number;
  complexity: number;
  resource_usage: number;
  outcome: string;
  failure_points: string;
  critique: string;
}

interface SimulationResult {
  shortTerm: string;
  midTerm: string;
  longTerm: string;
}

// --- Constants & Mock Data ---

// --- Components ---

const ProgressBar = ({ value, colorClass, label }: { value: number, colorClass: string, label: string }) => (
  <div className="mb-4">
    <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider font-mono text-slate-500">
      <span>{label}</span>
      <span className="font-bold">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${colorClass}`}
      />
    </div>
  </div>
);

interface StrategyCardProps {
  strategy: Strategy;
  index: number;
  onSimulate: (s: Strategy) => void | Promise<void>;
  onExplainConfidence: (s: Strategy) => Promise<string[]>;
  onStressTest: (s: Strategy, i: number) => Promise<void>;
  stressResult: any;
  isStressTesting: boolean;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ 
  strategy, 
  index, 
  onSimulate,
  onExplainConfidence,
  onStressTest,
  stressResult,
  isStressTesting
}) => {
  const [confidenceExplanation, setConfidenceExplanation] = useState<string[] | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const borderColors = ["border-emerald-500", "border-blue-500", "border-rose-500"];
  const textColors = ["text-emerald-600", "text-blue-600", "text-rose-600"];
  const accentBgs = ["bg-emerald-50", "bg-blue-50", "bg-rose-50"];
  const darkTextColors = ["dark:text-emerald-400", "dark:text-blue-400", "dark:text-rose-400"];
  const darkAccentBgs = ["dark:bg-emerald-900/30", "dark:bg-blue-900/30", "dark:bg-rose-900/30"];

  const handleExplainConfidence = async () => {
    setIsExplaining(true);
    try {
      const explanation = await onExplainConfidence(strategy);
      setConfidenceExplanation(explanation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-xl p-6 border-t-4 ${borderColors[index % 3]} border-gray-200 dark:border-gray-700 flex flex-col h-full hover:shadow-xl transition-all duration-500 relative`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-xl font-bold tracking-tight ${textColors[index % 3]} ${darkTextColors[index % 3]}`}>{strategy.name}</h3>
        <div className={`p-2 rounded-lg ${accentBgs[index % 3]} ${darkAccentBgs[index % 3]} ${textColors[index % 3]} ${darkTextColors[index % 3]}`}>
          {index === 0 ? <Shield size={20} /> : index === 1 ? <Zap size={20} /> : <Target size={20} />}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed italic">
        "{strategy.explanation}"
      </p>

      <div className="space-y-1 mb-6">
        <ProgressBar label="Risk Level" value={strategy.risk_score} colorClass={index === 0 ? "bg-emerald-500" : index === 1 ? "bg-blue-500" : "bg-rose-500"} />
        <div className="relative">
          <ProgressBar label="Success Prob." value={strategy.success_probability} colorClass="bg-blue-600 dark:bg-purple-600" />
          
          <button 
            onClick={handleExplainConfidence}
            disabled={isExplaining}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mt-3 text-xs font-bold flex items-center transition-all disabled:opacity-50"
          >
            {isExplaining ? (
              <RefreshCw size={14} className="mr-2 animate-spin" />
            ) : (
              <HelpCircle size={14} className="mr-2" />
            )}
            Why this confidence?
          </button>

          <AnimatePresence>
            {confidenceExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2 font-bold">Confidence Explanation</h5>
                  <ul className="space-y-1">
                    {confidenceExplanation.map((point, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="mr-2 text-purple-500">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <ProgressBar label="Complexity" value={strategy.complexity} colorClass="bg-amber-500" />
        <ProgressBar label="Resource Use" value={strategy.resource_usage} colorClass="bg-indigo-500" />
      </div>

      <div className="flex-grow">
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center">
            <Layers size={14} className="mr-2" /> Strategy Timeline
          </h4>
          <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
            {strategy.timeline?.map((phase, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-sm z-10 ${index === 0 ? 'bg-emerald-400' : index === 1 ? 'bg-blue-400' : 'bg-rose-400'}`} />
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{phase.time}</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{phase.action}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{phase.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 mb-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center">
            <TrendingUp size={14} className="mr-2" /> Expected Outcome
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{strategy.outcome}</p>
        </div>

        <div className="mb-6">
          <button 
            onClick={() => onStressTest(strategy, index)}
            disabled={isStressTesting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center transition-all disabled:opacity-50"
          >
            {isStressTesting ? (
              <RefreshCw size={14} className="mr-2 animate-spin" />
            ) : (
              <AlertCircle size={14} className="mr-2" />
            )}
            ⚠ Stress Test Strategy
          </button>

          <AnimatePresence>
            {stressResult && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 space-y-4">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-red-600 dark:text-red-400 font-bold">Stress Test Result</h5>
                  
                  <div>
                    <p className="text-[10px] font-bold uppercase text-red-500 dark:text-red-400 mb-1">Worst Case Scenario</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{stressResult.worstCase}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-red-500 dark:text-red-400 mb-1">Success Probability</p>
                    <p className="text-sm font-black text-red-600 dark:text-red-400">{stressResult.successProb}%</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-red-500 dark:text-red-400 mb-1">Main Risk</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{stressResult.mainRisk}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-red-500 dark:text-red-400 mb-1">Mitigation Suggestion</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic">"{stressResult.mitigation}"</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {(isExplaining || isStressTesting) && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center">
            <RefreshCw size={24} className="text-blue-600 dark:text-purple-500 animate-spin mb-2" />
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Running AI analysis...</p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => onSimulate(strategy)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center transition-all hover:shadow-lg active:scale-95"
        >
          <Play size={16} className="mr-2 fill-current" /> Simulate Outcome
        </button>
      </div>
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative glass-card w-full max-w-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-gray-900/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
              <X size={20} />
            </button>
          </div>
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('strategic-sim-theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('strategic-sim-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('strategic-sim-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const [situation, setSituation] = useState('');
  const [resources, setResources] = useState('');
  const [constraints, setConstraints] = useState('');
  const [objective, setObjective] = useState('');
  const [riskTolerance, setRiskTolerance] = useState(50);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("AI strategists thinking...");
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    if (isGenerating) {
      const messages = [
        "AI strategists thinking...",
        "Running simulations...",
        "Evaluating outcomes...",
        "Optimizing resource allocation...",
        "Finalizing strategic report..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [stressResults, setStressResults] = useState<(any | null)[]>([null, null, null]);
  const [isStressTestingArray, setIsStressTestingArray] = useState<boolean[]>([false, false, false]);

  // --- Stats & Indicators ---
  const complexity = useMemo(() => {
    const totalLength = situation.length + resources.length + constraints.length + objective.length;
    if (totalLength === 0) return "NONE";
    if (totalLength < 100) return "LOW";
    if (totalLength < 300) return "MEDIUM";
    return "HIGH";
  }, [situation, resources, constraints, objective]);

  const confidenceScore = useMemo(() => {
    if (strategies.length === 0) return 0;
    const avg = strategies.reduce((acc, s) => acc + s.success_probability, 0) / strategies.length;
    return Math.round(avg);
  }, [strategies]);

  // --- Voting Logic ---
  const handleVote = (index: number, type: 'support' | 'weak') => {
    setStrategies(prev => prev.map((s, i) => {
      if (i === index) {
        return type === 'support' 
          ? { ...s, supportVotes: (s.supportVotes || 0) + 1 }
          : { ...s, weakVotes: (s.weakVotes || 0) + 1 };
      }
      return s;
    }));
  };

  // --- Export Logic ---
  const exportReport = () => {
    const report = {
      title: "StrategicSim - AI War Room Report",
      timestamp: new Date().toLocaleString(),
      scenario: { situation, resources, constraints, objective, riskTolerance },
      analysis: { complexity, confidenceScore },
      strategies: strategies.map(s => ({
        name: s.name,
        explanation: s.explanation,
        risk: s.risk_score,
        success: s.success_probability,
        timeline: s.timeline,
        outcome: s.outcome,
        critique: s.critique
      }))
    };
    
    // Create a formatted text version for "PDF style" feel
    let textReport = `STRATEGICSIM - AI WAR ROOM REPORT\n`;
    textReport += `====================================\n`;
    textReport += `Generated: ${report.timestamp}\n\n`;
    textReport += `SCENARIO ANALYSIS\n`;
    textReport += `-----------------\n`;
    textReport += `Complexity: ${complexity}\n`;
    textReport += `Confidence Score: ${confidenceScore}%\n\n`;
    textReport += `SITUATION: ${situation}\n`;
    textReport += `OBJECTIVE: ${objective}\n\n`;
    textReport += `STRATEGIC OPTIONS\n`;
    textReport += `-----------------\n`;
    
    strategies.forEach((s, i) => {
      textReport += `${i + 1}. ${s.name.toUpperCase()}\n`;
      textReport += `   Risk: ${s.risk_score}% | Success: ${s.success_probability}%\n`;
      textReport += `   Explanation: ${s.explanation}\n`;
      textReport += `   Timeline:\n`;
      s.timeline.forEach(p => textReport += `     - ${p.time}: ${p.action}\n`);
      textReport += `   Outcome: ${s.outcome}\n\n`;
    });

    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StrategicSim_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  // --- Gemini Integration ---

  const generateStrategies = async () => {
    if (!situation || !objective) {
      alert("Please provide at least a Situation and an Objective.");
      return;
    }

    setIsGenerating(true);
    setStrategies([]);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        You are StrategicSim, an AI strategic planning engine.
        Your role is to generate strategic plans that are strictly grounded in the provided scenario.
        You MUST use the scenario information below when generating strategies.
        Do NOT produce generic business strategies unless the scenario itself is business-related.

        ----------------------------------
        SCENARIO INFORMATION
        Current Situation: ${situation}
        Available Resources: ${resources}
        Key Constraints: ${constraints}
        Primary Objective: ${objective}
        Risk Tolerance: ${riskTolerance}/100

        ----------------------------------
        TASK
        Generate THREE strategies:
        1. Conservative Strategy
        2. Balanced Strategy
        3. Aggressive Strategy

        Each strategy must:
        • directly reference the scenario  
        • use the available resources  
        • respect the constraints  
        • aim to achieve the objective  

        ----------------------------------
        CRITICAL RULE
        The strategies must clearly reflect the domain of the scenario.
        Examples:
        - If the scenario involves disaster response → strategies must include evacuation planning, emergency response, resource deployment.
        - If the scenario involves cybersecurity → strategies must include defense systems, monitoring, and threat mitigation.
        - If the scenario involves military operations → strategies must include logistics, defense, or offensive planning.

        If the generated strategy contains unrelated topics like market expansion, supply chains, or corporate growth when the scenario is not business-related, regenerate the strategy.
        Return three clearly different strategies.

        ----------------------------------
        OUTPUT FORMAT (JSON)
        Return a JSON object with exactly this structure:
        {
          "strategies": [
            {
              "name": "Strategy Name",
              "explanation": "Short Description",
              "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
              "timeline": [
                {"time": "Phase 1", "action": "Action description", "impact": "Expected impact"},
                {"time": "Phase 2", "action": "Action description", "impact": "Expected impact"},
                {"time": "Phase 3", "action": "Action description", "impact": "Expected impact"}
              ],
              "risk_score": 0-100,
              "success_probability": 0-100,
              "complexity": 0-100,
              "resource_usage": 0-100,
              "outcome": "Expected Outcome",
              "failure_points": "What could go wrong",
              "critique": "AI analysis of weaknesses"
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    timeline: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING },
                          action: { type: Type.STRING },
                          impact: { type: Type.STRING }
                        },
                        required: ["time", "action", "impact"]
                      }
                    },
                    risk_score: { type: Type.NUMBER },
                    success_probability: { type: Type.NUMBER },
                    complexity: { type: Type.NUMBER },
                    resource_usage: { type: Type.NUMBER },
                    outcome: { type: Type.STRING },
                    failure_points: { type: Type.STRING },
                    critique: { type: Type.STRING }
                  },
                  required: ["name", "explanation", "steps", "timeline", "risk_score", "success_probability", "complexity", "resource_usage", "outcome", "failure_points", "critique"]
                }
              }
            },
            required: ["strategies"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      if (data.strategies) {
        setStrategies(data.strategies);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error generating strategies:", error);
      alert(error.message || "Failed to generate strategies.");
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateOutcome = async (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
         // Fallback logic
      }

      const ai = new GoogleGenAI({ apiKey: apiKey || "" });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        Simulate the outcome of the following strategy in the context of the situation.
        SITUATION: ${situation}
        STRATEGY: ${JSON.stringify(strategy)}
        
        Provide a detailed prediction for:
        1. Short-term result (0-3 months)
        2. Mid-term result (3-12 months)
        3. Long-term result (1-3 years)
        
        Return JSON:
        {
          "shortTerm": "...",
          "midTerm": "...",
          "longTerm": "..."
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              shortTerm: { type: Type.STRING },
              midTerm: { type: Type.STRING },
              longTerm: { type: Type.STRING }
            },
            required: ["shortTerm", "midTerm", "longTerm"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setSimulationResult(data);
    } catch (error) {
      console.error("Simulation error:", error);
      setSimulationResult({
        shortTerm: "Simulation failed. Please check your connection and try again.",
        midTerm: "N/A",
        longTerm: "N/A"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const generateConfidenceExplanation = async (strategy: Strategy) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        Explain why the following strategy received this confidence score.
        Consider:
        feasibility
        resource availability
        risk level
        execution difficulty

        Scenario:
        Situation: ${situation}
        Resources: ${resources}
        Constraints: ${constraints}
        Objective: ${objective}

        Strategy:
        ${strategy.name}: ${strategy.explanation}

        Confidence Score:
        ${strategy.success_probability}%

        Return the explanation as 3–5 short bullet points.
        Return JSON object with "explanation" key containing an array of strings.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["explanation"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      return data.explanation || [];
    } catch (error) {
      console.error("Error explaining confidence:", error);
      return ["Analysis failed. Manual review recommended."];
    }
  };

  const runStressTest = async (strategy: Strategy, index: number) => {
    setIsStressTestingArray(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        You are performing a strategic stress test simulation.
        Analyze the following strategy in the context of the scenario.

        ----------------------------------
        SCENARIO
        ${situation}

        AVAILABLE RESOURCES
        ${resources}

        CONSTRAINTS
        ${constraints}

        OBJECTIVE
        ${objective}

        ----------------------------------
        STRATEGY
        ${strategy.name}: ${strategy.explanation}

        ----------------------------------
        TASK
        Simulate worst-case conditions for this strategy.
        Consider:
        • failure of critical resources
        • unexpected environmental changes
        • operational delays
        • safety risks
        • logistical bottlenecks

        Your analysis must directly reference the scenario.

        ----------------------------------
        RETURN FORMAT (JSON)
        Return a JSON object with these keys:
        - worstCase: Describe a failure scenario specific to this situation.
        - successProb: Provide a new probability estimate after stress testing (number 0-100).
        - mainRisk: Identify the biggest risk in this strategy.
        - mitigation: Suggest a realistic mitigation using the available resources.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              worstCase: { type: Type.STRING },
              successProb: { type: Type.NUMBER },
              mainRisk: { type: Type.STRING },
              mitigation: { type: Type.STRING }
            },
            required: ["worstCase", "successProb", "mainRisk", "mitigation"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setStressResults(prev => {
        const updated = [...prev];
        updated[index] = data;
        return updated;
      });
    } catch (error) {
      console.error("Stress test error:", error);
      setStressResults(prev => {
        const updated = [...prev];
        updated[index] = {
          worstCase: "Systemic failure due to unforeseen variables.",
          successProb: 15,
          mainRisk: "Total resource depletion.",
          mitigation: "Establish emergency contingency fund."
        };
        return updated;
      });
    } finally {
      setIsStressTestingArray(prev => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }
  };

  const recalculateWithModifier = (modifier: string) => {
    let newConstraints = constraints;
    let newResources = resources;

    if (modifier === 'decrease_resources') {
      newResources += " [MODIFIED: 30% reduction in available capital]";
    } else if (modifier === 'increase_pressure') {
      newConstraints += " [MODIFIED: Timeline cut by 50%]";
    } else if (modifier === 'new_constraint') {
      newConstraints += " [MODIFIED: Sudden regulatory shift requiring immediate compliance]";
    }

    setResources(newResources);
    setConstraints(newConstraints);
    generateStrategies();
  };

  return (
    <div className="min-h-screen relative font-sans">
      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-purple-900/20">
              <Cpu className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-gray-100">
                Strategic<span className="text-blue-600 dark:text-purple-500">Sim</span>
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                AI War Room Decision Engine
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm flex flex-col items-center min-w-[120px]">
              <p className="text-[9px] font-mono uppercase text-gray-400 dark:text-gray-500 mb-1">Scenario Complexity</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                complexity === 'HIGH' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 
                complexity === 'MEDIUM' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                complexity === 'LOW' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
              }`}>
                {complexity}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm flex flex-col items-center min-w-[120px]">
              <p className="text-[9px] font-mono uppercase text-gray-400 dark:text-gray-500 mb-1">Strategies Generated</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{strategies.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm flex flex-col items-center min-w-[120px]">
              <p className="text-[9px] font-mono uppercase text-gray-400 dark:text-gray-500 mb-1">Confidence Score</p>
              <p className="text-sm font-bold text-blue-600 dark:text-purple-500">{confidenceScore}%</p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4 border-l border-gray-200 dark:border-gray-700 pl-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center space-x-2 text-xs font-bold"
              >
                {isDarkMode ? (
                  <><span>🌙 Dark</span></>
                ) : (
                  <><span>☀ Light</span></>
                )}
              </button>

              {strategies.length > 0 && (
                <button 
                  onClick={exportReport}
                  className="p-2 bg-blue-600 dark:bg-purple-600 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-purple-700 transition-all shadow-md shadow-blue-100 dark:shadow-purple-900/20"
                  title="Export Strategy Report"
                >
                  <BarChart3 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <section className="glass-card p-6 border-t-4 border-blue-500 dark:border-purple-500">
              <div className="flex items-center mb-6">
                <BrainCircuit className="text-blue-600 dark:text-purple-500 mr-3" size={24} />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Scenario Parameters</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Current Situation</label>
                  <textarea 
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="A government must decide whether to regulate AI systems strictly or allow open innovation while balancing economic growth, security, and ethics."
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:border-blue-500/50 dark:focus:border-purple-500/50 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-purple-500/10 outline-none transition-all h-32 resize-none shadow-inner text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Available Resources</label>
                  <textarea 
                    value={resources}
                    onChange={(e) => setResources(e.target.value)}
                    placeholder="Budget, personnel, technology, assets..."
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:border-blue-500/50 dark:focus:border-purple-500/50 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-purple-500/10 outline-none transition-all h-20 resize-none shadow-inner text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Key Constraints</label>
                  <textarea 
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="Time limits, regulatory hurdles, risks..."
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:border-blue-500/50 dark:focus:border-purple-500/50 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-purple-500/10 outline-none transition-all h-20 resize-none shadow-inner text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Primary Objective</label>
                  <textarea 
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="What is the ultimate goal?"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:border-blue-500/50 dark:focus:border-purple-500/50 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-purple-500/10 outline-none transition-all h-20 resize-none shadow-inner text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">Risk Tolerance</label>
                    <span className={`text-xs font-bold font-mono ${riskTolerance > 70 ? 'text-rose-500' : riskTolerance > 30 ? 'text-blue-600 dark:text-purple-400' : 'text-emerald-500'}`}>
                      {riskTolerance}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-purple-600"
                  />
                </div>

                <button 
                  onClick={generateStrategies}
                  disabled={isGenerating}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-purple-900/20 flex items-center justify-center group overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div 
                        key="loading"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center"
                      >
                        <RefreshCw size={20} className="mr-2 animate-spin" />
                        {loadingMessage}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="ready"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center"
                      >
                        <Zap size={20} className="mr-2 fill-current" />
                        Generate Strategies
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </section>

            {/* What-If Modifier */}
            {strategies.length > 0 && (
              <section className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <Info className="text-amber-500 mr-3" size={20} />
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">What-If Modifiers</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => recalculateWithModifier('decrease_resources')}
                    className="text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all text-xs group"
                  >
                    <span className="block font-bold text-gray-700 dark:text-gray-300 group-hover:text-amber-600">Decrease Resources</span>
                    <span className="text-gray-400 dark:text-gray-500">Simulate a 30% budget cut.</span>
                  </button>
                  <button 
                    onClick={() => recalculateWithModifier('increase_pressure')}
                    className="text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-rose-500/50 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all text-xs group"
                  >
                    <span className="block font-bold text-gray-700 dark:text-gray-300 group-hover:text-rose-600">Increase Pressure</span>
                    <span className="text-gray-400 dark:text-gray-500">Simulate a sudden deadline shift.</span>
                  </button>
                  <button 
                    onClick={() => recalculateWithModifier('new_constraint')}
                    className="text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-purple-500/50 hover:bg-blue-50 dark:hover:bg-purple-900/10 transition-all text-xs group"
                  >
                    <span className="block font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-purple-400">New Constraint</span>
                    <span className="text-gray-400 dark:text-gray-500">Add a regulatory hurdle.</span>
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Results & Visualization */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Decision Visualization */}
            {strategies.length > 0 && (
              <section className="glass-card p-6 overflow-hidden">
                <div className="flex items-center mb-6">
                  <BarChart3 className="text-indigo-600 dark:text-purple-500 mr-3" size={24} />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Decision Tree Visualization</h2>
                </div>
                
                <div className="relative py-8 flex flex-col items-center">
                  <div className="relative z-10 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-purple-400 shadow-md">
                    Initial Situation
                  </div>
                  
                  {/* SVG Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '200px' }}>
                    <path d="M 50% 60 L 20% 120" stroke="currentColor" className="text-blue-500/20 dark:text-purple-500/20" strokeWidth="2" fill="none" />
                    <path d="M 50% 60 L 50% 120" stroke="currentColor" className="text-blue-500/20 dark:text-purple-500/20" strokeWidth="2" fill="none" />
                    <path d="M 50% 60 L 80% 120" stroke="currentColor" className="text-blue-500/20 dark:text-purple-500/20" strokeWidth="2" fill="none" />
                  </svg>

                  <div className="mt-20 grid grid-cols-3 w-full gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-1 h-12 bg-blue-100 dark:bg-gray-800" />
                      <div className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 text-center shadow-sm">
                        Conservative
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-1 h-12 bg-blue-100 dark:bg-gray-800" />
                      <div className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 text-center shadow-sm">
                        Balanced
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-1 h-12 bg-blue-100 dark:bg-gray-800" />
                      <div className="px-4 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 text-center shadow-sm">
                        Aggressive
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Strategy Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {strategies.length > 0 ? (
                strategies.map((strategy: Strategy, index: number) => (
                  <StrategyCard 
                    key={index} 
                    strategy={strategy} 
                    index={index} 
                    onSimulate={simulateOutcome}
                    onExplainConfidence={generateConfidenceExplanation}
                    onStressTest={runStressTest}
                    stressResult={stressResults[index]}
                    isStressTesting={isStressTestingArray[index]}
                  />
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-white/40 dark:bg-gray-900/40">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Maximize2 size={48} className="mb-4 opacity-20" />
                  </motion.div>
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Awaiting Scenario Input</p>
                  <p className="text-sm">Enter parameters on the left to generate strategic options.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Simulation Modal */}
      <Modal 
        isOpen={!!selectedStrategy} 
        onClose={() => setSelectedStrategy(null)} 
        title={`Simulation: ${selectedStrategy?.name}`}
      >
        {isSimulating ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 dark:border-gray-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-blue-600 dark:border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="text-blue-600 dark:text-purple-500 animate-pulse" size={32} />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-600 dark:text-purple-500 animate-pulse">Running Neural Simulation...</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Predicting multi-temporal outcomes based on current variables.</p>
          </div>
        ) : simulationResult ? (
          <div className="space-y-8">
            <div className="relative pl-8 border-l-2 border-emerald-200 dark:border-emerald-900/50">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20" />
              <h4 className="text-sm font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Short-Term Outcome (0-3 Months)</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{simulationResult.shortTerm}</p>
            </div>

            <div className="relative pl-8 border-l-2 border-blue-200 dark:border-blue-900/50">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900/20" />
              <h4 className="text-sm font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Mid-Term Outcome (3-12 Months)</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{simulationResult.midTerm}</p>
            </div>

            <div className="relative pl-8 border-l-2 border-rose-200 dark:border-rose-900/50">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-200 dark:shadow-rose-900/20" />
              <h4 className="text-sm font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2">Long-Term Outcome (1-3 Years)</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{simulationResult.longTerm}</p>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center">
                <AlertTriangle size={14} className="mr-2" /> Strategic Advisory Note
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                This simulation is based on probabilistic modeling. Real-world variables such as "Black Swan" events or irrational actor behavior may significantly alter these projections.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-gray-200 dark:border-gray-800 mt-12 bg-white/20 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">
          <p>© 2026 StrategicSim Systems. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-purple-400 transition-colors">Terms of Engagement</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-purple-400 transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
