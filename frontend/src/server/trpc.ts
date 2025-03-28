import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const t = initTRPC.context().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  return next({
    ctx: {
      ...ctx,
      session,
      prisma,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Role-based middleware
const isAdmin = t.middleware(async ({ next, ctx }) => {
  if (ctx.session?.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(isAdmin);

const isRecruiter = t.middleware(async ({ next, ctx }) => {
  if (ctx.session?.user.role !== 'RECRUITER') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Recruiter access required' });
  }
  return next({ ctx });
});

export const recruiterProcedure = protectedProcedure.use(isRecruiter);

const isManager = t.middleware(async ({ next, ctx }) => {
  if (ctx.session?.user.role !== 'MANAGER') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Manager access required' });
  }
  return next({ ctx });
});

export const managerProcedure = protectedProcedure.use(isManager); 