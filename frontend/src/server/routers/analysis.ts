import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

const analysisSchema = z.object({
  resumeId: z.string(),
  skills: z.array(z.string()),
  sentiment: z.string(),
  confidence: z.number().min(0).max(1),
  keyPhrases: z.array(z.string()),
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  recommendations: z.array(z.string()),
  culturalFit: z.number().min(0).max(1),
});

export const analysisRouter = router({
  create: protectedProcedure
    .input(analysisSchema)
    .mutation(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return analysis;
    }),

  getByResumeId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const analyses = await ctx.prisma.analysis.findMany({
        where: {
          resumeId: input,
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return analyses;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });

      if (!analysis) {
        throw new Error('Analysis not found');
      }

      return analysis;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: analysisSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const analysis = await ctx.prisma.analysis.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: input.data,
      });
      return analysis;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.analysis.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
      return { success: true };
    }),

  // Special procedures for different roles
  getCompanyAnalyses: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const analyses = await ctx.prisma.analysis.findMany({
        where: {
          resume: {
            companyId: input,
          },
        },
        include: {
          resume: true,
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return analyses;
    }),
}); 