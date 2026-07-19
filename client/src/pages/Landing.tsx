import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  BarChart3,
  Clock,
  ShieldCheck,
  Smartphone,
  Star,
  Utensils,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b-0 border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-glow">
              <ChefHat size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              TastyBytes
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold hidden md:block hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-600 text-white text-sm font-semibold shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-4xl space-y-8"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            The Future of Restaurant Management
          </motion.div>
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight"
          >
            Run your restaurant <br className="hidden md:block" />
            <span className="text-gradient">with perfect precision.</span>
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Elevate your culinary business with a world-class POS, inventory
            management, and real-time analytics platform built for modern
            restaurants.
          </motion.p>
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 shadow-glow transition-all hover:scale-105"
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/60 dark:hover:bg-slate-800/60 font-semibold transition-all"
            >
              Book a Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 w-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-[#09090b] via-transparent to-transparent z-10" />
          <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 glass-card p-2 md:p-4">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200"
              alt="Dashboard Preview"
              className="w-full h-auto rounded-xl md:rounded-2xl opacity-80"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-6 max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything you need to scale
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Stop juggling multiple tools. TastyBytes brings your point-of-sale,
            inventory, and staff management into one beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BarChart3,
              title: "Real-time Analytics",
              desc: "Make decisions based on live data. Track sales, popular items, and staff performance instantly.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Clock,
              title: "Lightning Fast POS",
              desc: "Process orders in seconds. Our optimized interface ensures your staff never keeps customers waiting.",
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: ShieldCheck,
              title: "Enterprise Security",
              desc: "Bank-grade encryption protects your business data. Role-based access ensures staff only see what they need.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-white/5 bg-black/5 dark:bg-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">
            Trusted by top restaurants worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos placeholders */}
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Smartphone /> GastroTech
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Utensils /> BistroPrime
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Star /> CulinaryPro
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-600/20 z-0" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to transform your restaurant?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of forward-thinking restaurants that have upgraded
              their operations with TastyBytes.
            </p>
            <Link
              to="/signup"
              className="inline-flex px-10 py-5 rounded-full bg-primary hover:bg-primary-600 text-white text-lg font-bold shadow-glow transition-all hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 relative z-10 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ChefHat size={20} className="text-primary" />
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
              TastyBytes
            </span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} TastyBytes Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
