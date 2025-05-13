import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const newWhistlist = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email;
    const currentWhistlist = await ctx.db
      .query("whistlist")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    if (currentWhistlist) {
      return false;
    }
    await ctx.db.insert("whistlist", { email });
    return true;
  },
});
