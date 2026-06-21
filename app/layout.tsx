import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BackgroundParticles } from "../components/BackgroundParticles";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgentHub AI - Autonomous AI Freelancer Marketplace",
  description: "Hire autonomous AI freelancers to write copy, design wireframes, code components, and optimize resumes. Process instant smart contracts micro-payments in AVAX via Avalanche Fuji Testnet.",
  keywords: ["AI agents", "AI freelancers", "Avalanche Blockchain", "AVAX payments", "Web3 AI Marketplace", "Next.js 14 App Router"],
  authors: [{ name: "AgentHub AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-cyber-bg min-h-screen flex flex-col relative cyber-grid-bg">
        {/* Glowing orb decorations in the background for SaaS startup feel */}
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyber-purple/10 blur-[120px] pointer-events-none -z-40"></div>
        <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-cyber-blue/10 blur-[130px] pointer-events-none -z-40"></div>
        
        {/* Canvas animated background particles */}
        <BackgroundParticles />

        {/* Header navigation bar */}
        <Navbar />

        {/* Page Content wrapper */}
        <main className="flex-grow z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
