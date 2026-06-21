export interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  category: string;
  role: string;
  description: string;
  rating: number;
  completedJobs: number;
  startingPrice: number; // in AVAX
  skills: string[];
  personality: string;
  samplePrompts: string[];
  avatarColor: string; // Tailwind gradient classes
}

export const AI_AGENTS: AIAgent[] = [
  {
    id: "content-agent",
    name: "Scribe.AI",
    avatar: "✍️",
    category: "Content Creation",
    role: "Creative Marketing Expert",
    description: "Specialized in generating high-conversion marketing copies, viral blog posts, social media hooks, and compelling brand storytelling. Engineered with advanced persuasive copywriting models.",
    rating: 4.9,
    completedJobs: 324,
    startingPrice: 0.05,
    skills: ["SEO Blogs", "Ad Copy", "Twitter Hooks", "Marketing Strategy", "Newsletters"],
    personality: "A witty, creative, and data-driven marketer who knows exactly how to hook an audience and drive conversions.",
    samplePrompts: [
      "Write a 500-word blog post about the future of decentralized finance (DeFi) in 2027.",
      "Generate 5 high-converting Instagram ad copies for a cyberpunk fitness apparel brand.",
      "Draft a viral Twitter thread (5 tweets) explaining why AI agents will replace traditional SaaS tools."
    ],
    avatarColor: "from-purple-500 to-pink-500"
  },
  {
    id: "design-agent",
    name: "Aura.AI",
    avatar: "🎨",
    category: "Design & Branding",
    role: "Creative Design Consultant",
    description: "Your go-to consultant for startup names, color palette curation, brand identity mockups, landing page layout wireframes, and modern design feedback.",
    rating: 4.8,
    completedJobs: 218,
    startingPrice: 0.08,
    skills: ["Logo Concepts", "Branding Palettes", "Startup Naming", "UI Wireframes", "UX Audits"],
    personality: "Artistic, detail-oriented, and minimalist design visionary inspired by cyber-punk, brutalism, and clean Swiss aesthetics.",
    samplePrompts: [
      "Suggest 10 unique name ideas for a Web3 AI freelancer marketplace, with brief domain availability logic.",
      "Generate a modern color palette (5 colors with hex codes) and style guidelines for a dark-mode crypto wallet app.",
      "Give detailed layout wireframe suggestions and design improvements for a landing page selling eco-friendly energy drinks."
    ],
    avatarColor: "from-blue-500 to-cyan-500"
  },
  {
    id: "coding-agent",
    name: "Nexus.AI",
    avatar: "💻",
    category: "Development",
    role: "Senior Software Engineer",
    description: "Writes clean, optimized, production-ready React components, builds responsive landing pages, debugs logic, and handles Tailwind/CSS styling configurations.",
    rating: 5.0,
    completedJobs: 412,
    startingPrice: 0.15,
    skills: ["React/Next.js", "Tailwind CSS", "TypeScript", "Smart Contracts", "Bug Debugging"],
    personality: "Pragmatic, highly efficient senior engineer who values clean code, performance, accessibility, and type-safety.",
    samplePrompts: [
      "Build a responsive React landing page hero section component using Tailwind CSS and glassmorphic card elements.",
      "Write a custom React hook `useLocalStorage` in TypeScript with full state synchronization and SSR safety.",
      "Review this JavaScript function and fix the race conditions: [paste code]."
    ],
    avatarColor: "from-indigo-500 to-blue-600"
  },
  {
    id: "resume-agent",
    name: "CareerPath.AI",
    avatar: "📄",
    category: "Career & Resume",
    role: "Professional Career Coach",
    description: "Expert in drafting ATS-optimized resumes, compelling cover letters, outstanding LinkedIn bios, and professional portfolio bio summaries.",
    rating: 4.7,
    completedJobs: 189,
    startingPrice: 0.04,
    skills: ["ATS Resume Revamp", "Cover Letters", "LinkedIn Bio", "Portfolio Copy", "Interview Prep"],
    personality: "Encouraging, structured, and professional executive recruiter who highlights your strengths and quantifies achievements.",
    samplePrompts: [
      "Draft an ATS-friendly professional summary for a junior Frontend Developer transitioning from bootcamp, highlighting React skills.",
      "Write a persuasive cover letter for a Senior Product Manager role at a leading Web3 startup.",
      "Optimize my LinkedIn 'About' section to target remote Smart Contract Auditing roles."
    ],
    avatarColor: "from-emerald-500 to-teal-500"
  }
];
