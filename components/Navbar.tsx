"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "../hooks/useWeb3";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Wallet, Menu, X, Cpu, LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { account, balance, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Agents", path: "/marketplace" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyber-border bg-cyber-bg/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-blue shadow-glow-purple group-hover:scale-105 transition-transform duration-200">
                <Bot className="h-6 w-6 text-cyber-bg" />
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-blue blur-sm opacity-50"></div>
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyber-blue bg-clip-text text-transparent">
                AgentHub<span className="text-cyber-purple">.AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative text-sm font-medium tracking-wide transition-colors py-2"
                >
                  <span className={isActive ? "text-cyber-blue font-semibold text-glow-blue" : "text-slate-300 hover:text-white"}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-purple to-cyber-blue"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Stats & Wallet Connection */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 border border-cyber-border/40 px-3 py-1.5 rounded-full bg-slate-900/50 text-xs text-slate-400">
              <Cpu className="h-3.5 w-3.5 text-cyber-blue animate-pulse" />
              <span className="active-pulse font-mono pl-3">4,192 Nodes Online</span>
            </div>

            {isConnected && account ? (
              <div className="flex items-center gap-2 bg-slate-950 border border-cyber-purple/40 rounded-xl pl-4 pr-1.5 py-1 text-sm shadow-glow-purple">
                <div className="flex flex-col items-end">
                  <span className="font-mono text-xs font-bold text-white">
                    {formatAddress(account)}
                  </span>
                  {balance && (
                    <span className="text-[10px] font-mono text-cyber-blue">
                      {parseFloat(balance).toFixed(4)} AVAX
                    </span>
                  )}
                </div>
                <button
                  onClick={disconnectWallet}
                  title="Disconnect Wallet"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple hover:text-white transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyber-purple via-violet-600 to-cyber-blue text-white shadow-glow-purple hover:shadow-glow-blue border border-cyber-purple/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cyber-border bg-[#05021a] px-4 pt-2 pb-6 space-y-4"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-cyber-purple/10 text-cyber-blue font-bold border-l-2 border-cyber-blue"
                        : "text-slate-300 hover:bg-slate-900/40 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-cyber-border/40 pt-4 space-y-3">
              <div className="flex items-center justify-between px-3">
                <span className="text-xs text-slate-400 font-mono">Status:</span>
                <span className="text-xs text-cyber-blue font-mono flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyber-blue animate-pulse"></span>
                  4,192 Nodes Online
                </span>
              </div>

              {isConnected && account ? (
                <div className="bg-slate-950/80 border border-cyber-purple/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-white">{formatAddress(account)}</span>
                    {balance && (
                      <span className="text-[10px] font-mono text-cyber-blue">{parseFloat(balance).toFixed(4)} AVAX</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 text-xs text-cyber-purple hover:bg-cyber-purple hover:text-white transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
