/**
 * Functions related to reading & writing presence data.
 *
 * Note: this file does not currently implement authorization.
 * That is left as an exercise to the reader. Some suggestions for a production
 * app:
 * - Use Convex `auth` to authenticate users rather than passing up a "user"
 * - Check that the user is allowed to be in a given room.
 */
import { v } from "convex/values";
import { internalMutation, mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";

const LIST_LIMIT = 200;
const MARK_AS_GONE_MS = 3_000;

/**
 * Overwrites the presence data for a given user in a test.
 *
 * It will also set the "updated" timestamp to now, and create the presence
 * document if it doesn't exist yet.
 *
 * @param testId - The test associated with the presence data.
 * @param participantId - The participant associated with the presence data.
 */
export const update = mutation({
  args: { testId: v.id("test"), participantId: v.string(), data: v.any() },
  handler: async (ctx, { testId, participantId, data }) => {
    const existing = await ctx.db
      .query("testPresence")
      .withIndex("by_test_id_present_particiapnt", (q) =>
        q.eq("testId", testId).eq("participantId", participantId)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        data,
        present: true,
        latestJoinedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("testPresence", {
        participantId,
        testId,
        data,
        present: true,
        latestJoinedAt: Date.now(),
      });
    }
  },
});

/**
 * Updates the "updated" timestamp for a given user's presence in a room.
 *
 * @param testId - The test associated with the presence data.
 * @param participantId - The participant associated with the presence data.
 */
export const heartbeat = mutation({
  args: { testId: v.id("test"), participantId: v.string() },
  handler: async (ctx, { testId, participantId }) => {
    const existing = await ctx.db
      .query("testPresenceHeartbeats")
      .withIndex("by_participant_test", (q) =>
        q.eq("participantId", participantId).eq("testId", testId)
      )
      .unique();

    const markAsGone = await ctx.scheduler.runAfter(
      MARK_AS_GONE_MS,
      internal.participant.testPresence.markAsGone,
      { testId, participantId }
    );

    if (existing) {
      const watchdog = await ctx.db.system.get(existing.markAsGone);
      if (watchdog && watchdog.state.kind === "pending") {
        await ctx.scheduler.cancel(watchdog._id);
      }

      await ctx.db.patch(existing._id, {
        markAsGone,
      });
    } else {
      await ctx.db.insert("testPresenceHeartbeats", {
        participantId,
        testId,
        markAsGone,
      });
    }
  },
});

export const markAsGone = internalMutation({
  args: { testId: v.id("test"), participantId: v.string() },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("testPresence")
      .withIndex("by_test_id_present_particiapnt", (q) =>
        q.eq("testId", args.testId).eq("participantId", args.participantId)
      )
      .unique();

    if (!presence || presence.present === false) {
      return;
    }

    await ctx.db.patch(presence._id, { present: false });
  },
});

/**
 * Lists the presence data for N users in a room, ordered by recent update.
 *
 * @param testId - The test associated with the presence data.
 * @returns A list of presence objects, ordered by recent update, limited to
 * the most recent N.
 */
export const list = query({
  args: { testId: v.id("test") },
  handler: async (ctx, { testId }) => {
    const presence = await ctx.db
      .query("testPresence")
      .withIndex("by_test_id_present_join", (q) =>
        q.eq("testId", testId).eq("present", true)
      )
      .take(LIST_LIMIT);
    return presence.map(
      ({ _creationTime, latestJoinedAt, participantId, data, present }) => ({
        created: _creationTime,
        latestJoinedAt,
        participantId,
        data,
        present,
      })
    );
  },
});
