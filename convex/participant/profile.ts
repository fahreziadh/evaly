import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";

export const getProfile = query({
    args: {},
    handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
        return undefined;
      }
      const user = await ctx.db
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", userId))
        .first();
      
  
      return user
    },
  });