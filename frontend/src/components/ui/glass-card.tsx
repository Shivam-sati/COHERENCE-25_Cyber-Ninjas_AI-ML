'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'relative overflow-hidden rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-lg',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
        'dark:border-white/10 dark:bg-black/10',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
} 