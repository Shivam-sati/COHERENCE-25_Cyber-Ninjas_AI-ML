import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileSearch, BrainCircuit, BarChart4, UserRoundSearch, AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <FileSearch className="h-10 w-10" />,
    title: "Multi-format Resume Parsing",
    description: "Upload PDF, DOCX, or images with our advanced drag-and-drop system for instant parsing.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <BrainCircuit className="h-10 w-10" />,
    title: "AI-Powered Analysis",
    description: "Our NLP engine extracts and categorizes skills, experience, and education with high accuracy.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <UserRoundSearch className="h-10 w-10" />,
    title: "Intelligent Matching",
    description: "Match candidates to jobs based on skills, experience, and culture fit with customizable weights.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <AlertTriangle className="h-10 w-10" />,
    title: "Bias Detection",
    description: "Identify and mitigate unconscious bias across multiple dimensions for fair hiring practices.",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: <BarChart4 className="h-10 w-10" />,
    title: "Custom Scoring",
    description: "Customize how candidates are scored with adjustable weights for different criteria.",
    color: "from-teal-500 to-teal-600"
  },
  {
    icon: <Calendar className="h-10 w-10" />,
    title: "One-click Scheduling",
    description: "Schedule interviews directly from the platform with automated calendar integration.",
    color: "from-blue-500 to-blue-600"
  },
];

const benefits = [
  "Reduces time-to-hire by up to 75%",
  "Improves quality of hires through objective assessment",
  "Eliminates unconscious bias from the screening process",
  "Scales effortlessly with your recruitment needs",
  "Integrates with your existing HR tech stack"
];

export function FeaturesSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Modern Recruiters
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform combines advanced AI with intuitive design to streamline your hiring process.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                  feature.color
                )} />
                <CardHeader>
                  <div className={cn(
                    "mb-3 text-transparent bg-clip-text bg-gradient-to-r",
                    feature.color
                  )}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-xl blur-lg opacity-30" />
          <div className="relative rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Why HR Teams{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Love Our Platform
              </span>
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-start group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <span className="ml-3 text-muted-foreground group-hover:text-foreground transition-colors">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-8 text-center"
            >
              <button className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                Learn more about our features
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
