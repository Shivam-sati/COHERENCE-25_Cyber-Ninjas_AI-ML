import { router } from '../trpc';
import { resumeRouter } from './resume';
import { analysisRouter } from './analysis';

export const appRouter = router({
  resume: resumeRouter,
  analysis: analysisRouter,
});

export type AppRouter = typeof appRouter; 