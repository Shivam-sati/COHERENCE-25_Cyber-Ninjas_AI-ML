'use client';

import { motion } from 'framer-motion';
import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react';
import { AnalyticsData } from '@/types';

interface DashboardLayoutProps {
  data: AnalyticsData;
  children: React.ReactNode;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardLayout({ data, children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-8"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            variants={item}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Resumes
                </p>
                <p className="text-2xl font-bold">{data.totalResumes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processed
                </p>
                <p className="text-2xl font-bold">{data.processedResumes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Processing Time
                </p>
                <p className="text-2xl font-bold">
                  {data.averageProcessingTime}s
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (data.processedResumes / data.totalResumes) * 100
                  )}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className="rounded-lg border bg-card p-6">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
} 