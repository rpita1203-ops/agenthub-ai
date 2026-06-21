"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, DollarSign, Clock, ExternalLink, CheckCircle2, ChevronRight, ArrowUpRight, Copy, Check, Download, Trash2, X } from "lucide-react";
import { AI_AGENTS } from "../../data/agents";

interface TaskItem {
  id: string;
  agentId: string;
  agentName: string;
  avatar: string;
  role: string;
  prompt: string;
  output: string;
  budget: number;
  txHash: string;
  timestamp: string;
  status: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("agenthub_tasks");
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch (e) {
          console.error("Error reading localStorage tasks", e);
        }
      }
    }
  }, []);

  // Delete task entry helper
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task record from history?")) {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      localStorage.setItem("agenthub_tasks", JSON.stringify(updated));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
    }
  };

  // Metrics Calculations
  const totalSpent = tasks.reduce((sum, item) => sum + item.budget, 0);
  const completedJobsCount = tasks.filter((t) => t.status === "Completed").length;

  const stats = [
    { label: "Jobs Completed", value: completedJobsCount, icon: <CheckCircle2 className="h-5 w-5 text-cyber-blue" /> },
    { label: "Total AVAX Spent", value: `${totalSpent.toFixed(3)} AVAX`, icon: <DollarSign className="h-5 w-5 text-cyber-purple" /> },
    { label: "Active Escrows", value: "0", icon: <Clock className="h-5 w-5 text-cyber-pink" /> },
  ];

  // Actions
  const handleCopy = () => {
    if (selectedTask?.output) {
      navigator.clipboard.writeText(selectedTask.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!selectedTask) return;
    const element = document.createElement("a");
    const file = new Blob([selectedTask.output], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTask.agentName}_delivery_${selectedTask.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">User Dashboard</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl">
          Track transaction histories, review finalized agent outputs, and manage deployed task parameters.
        </p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-cyber-border flex items-center justify-between"
          >
            <div className="text-left space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {stat.value}
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-900 border border-cyber-border/80 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Task History & Favorite Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Task list history */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3">
            <h3 className="font-extrabold text-lg text-white">Execution Logs</h3>
            <span className="text-xs font-mono text-slate-500">{tasks.length} Deployed Contracts</span>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="glass-card glass-card-hover rounded-xl border border-cyber-border/80 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer relative group text-left"
              >
                <div className="flex gap-4 items-center max-w-full">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-cyber-purple/20 to-cyber-blue/20 border border-cyber-border flex items-center justify-center text-xl shrink-0">
                    {task.avatar}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm">{task.agentName}</h4>
                      <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-md">
                      Prompt: {task.prompt}
                    </p>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Deployed: {task.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-0 border-cyber-border/20 pt-3 sm:pt-0 gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold text-cyber-blue">
                    {task.budget} AVAX
                  </span>
                  <div className="flex gap-2 items-center">
                    {task.txHash && (
                      <a
                        href={`https://testnet.snowtrace.io/tx/${task.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="View on Snowtrace Fuji"
                        className="text-slate-500 hover:text-cyber-blue transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      title="Delete record"
                      className="text-slate-500 hover:text-cyber-pink transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border border-cyber-border/60">
                <Briefcase className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-pulse" />
                <h4 className="font-bold text-white text-sm">No task transactions found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Submit tasks to digital agents in the marketplace. Deployed records and output deliverables will automatically load here.
                </p>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 text-xs font-bold rounded-lg bg-cyber-purple text-white shadow-glow-purple"
                >
                  Explore Marketplace
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Favorite/Featured Agents list */}
        <div className="space-y-6">
          <div className="border-b border-cyber-border/40 pb-3 text-left">
            <h3 className="font-extrabold text-lg text-white">Frequent Freelancers</h3>
          </div>

          <div className="space-y-4 text-left">
            {AI_AGENTS.slice(0, 3).map((agent) => (
              <div
                key={agent.id}
                className="glass-card rounded-xl border border-cyber-border p-4 space-y-3 relative group"
              >
                <div className="flex gap-3 items-center">
                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center text-xl`}>
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                    <p className="text-[10px] text-cyber-blue font-mono font-medium">{agent.role}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between border-t border-cyber-border/20 pt-2 text-[10px]">
                  <span className="font-mono text-slate-500">Starting: {agent.startingPrice} AVAX</span>
                  <Link
                    href={`/marketplace?hire=${agent.id}`}
                    className="text-cyber-blue font-bold hover:underline flex items-center gap-0.5"
                  >
                    Quick Hire
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverable Viewer Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-[#02000c]/85 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-cyber-bg/95 border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-glow-purple z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyber-border/40 pb-4 mb-6 text-left">
                <div className="flex gap-3 items-center">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-cyber-purple/20 to-cyber-blue/20 border border-cyber-border flex items-center justify-center text-xl shrink-0">
                    {selectedTask.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Delivery from {selectedTask.agentName}</h3>
                    <p className="text-[10px] font-mono text-slate-500">Task Reference: {selectedTask.id}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-cyber-border text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    title="Download document (.md)"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-cyber-border text-slate-400 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Meta information grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-cyber-border/30 text-left text-xs mb-6 font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block">Prompt Submitted:</span>
                  <p className="text-slate-300 font-sans mt-0.5">{selectedTask.prompt}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 block">Settled Budget:</span>
                    <span className="text-cyber-blue font-bold">{selectedTask.budget} AVAX</span>
                  </div>
                  {selectedTask.txHash && (
                    <div>
                      <span className="text-slate-500 block">Transaction Record:</span>
                      <a
                        href={`https://testnet.snowtrace.io/tx/${selectedTask.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyber-purple hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        View Fuji Explorer ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Render Output Content */}
              <div className="glass-card bg-[#05021a] rounded-xl border border-cyber-border/80 p-5 font-sans text-slate-300 text-sm max-h-[300px] overflow-y-auto leading-relaxed text-left select-text">
                <div className="prose prose-invert max-w-none space-y-4">
                  {selectedTask.output.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-white mt-4 border-b border-cyber-border/40 pb-1">{line.replace("# ", "")}</h1>;
                    if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-cyber-blue mt-3">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-bold text-cyber-purple mt-2">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("- ")) return <li key={i} className="list-disc list-inside ml-2">{line.replace("- ", "")}</li>;
                    if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-cyber-pink bg-cyber-pink/5 p-3 rounded italic my-2">{line.replace("> ", "")}</blockquote>;
                    if (line.startsWith("```")) return null;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-cyber-border text-slate-300 hover:text-white transition-all"
                >
                  Close Deliverable
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
