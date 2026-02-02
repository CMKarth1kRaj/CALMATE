import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,

    // User profiles (application specific data)
    appUsers: defineTable({
        userId: v.string(), // Auth user ID
        name: v.string(),
        email: v.string(),
        age: v.number(),
        gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
        heightCm: v.number(),
        weightKg: v.number(),
        goal: v.union(
            v.literal("lose"),
            v.literal("gain"),
            v.literal("maintain"),
            v.literal("muscle")
        ),
        conditions: v.array(v.string()), // ["diabetes", "bp", "pcos", etc.]
        activityLevel: v.union(
            v.literal("sedentary"),
            v.literal("lightly_active"),
            v.literal("moderately_active"),
            v.literal("very_active"),
            v.literal("extremely_active")
        ),
        state: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_userId", ["userId"]).index("by_email", ["email"]),

    // Daily nutrition plans
    plans: defineTable({
        userId: v.string(),
        date: v.string(), // YYYY-MM-DD
        targetCalories: v.number(),
        targetProtein: v.number(),
        targetCarbs: v.number(),
        targetFat: v.number(),
        aiPlanSummary: v.optional(v.string()), // AI-generated daily plan
        consumedCalories: v.optional(v.number()),
        consumedProtein: v.optional(v.number()),
        consumedCarbs: v.optional(v.number()),
        consumedFat: v.optional(v.number()),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_date", ["userId", "date"]),

    // Logged meals
    meals: defineTable({
        userId: v.string(),
        timestamp: v.number(),
        type: v.union(
            v.literal("breakfast"),
            v.literal("lunch"),
            v.literal("dinner"),
            v.literal("snack")
        ),
        imageUrl: v.string(),
        totalCalories: v.number(),
        totalProtein: v.number(),
        totalCarbs: v.number(),
        totalFat: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_timestamp", ["userId", "timestamp"]),

    // Individual dishes in each meal
    mealItems: defineTable({
        mealId: v.id("meals"),
        dishKey: v.string(), // e.g., "roti", "dal_tadka"
        dishName: v.string(),
        servings: v.number(),
        calories: v.number(),
        protein: v.number(),
        carbs: v.number(),
        fat: v.number(),
    }).index("by_mealId", ["mealId"]),

    // User streaks
    streaks: defineTable({
        userId: v.string(),
        currentStreakDays: v.number(),
        bestStreakDays: v.number(),
        lastLogDate: v.string(), // YYYY-MM-DD
    }).index("by_userId", ["userId"]),
});
