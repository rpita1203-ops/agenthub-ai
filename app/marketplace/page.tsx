"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AI_AGENTS, AIAgent } from "../../data/agents";
import { useWeb3 } from "../../hooks/useWeb3";
import { Bot, Search, CreditCard, Sparkles, Copy, Check, Download, RotateCw, ExternalLink, Cpu, X } from "lucide-react";
import confetti from "canvas-confetti";

// A sub-component to handle parameters safely within a Suspense block
function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { isConnected, sendAVAXPayment } = useWeb3();

  // Filters & Search State
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Workflow State Machine
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>("");
  const [budgetInput, setBudgetInput] = useState<number>(0.05);

  // Generation / Loading State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reasoningIndex, setReasoningIndex] = useState<number>(0);
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  // Payment State
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Check if URL deep link is provided on load
  useEffect(() => {
    const hireAgentId = searchParams.get("hire");
    if (hireAgentId) {
      const agent = AI_AGENTS.find((a) => a.id === hireAgentId);
      if (agent) {
        handleOpenHireModal(agent);
      }
    }
  }, [searchParams]);

  // Handle sequential reasoning steps animation
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isGenerating && reasoningSteps.length > 0) {
      setReasoningIndex(0);
      intervalId = setInterval(() => {
        setReasoningIndex((prev) => {
          if (prev < reasoningSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(intervalId);
            return prev;
          }
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating, reasoningSteps]);

  // Open Hire Flow
  const handleOpenHireModal = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setPromptInput("");
    setBudgetInput(agent.startingPrice);
    setShowModal(true);
    setGeneratedOutput(null);
    setPaymentSuccess(false);
    setTxHash(null);
  };

  // Submit Prompt to API
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setReasoningIndex(0);
    setGeneratedOutput(null);

    // Initial dummy steps in case API loads extremely fast
    setReasoningSteps([
      "Analyzing request parameters...",
      "Mapping workspace assets...",
      "Synthesizing solution layers...",
      "Polishing output copy..."
    ]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent?.id,
          prompt: promptInput,
          budget: budgetInput,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReasoningSteps(data.reasoningSteps || []);
        // Allow time for reasoning step transitions to finish animating
        const duration = (data.reasoningSteps?.length || 4) * 1000;
        setTimeout(() => {
          setGeneratedOutput(data.output);
          setIsGenerating(false);
        }, Math.max(1200, duration - 1000));
      } else {
        throw new Error(data.error || "Generation failed.");
      }
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setGeneratedOutput(`### ⚠️ Error
Generation pipeline encountered an error: ${errMsg}. Please try again.`);
      setIsGenerating(false);
    }
  };

  // Pay with AVAX on Testnet
  const handlePayAVAX = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first via the top right corner.");
      return;
    }

    setIsPaying(true);
    try {
      const hash = await sendAVAXPayment(budgetInput);
      setTxHash(hash);
      setPaymentSuccess(true);
      
      // Celebrate!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Save to localStorage dashboard data
      const newTask = {
        id: Math.random().toString(36).substring(2, 9),
        agentId: selectedAgent?.id,
        agentName: selectedAgent?.name,
        avatar: selectedAgent?.avatar,
        role: selectedAgent?.role,
        prompt: promptInput,
        output: generatedOutput,
        budget: budgetInput,
        txHash: hash,
        timestamp: new Date().toLocaleString(),
        status: "Completed",
      };

      const existingTasks = JSON.parse(localStorage.getItem("agenthub_tasks") || "[]");
      localStorage.setItem("agenthub_tasks", JSON.stringify([newTask, ...existingTasks]));

    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "AVAX payment transaction failed.";
      alert(errMsg);
    } finally {
      setIsPaying(false);
    }
  };

  // Utility Actions
  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedOutput) return;
    const element = document.createElement("a");
    const file = new Blob([generatedOutput], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedAgent?.name || "agent"}_delivery.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtering Logic
  const categories = ["All", "Content Creation", "Design & Branding", "Development", "Career & Resume"];
  
  const filteredAgents = AI_AGENTS.filter((agent) => {
    const matchesCategory = activeCategory === "All" || agent.category === activeCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Freelancer Marketplace</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Browse specialized autonomous AI agents, deploy tasks directly onto their execution sandboxes, and settle delivery records via secure block finality.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/60 p-4 rounded-2xl border border-cyber-border/40 backdrop-blur-md">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple border border-cyber-purple/20"
                  : "text-slate-400 hover:text-white bg-slate-900 border border-cyber-border/40"
              }`}
            >
              {cat === "Content Creation" ? "Content" : cat === "Design & Branding" ? "Design" : cat === "Career & Resume" ? "Career" : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search agents, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-cyber-border/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-blue transition-colors font-sans"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredAgents.map((agent) => (
          <motion.div
            key={agent.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl border border-cyber-border p-6 flex flex-col justify-between relative overflow-hidden group hover:border-cyber-blue/60 hover:shadow-glow-blue transition-all duration-300"
          >
            {/* Glowing top boundary highlight on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div>
              {/* Header profile block */}
              <div className="flex gap-4 items-start">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center text-3xl shadow-lg border border-white/10 shrink-0`}>
                  {agent.avatar}
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-white">{agent.name}</h3>
                    <span className="text-[10px] font-mono text-cyber-blue border border-cyber-blue/20 bg-cyber-blue/5 px-2 py-0.5 rounded">
                      {agent.category}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyber-purple font-mono">{agent.role}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 mt-4 leading-relaxed text-left">
                {agent.description}
              </p>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {agent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono font-medium text-slate-300 border border-cyber-border/40 px-2 py-0.5 rounded bg-slate-900/30"
                  >
                    #{skill}
                  </span>
                ))}
              </div>

              {/* Meta stats */}
              <div className="flex gap-4 mt-5 text-[11px] font-mono text-slate-500">
                <span>Rating: <strong className="text-slate-300">★ {agent.rating}</strong></span>
                <span>•</span>
                <span>Completed Jobs: <strong className="text-slate-300">{agent.completedJobs}+</strong></span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-cyber-border/40 mt-6 pt-4 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starting Price</span>
                <span className="font-mono text-base font-extrabold text-cyber-blue">{agent.startingPrice} AVAX</span>
              </div>

              <button
                onClick={() => handleOpenHireModal(agent)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                Hire Now
              </button>
            </div>
          </motion.div>
        ))}

        {filteredAgents.length === 0 && (
          <div className="col-span-full text-center py-16 glass-card rounded-2xl border border-cyber-border">
            <Bot className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-bounce" />
            <p className="text-slate-400 text-sm">No digital workers match your query.</p>
          </div>
        )}
      </div>

      {/* Task Submission Flow Modal */}
      <AnimatePresence>
        {showModal && selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isGenerating && !isPaying) setShowModal(false); }}
              className="absolute inset-0 bg-[#02000c]/85 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-cyber-bg/95 border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-glow-purple z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                disabled={isGenerating || isPaying}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Flow State 1: Form Input */}
              {!isGenerating && !generatedOutput && (
                <div className="space-y-6">
                  {/* Agent Header */}
                  <div className="flex gap-4 items-center">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${selectedAgent.avatarColor} flex items-center justify-center text-2xl shadow-md`}>
                      {selectedAgent.avatar}
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-extrabold text-white">Deploy Task to {selectedAgent.name}</h2>
                      <p className="text-xs text-cyber-blue font-mono">{selectedAgent.role}</p>
                    </div>
                  </div>

                  <form onSubmit={handleTaskSubmit} className="space-y-5 text-left">
                    {/* Prompt input */}
                    <div className="space-y-2">
                      <label htmlFor="taskPrompt" className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                        What is your request prompt?
                      </label>
                      <textarea
                        id="taskPrompt"
                        rows={4}
                        required
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        placeholder="e.g. Write a 500-word blog post about scaling blockchains..."
                        className="w-full bg-slate-900/80 border border-cyber-border rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyber-blue transition-colors placeholder-slate-500 font-sans resize-none"
                      />
                    </div>

                    {/* Budget & Wallet State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="taskBudget" className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                          Budget (AVAX)
                        </label>
                        <input
                          id="taskBudget"
                          type="number"
                          step="0.01"
                          min={selectedAgent.startingPrice}
                          required
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(parseFloat(e.target.value) || selectedAgent.startingPrice)}
                          className="w-full bg-slate-900/80 border border-cyber-border rounded-xl px-4 py-3 text-sm text-cyber-blue font-mono font-bold focus:outline-none focus:border-cyber-purple transition-colors"
                        />
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Minimum starting: {selectedAgent.startingPrice} AVAX
                        </span>
                      </div>

                      {/* Prompt Shortcuts */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide block">
                          Sample Prompts
                        </span>
                        <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1">
                          {selectedAgent.samplePrompts.map((sample, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPromptInput(sample)}
                              className="w-full text-left truncate text-[10px] text-slate-400 hover:text-white border border-cyber-border/30 hover:border-cyber-purple bg-slate-950/40 px-2.5 py-1.5 rounded-lg font-sans transition-all"
                            >
                              💡 {sample}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:scale-[1.01] active:scale-95 transition-all"
                    >
                      <Sparkles className="h-4 w-4" />
                      Initialize Agent Sandbox & Generate
                    </button>
                  </form>
                </div>
              )}

              {/* Flow State 2: AI Reasoning Progress */}
              {isGenerating && (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-6">
                  {/* Pulse Loader */}
                  <div className="relative flex items-center justify-center h-20 w-20">
                    <div className="absolute h-full w-full rounded-full bg-cyber-purple/20 animate-ping"></div>
                    <div className="absolute h-[80%] w-[80%] rounded-full bg-cyber-blue/10 animate-pulse"></div>
                    <Cpu className="h-10 w-10 text-cyber-blue animate-spin" style={{ animationDuration: "4s" }} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-wide">Autonomous Operations Initialized</h3>
                    <p className="text-xs font-mono text-slate-500">Agent: {selectedAgent.name}</p>
                  </div>

                  {/* Sequential Reasoning Steps */}
                  <div className="w-full max-w-sm space-y-2.5 pt-4 text-left">
                    {reasoningSteps.map((step, idx) => {
                      const isActive = idx === reasoningIndex;
                      const isCompleted = idx < reasoningIndex;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
                            isActive
                              ? "bg-cyber-blue/5 border-cyber-blue text-cyber-blue active-pulse"
                              : isCompleted
                              ? "bg-slate-900/30 border-cyber-border/40 text-slate-500"
                              : "border-transparent text-slate-700"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{
                            backgroundColor: isActive ? "#00f0ff" : isCompleted ? "#7b61ff" : "#0f172a"
                          }}></span>
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Flow State 3: Output Result and Escrow Payment */}
              {!isGenerating && generatedOutput && (
                <div className="space-y-6 text-left">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
                    <div className="flex gap-3 items-center">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${selectedAgent.avatarColor} flex items-center justify-center text-xl`}>
                        {selectedAgent.avatar}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white">{selectedAgent.name} Deliverables</h3>
                        <p className="text-[11px] font-mono text-slate-500">Status: Pending Escrow Settlement</p>
                      </div>
                    </div>

                    {/* Copy/Download/Regenerate */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        title="Copy content"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-cyber-border text-slate-400 hover:text-white transition-colors"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        title="Download Markdown"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-cyber-border text-slate-400 hover:text-white transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleTaskSubmit}
                        title="Regenerate Work"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-cyber-border text-slate-400 hover:text-white transition-colors"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Output Display Card */}
                  <div className="glass-card bg-[#05021a] rounded-xl border border-cyber-border/80 p-5 font-sans text-slate-300 text-sm max-h-[300px] overflow-y-auto leading-relaxed overflow-x-hidden select-text">
                    <div className="prose prose-invert max-w-none text-left space-y-4">
                      {/* Formatted markdown simulator */}
                      {generatedOutput.split("\n").map((line, i) => {
                        if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-white mt-4 border-b border-cyber-border/40 pb-1">{line.replace("# ", "")}</h1>;
                        if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-cyber-blue mt-3">{line.replace("## ", "")}</h2>;
                        if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-cyber-purple mt-2">{line.replace("### ", "")}</h3>;
                        if (line.startsWith("- ")) return <li key={i} className="list-disc list-inside ml-2">{line.replace("- ", "")}</li>;
                        if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-cyber-pink bg-cyber-pink/5 p-3 rounded italic my-2">{line.replace("> ", "")}</blockquote>;
                        if (line.startsWith("```")) return null; // simplify code blocks rendering
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Payment Escrow settlement screen */}
                  <div className="glass-card p-5 rounded-xl border border-cyber-border/80 bg-cyber-purple/5 space-y-4">
                    {!paymentSuccess ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Required Escrow Settlement</span>
                          <span className="font-mono text-lg font-extrabold text-cyber-blue">{budgetInput} AVAX</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Please sign Avalanche testnet payment to view fully.</span>
                        </div>

                        <button
                          onClick={handlePayAVAX}
                          disabled={isPaying}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
                        >
                          <CreditCard className="h-4 w-4" />
                          {isPaying ? "Approving Wallet..." : "Pay with AVAX"}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl animate-bounce">
                          ✓
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white">Escrow Payment Settled!</h4>
                          <p className="text-xs text-slate-400">Transaction completed. Delivery records uploaded to dashboard.</p>
                        </div>

                        {txHash && (
                          <div className="bg-slate-900 border border-cyber-border/40 p-2.5 rounded-lg inline-flex items-center gap-2 max-w-full">
                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                              TX: {txHash}
                            </span>
                            <a
                              href={`https://testnet.snowtrace.io/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyber-blue hover:text-cyan-400 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        <div className="pt-2 flex justify-center gap-3">
                          <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-cyber-border text-slate-300 hover:text-white hover:border-cyber-purple transition-all"
                          >
                            Close
                          </button>
                          <Link
                            href="/dashboard"
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyber-purple text-white shadow-glow-purple transition-all"
                          >
                            Go to Dashboard
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Marketplace() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <Cpu className="h-10 w-10 text-cyber-blue animate-spin" />
        <p className="text-slate-400 text-xs font-mono">Synchronizing marketplace nodes...</p>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
