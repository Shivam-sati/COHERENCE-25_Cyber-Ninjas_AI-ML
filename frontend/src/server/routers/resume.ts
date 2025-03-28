import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  fileType: z.string().optional(),
  companyId: z.string().optional(),
});

export const resumeRouter = router({
  create: protectedProcedure
    .input(resumeSchema)
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.prisma.resume.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return resume;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const resumes = await ctx.prisma.resume.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        company: true,
        analyses: true,
      },
    });
    return resumes;
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const resume = await ctx.prisma.resume.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
        include: {
          company: true,
          analyses: true,
        },
      });

      if (!resume) {
        throw new Error('Resume not found');
      }

      return resume;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: resumeSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const resume = await ctx.prisma.resume.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: input.data,
      });
      return resume;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.resume.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
      return { success: true };
    }),
}); 