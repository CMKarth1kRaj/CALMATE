import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Get daily plan for a specific date
export const getDailyPlan = query({
    args: {
        date: v.optional(v.string()), // YYYY-MM-DD, defaults to today
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const targetDate = args.date || new Date().toISOString().split("T")[0];

        const plan = await ctx.db
            .query("plans")
            .withIndex("by_userId_date", (q) =>
                q.eq("userId", userId).eq("date", targetDate)
            )
            .first();

        return plan;
    },
});

// Save AI-generated daily plan summary
export const saveDailyPlanSummary = mutation({
    args: {
        date: v.string(), // YYYY-MM-DD
        aiPlanSummary: v.string(),
        targetCalories: v.optional(v.number()),
        targetProtein: v.optional(v.number()),
        targetCarbs: v.optional(v.number()),
        targetFat: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const existingPlan = await ctx.db
            .query("plans")
            .withIndex("by_userId_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .first();

        const planData = {
            aiPlanSummary: args.aiPlanSummary,
            ...(args.targetCalories !== undefined && { targetCalories: args.targetCalories }),
            ...(args.targetProtein !== undefined && { targetProtein: args.targetProtein }),
            ...(args.targetCarbs !== undefined && { targetCarbs: args.targetCarbs }),
            ...(args.targetFat !== undefined && { targetFat: args.targetFat }),
        };

        if (existingPlan) {
            await ctx.db.patch(existingPlan._id, planData);
            return existingPlan._id;
        } else {
            // If no plan exists for this date, create one with default values
            const planId = await ctx.db.insert("plans", {
                userId,
                date: args.date,
                targetCalories: args.targetCalories ?? 2000,
                targetProtein: args.targetProtein ?? 150,
                targetCarbs: args.targetCarbs ?? 200,
                targetFat: args.targetFat ?? 66,
                aiPlanSummary: args.aiPlanSummary,
                consumedCalories: 0,
                consumedProtein: 0,
                consumedCarbs: 0,
                consumedFat: 0,
            });
            return planId;
        }
    },
});
