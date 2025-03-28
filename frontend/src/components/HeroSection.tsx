import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Users, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze resumes in seconds"
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Smart Matching",
    description: "Perfect candidate-job matching with ML"
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Talent Pool",
    description: "Access to a vast network of qualified candidates"
  },
  {
    icon: <BarChart className="h-5 w-5" />,
    title: "Analytics",
    description: "Data-driven insights for better hiring"
  }
];

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Resume Screening <br />
              for the Modern HR Team
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your recruitment process with our intelligent platform that analyzes, matches, and ranks candidates automatically.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              className="rounded-full h-12 px-6 text-base bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200 group"
            >
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full h-12 px-6 text-base hover:bg-accent/50 transition-colors"
            >
              <Link to="/demo">
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="text-primary mb-2">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 md:mt-16 relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-xl blur-lg opacity-30 animate-pulse" />
            <div className="relative rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/60" />
              <img
                src="https://placehold.co/1200x600/4361EE/FFFFFF.webp?text=AI+Resume+Screening+Dashboard"
                alt="ResumeAI Dashboard"
                className="w-full rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
