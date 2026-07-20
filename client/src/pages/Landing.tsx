import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  BarChart3,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { SplitText } from "../components/react-bits/SplitText";
import ElectricBorder from "../components/react-bits/ElectricBorder";
import MagicBento from "../components/react-bits/MagicBento";
import SplashCursor from "../components/react-bits/SplashCursor";
import GridScan from "../components/react-bits/GridScan";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30 overflow-hidden relative">
      <SplashCursor RAINBOW_MODE={false} COLOR="#6366f1" />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 inset-x-0 h-[100vh] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[140px]" />
      </div>

      {/* Grid Pattern using requested utility */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#1e293b"
          gridScale={0.1}
          scanColor="#6366f1"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/10 dark:border-white/5">
        <div className="app-container h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-glow">
              <ChefHat size={22} />
            </div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight">
              Restora
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/login"
              className="text-sm font-semibold hidden md:block hover:text-primary transition-colors text-slate-600 dark:text-slate-300"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 md:py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-glow transition-all active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 md:pt-48 pb-20 md:pb-32 px-6 flex flex-col items-center text-center relative">
        <div className="app-container">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-4xl mx-auto space-y-8 flex flex-col items-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs md:text-sm font-semibold tracking-wide"
            >
              Welcome to Restora
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.1] tracking-tight"
            >
              <SplitText text="Restaurant Management," className="block" />
              <span className="text-gradient block mt-2">Perfected.</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Unify your front-of-house, kitchen, and back-office with our
              lightning-fast, highly intuitive operations platform. Built for
              modern hospitality.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto"
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95"
              >
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-all active:scale-95"
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="mt-20 md:mt-28 w-full max-w-6xl mx-auto relative perspective-[2000px]"
          >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background-light dark:from-[#09090b] to-transparent z-10" />

            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 glass p-2 md:p-3 transform-gpu">
              <div className="bg-[#111] rounded-[1.5rem] overflow-hidden border border-white/5 relative">
                {/* Subtle top reflection */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1600"
                  alt="Dashboard Preview"
                  className="w-full h-auto opacity-90 object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-24 md:py-32 relative z-10">
        <div className="app-container">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight">
              A unified operating system
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">
              Everything you need to run your venue seamlessly, elegantly
              designed into a single, cohesive platform.
            </p>
          </div>

          <div className="max-w-6xl mx-auto w-full">
            <MagicBento
              textAutoHide={false}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={15}
              glowColor="99, 102, 241"
              cardData={[
                {
                  title: "Real-Time Kitchen Sync",
                  description:
                    "Orders fire instantly to the kitchen display system. No delays, no lost tickets. Just perfect synchronization between front and back of house.",
                  label: "Operations",
                },
                {
                  title: "Smart Inventory",
                  description:
                    "Automated tracking, low-stock alerts, and predictive ordering. Never run out of your best-sellers again.",
                  label: "Management",
                },
                {
                  title: "Multi-Branch RBAC",
                  description:
                    "Enterprise-grade roles and permissions. Manage access across multiple locations with granular control.",
                  label: "Security",
                },
                {
                  title: "Staff Management",
                  description:
                    "Scheduling, time-tracking, and payroll integrations built directly into the POS. Manage your team as effortlessly as your menu.",
                  label: "Team",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 relative z-10">
        <div className="app-container">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">
              No hidden fees, no long-term contracts. Start small and upgrade as
              you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Starter */}
            <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40">
              <h3 className="text-xl font-medium text-slate-500 dark:text-slate-400 mb-2">
                Starter
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-bold">$49</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 h-10">
                Perfect for food trucks and small cafes.
              </p>
              <Link
                to="/signup"
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-center font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-8"
              >
                Get Started
              </Link>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> 1 Location
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> 2 Terminals
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Basic
                  Analytics
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Email
                  Support
                </li>
              </ul>
            </div>

            {/* Professional (Highlighted) */}
            <ElectricBorder
              color="#6366f1"
              speed={1}
              chaos={0.15}
              borderRadius={32}
              className="md:-my-4 z-10 scale-100 md:scale-105 shadow-2xl shadow-primary/20"
            >
              <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 h-full w-full border-0">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full" />

                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-6">
                  Most Popular
                </div>
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
                  Professional
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl md:text-5xl font-bold">$129</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 h-10">
                  For established restaurants needing full power.
                </p>
                <Link
                  to="/signup"
                  className="block w-full py-3 px-4 rounded-xl bg-primary text-white text-center font-semibold hover:bg-primary/90 shadow-glow transition-all mb-8"
                >
                  Get Started
                </Link>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-200 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Up to 3
                    Locations
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited
                    Terminals
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Advanced
                    Inventory
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Staff
                    Management
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> 24/7
                    Priority Support
                  </li>
                </ul>
              </div>
            </ElectricBorder>

            {/* Enterprise */}
            <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40">
              <h3 className="text-xl font-medium text-slate-500 dark:text-slate-400 mb-2">
                Enterprise
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-bold">Custom</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 h-10">
                For large chains and franchise operations.
              </p>
              <Link
                to="/contact"
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-center font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-8"
              >
                Contact Sales
              </Link>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited
                  Locations
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Custom
                  Integrations
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Dedicated
                  Success Manager
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Custom RBAC
                  Roles
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="app-container">
          <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-white/10 dark:border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-600/10 z-0" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
                Ready to elevate your operations?
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10">
                Join the fastest-growing network of forward-thinking restaurants
                standardizing on Restora.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-semibold shadow-glow transition-all active:scale-95"
                >
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-12 px-6 relative z-10 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-[#09090b]">
        <div className="app-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ChefHat size={20} className="text-primary" />
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Restora
            </span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Restora Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
