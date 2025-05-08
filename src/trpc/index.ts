import { auth } from "@/lib/auth";
import { createOrganizer } from "@/services/organization/organizer/create-organizer";
import { getSelectedOrganizerByUserId } from "@/services/organization/organizer/get-selected-organizer-byuserid";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Session, User } from "better-auth/types";
import { ZodError } from "zod";

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const sessionRes = await auth.api.getSession({
    headers: req.headers,
  });

  const session: Session | undefined = sessionRes?.session;
  const user: User | undefined = sessionRes?.user;

  return { session, user, };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause?.flatten()
            : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

export const organizerProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  let organizer = await getSelectedOrganizerByUserId(ctx.user.id);

  if (!organizer) {
    organizer = await createOrganizer(ctx.user.id);
  }

  return next({
    ctx: {
      organizer: organizer,
      user: ctx.user,
      session: ctx.session,
    },
  });
});

export const participantProcedure = publicProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user || !ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        user: ctx.user,
        session: ctx.session,
      },
    });
  }
);
