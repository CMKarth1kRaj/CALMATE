import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Get current authenticated user
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const user = await ctx.db
            .query("appUsers")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return user;
    },
});

// Create user profile on first login
export const ensureUserCreated = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Check if user already exists
        const existingUser = await ctx.db
            .query("appUsers")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (existingUser) {
            return existingUser._id;
        }

        // Create new user with defaults
        const newUserId = await ctx.db.insert("appUsers", {
            userId,
            email: args.email,
            name: args.name || "User",
            age: 25,
            gender: "other",
            heightCm: 170,
            weightKg: 70,
            goal: "maintain",
            conditions: [],
            activityLevel: "moderately_active",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Create initial streak record
        await ctx.db.insert("streaks", {
            userId,
            currentStreakDays: 0,
            bestStreakDays: 0,
            lastLogDate: new Date().toISOString().split("T")[0],
        });

        return newUserId;
    },
});

// Get user profile
export const getUserProfile = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const user = await ctx.db
            .query("appUsers")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return user;
    },
});

// Update user profile and recalculate daily targets
export const updateUserProfile = mutation({
    args: {
        name: v.optional(v.string()),
        age: v.optional(v.number()),
        gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
        heightCm: v.optional(v.number()),
        weightKg: v.optional(v.number()),
        goal: v.optional(
            v.union(
                v.literal("lose"),
                v.literal("gain"),
                v.literal("maintain"),
                v.literal("muscle")
            )
        ),
        targetWeight: v.optional(v.number()),
        conditions: v.optional(v.array(v.string())),
        activityLevel: v.optional(
            v.union(
                v.literal("sedentary"),
                v.literal("lightly_active"),
                v.literal("moderately_active"),
                v.literal("very_active"),
                v.literal("extremely_active")
            )
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db
            .query("appUsers")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Update user profile
        const updateData: any = { updatedAt: Date.now() };
        if (args.name !== undefined) updateData.name = args.name;
        if (args.age !== undefined) updateData.age = args.age;
        if (args.gender !== undefined) updateData.gender = args.gender;
        if (args.heightCm !== undefined) updateData.heightCm = args.heightCm;
        if (args.weightKg !== undefined) updateData.weightKg = args.weightKg;
        if (args.goal !== undefined) updateData.goal = args.goal;
        if (args.conditions !== undefined) updateData.conditions = args.conditions;
        if (args.activityLevel !== undefined) updateData.activityLevel = args.activityLevel;

        await ctx.db.patch(user._id, updateData);

        // Calculate daily nutrition targets
        const updatedUser = { ...user, ...updateData };

        // BMR calculation (Mifflin-St Jeor)
        let bmr = 0;
        if (updatedUser.gender === "male") {
            bmr = 10 * updatedUser.weightKg + 6.25 * updatedUser.heightCm - 5 * updatedUser.age + 5;
        } else {
            bmr = 10 * updatedUser.weightKg + 6.25 * updatedUser.heightCm - 5 * updatedUser.age - 161;
        }

        // Activity multipliers
        const activityMultipliers: Record<string, number> = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
            extremely_active: 1.9,
        };

        const tdee = bmr * activityMultipliers[updatedUser.activityLevel];
        let targetCalories = tdee;

        // Adjust based on goal
        if (updatedUser.goal === "lose") targetCalories -= 500;
        if (updatedUser.goal === "gain") targetCalories += 500;
        if (updatedUser.goal === "muscle") targetCalories += 300;

        // Macro targets (30% protein, 40% carbs, 30% fat)
        const targetProtein = Math.round((targetCalories * 0.3) / 4);
        const targetCarbs = Math.round((targetCalories * 0.4) / 4);
        const targetFat = Math.round((targetCalories * 0.3) / 9);
        const targetSodium = 2300; // WHO recommendation

        // Create or update today's plan
        const today = new Date().toISOString().split("T")[0];
        const existingPlan = await ctx.db
            .query("plans")
            .withIndex("by_userId_date", (q) => q.eq("userId", userId).eq("date", today))
            .first();

        if (existingPlan) {
            await ctx.db.patch(existingPlan._id, {
                targetCalories: Math.round(targetCalories),
                targetProtein,
                targetCarbs,
                targetFat,
                targetSodium,
            });
        } else {
            await ctx.db.insert("plans", {
                userId,
                date: today,
                targetCalories: Math.round(targetCalories),
                targetProtein,
                targetCarbs,
                targetFat,
                targetSodium,
                consumedCalories: 0,
                consumedProtein: 0,
                consumedCarbs: 0,
                consumedFat: 0,
                consumedSodium: 0,
            });
        }

        return user._id;
    },
});
