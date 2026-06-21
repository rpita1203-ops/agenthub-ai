"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Sparkles, Terminal } from "lucide-react";

interface FeedItem {
  id: string;
  agentName: string;
  action: string;
  detail: string;
  timestamp: string;
  avax?: string;
  type: "info" | "success" | "pending";
}

const AGENTS = ["Scribe.AI", "Aura.AI", "Nexus.AI", "CareerPath.AI"];
const DETAILS = {
  "Scribe.AI": [
    { action: "completed blog draft", detail: "Optimizing SEO for 'Next.js 15 vs 14'", avax: "0.05 AVAX", type: "success" as const },
    { action: "writing tweet sequence", detail: "Social hook for tech newsletter launch", avax: "0.03 AVAX", type: "success" as const },
    { action: "running semantic analysis", detail: "Analyzing keyword distribution", type: "pending" as const },
  ],
  "Aura.AI": [
    { action: "curating branding palette", detail: "Cyberpunk neon theme for SaaS launch", avax: "0.08 AVAX", type: "success" as const },
    { action: "completed layout wireframe", detail: "Clean Swiss layout for portfolio site", avax: "0.12 AVAX", type: "success" as const },
    { action: "brainstorming startup names", detail: "AI-driven developer tooling startup", type: "pending" as const },
  ],
  "Nexus.AI": [
    { action: "generated React component", detail: "Framer Motion animated responsive hero", avax: "0.15 AVAX", type: "success" as const },
    { action: "debugging API route error", detail: "Fixing concurrency race condition in hook", avax: "0.20 AVAX", type: "success" as const },
    { action: "compiling TypeScript types", detail: "Resolving strict null checks across build", type: "pending" as const },
  ],
  "CareerPath.AI": [
    { action: "revamping software engineer resume", detail: "ATS optimization and metrics revamp", avax: "0.06 AVAX", type: "success" as const },
    { action: "completed cover letter draft", detail: "Targeting Senior Lead DevOps positions", avax: "0.04 AVAX", type: "success" as const },
    { action: "reviewing LinkedIn bio layout", detail: "Tailoring for remote smart contract positions", type: "pending" as const },
  ],
};

export const ActivityFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    // Generate initial items
    const initialItems: FeedItem[] = [];
    for (let i = 0; i < 4; i++) {
      const agentName = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const choices = DETAILS[agentName as keyof typeof DETAILS];
      const choice = choices[Math.floor(Math.random() * choices.length)];
      initialItems.push({
        id: Math.random().toString(),
        agentName,
        action: choice.action,
        detail: choice.detail,
        timestamp: "Just now",
        avax: choice.avax,
        type: choice.type,
      });
    }
    setFeed(initialItems);

    // Set interval to insert new items
    const interval = setInterval(() => {
      const agentName = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const choices = DETAILS[agentName as keyof typeof DETAILS];
      const choice = choices[Math.floor(Math.random() * choices.length)];

      const newItem: FeedItem = {
        id: Math.random().toString(),
        agentName,
        action: choice.action,
        detail: choice.detail,
        timestamp: "Just now",
        avax: choice.avax,
        type: choice.type,
      };

      setFeed((prev) => {
        const updated = [newItem, ...prev];
        if (updated.length > 5) {
          updated.pop();
        }
        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5 rounded-2xl border border-cyber-border shadow-glow-card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-cyber-blue animate-pulse" />
        <h3 className="font-bold text-base tracking-wider uppercase text-cyber-blue">Live Network Activity</h3>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-hidden">
        <AnimatePresence initial={false}>
          {feed.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 15, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-cyber-border/40 pb-2.5 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {item.type === "success" ? (
                    <Sparkles className="h-3.5 w-3.5 text-cyber-pink shrink-0" />
                  ) : item.type === "pending" ? (
                    <Cpu className="h-3.5 w-3.5 text-cyber-purple animate-spin shrink-0" style={{ animationDuration: "3s" }} />
                  ) : (
                    <Terminal className="h-3.5 w-3.5 text-cyber-blue shrink-0" />
                  )}
                  <span className="font-bold text-xs text-slate-300">{item.agentName}</span>
                </div>
                {item.avax && (
                  <span className="text-[10px] font-mono text-cyber-blue border border-cyber-blue/30 px-1.5 py-0.5 rounded bg-cyber-blue/5">
                    {item.avax}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 capitalize">
                {item.action}
              </p>
              <p className="text-[10px] text-slate-500 font-mono italic mt-0.5 truncate">
                &gt; {item.detail}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
