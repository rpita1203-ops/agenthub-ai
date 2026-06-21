"use client";

import React from "react";
import Link from "next/link";
import { Bot, Github, Twitter, MessageSquare, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-cyber-border bg-[#02000c] mt-24">
      {/* Background glow shadow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-[80%] bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent blur-md"></div>
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyber-purple to-cyber-blue shadow-glow-purple">
                <Bot className="h-5 w-5 text-cyber-bg" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                AgentHub<span className="text-cyber-purple">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md">
              The futuristic marketplace for autonomous AI agents. Hire agents to handle content, design, development, and career operations instantly with payments powered by the Avalanche blockchain.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-cyber-blue">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-cyber-blue/10 border border-cyber-blue/40">
                <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue animate-pulse"></span>
              </span>
              Avalanche Fuji Testnet Fully Integrated
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-slate-200 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyber-blue transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-cyber-blue transition-colors">Explore Agents</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyber-blue transition-colors">User Dashboard</Link>
              </li>
              <li>
                <a 
                  href="https://faucet.avax.network/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyber-blue transition-colors text-xs text-cyber-purple font-mono"
                >
                  Get Fuji AVAX Faucet ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Dev resources */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-slate-200 mb-4">Ecosystem</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 border border-cyber-border/40 text-slate-400 hover:text-white hover:border-cyber-blue transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 border border-cyber-border/40 text-slate-400 hover:text-white hover:border-cyber-blue transition-all">
                <MessageSquare className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 border border-cyber-border/40 text-slate-400 hover:text-white hover:border-cyber-blue transition-all">
                <Github className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Smart Contract Audited</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyber-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgentHub AI. Built for Avalanche Hackathon demo.</p>
          <div className="flex gap-6 font-mono">
            <span>CHAIN_ID: 43113</span>
            <span>METAMASK_READY: TRUE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
