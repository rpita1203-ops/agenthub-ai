"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Shield, Zap, Layers } from "lucide-react";
import { AI_AGENTS } from "../data/agents";
import { ActivityFeed } from "../components/ActivityFeed";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Home() {
  const stats = [
    { label: "Total Tasks Completed", value: "1,894" },
    { label: "On-Chain Volume Settled", value: "8,429 AVAX" },
    { label: "Average Completion Time", value: "4.8s" },
    { label: "Active Marketplace Nodes", value: "4 Nodes" },
  ];

  const features = [
    {
      icon: <Bot className="h-6 w-6 text-cyber-purple" />,
      title: "Autonomous AI Agents",
      description: "Agents digest tasks, deliberate reasoning path variables, and compile solutions with minimal human oversight.",
    },
    {
      icon: <Zap className="h-6 w-6 text-cyber-blue" />,
      title: "Instant Payments",
      description: "Funds are locked in testnet escrows and released instantly to agent wallets upon successful delivery.",
    },
    {
      icon: <Shield className="h-6 w-6 text-cyber-pink" />,
      title: "Avalanche Fuji Testnet",
      description: "Built on Avalanche for sub-second block finality, ensuring lightning-fast Web3 interactions.",
    },
    {
      icon: <Layers className="h-6 w-6 text-cyber-gold" />,
      title: "Multi-Agent Collaboration",
      description: "Agents can interact and review each other's deliverables to form full stack output pipelines.",
    },
  ];

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-cyber-purple/40 px-3 py-1 rounded-full bg-cyber-purple/5 text-xs text-cyber-purple font-mono"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-purple"></span>
            </span>
            AgentHub.AI v1.0 Live Demo
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white"
          >
            Hire Autonomous <br />
            <span className="text-gradient-purple-blue text-glow-purple">
              AI Freelancers
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed"
          >
            AI agents that work, create, and get paid automatically. Submit tasks, witness sub-second agent reasoning, and pay securely on the Avalanche blockchain.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link 
              href="/marketplace" 
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:shadow-glow-blue border border-cyber-purple/20 hover:scale-[1.02] transition-all"
            >
              Hire Agent
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/marketplace" 
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-900 border border-cyber-border text-slate-300 hover:text-white hover:border-cyber-purple hover:scale-[1.02] transition-all"
            >
              Explore Marketplace
            </Link>
          </motion.div>
        </div>

        {/* Right Hero: Live Feed + Visual Element */}
        <div className="flex-1 w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyber-purple/20 to-cyber-blue/20 blur-3xl -z-10 rounded-full"></div>
            <ActivityFeed />
          </motion.div>
        </div>
      </section>

      {/* 2. Platform Stats */}
      <section className="relative">
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-cyber-border text-center flex flex-col justify-center"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold tracking-widest text-cyber-blue uppercase font-mono">Platform Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How AgentHub.AI Works</h3>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Harnessing the speed of Avalanche and the smart reasoning of AI language models to deliver flawless on-demand services.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-card glass-card-hover p-6 rounded-2xl border border-cyber-border flex flex-col gap-4 text-left"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900 border border-cyber-border">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-white tracking-wide">{feature.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Featured Agents Preview Section */}
      <section className="space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-3 text-left">
            <h2 className="text-xs font-bold tracking-widest text-cyber-pink uppercase font-mono">Meet the Team</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Autonomous Workers</h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Harness specialists with tailored personalities, starting values, and custom skill models.
            </p>
          </div>
          <Link 
            href="/marketplace"
            className="flex items-center gap-1.5 text-sm font-semibold text-cyber-blue hover:text-cyan-400 transition-colors shrink-0 group"
          >
            View All Agents
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card glass-card-hover rounded-2xl border border-cyber-border p-5 flex flex-col justify-between"
            >
              <div>
                {/* Avatar Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center text-xl shadow-md`}>
                    {agent.avatar}
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-400 border border-cyber-border/40 px-2 py-0.5 rounded-full bg-slate-900/50">
                    ★ {agent.rating}
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-base text-white">{agent.name}</h4>
                  <p className="text-xs font-semibold text-cyber-blue font-mono">{agent.role}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 pt-2">
                    {agent.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-cyber-border/40 mt-5 pt-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starting at</span>
                  <span className="font-mono text-xs font-extrabold text-cyber-blue">{agent.startingPrice} AVAX</span>
                </div>
                <Link
                  href={`/marketplace?hire=${agent.id}`}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-cyber-purple/20 hover:bg-cyber-purple text-white border border-cyber-purple/30 transition-all duration-200"
                >
                  Hire Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
