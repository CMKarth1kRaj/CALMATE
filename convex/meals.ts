import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Get today's overview
export const getTodayOverview = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const today = new Date().toISOString().split("T")[0];

        // Get today's plan
        const plan = await ctx.db
            .query("plans")
            .withIndex("by_userId_date", (q) => q.eq("userId", userId).eq("date", today))
            .first();

        // Get today's meals
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const meals = await ctx.db
            .query("meals")
            .withIndex("by_userId_timestamp", (q) =>
                q.eq("userId", userId).gte("timestamp", startOfDay.getTime()).lte("timestamp", endOfDay.getTime())
            )
            .collect();

        // Get meal items for each meal
        const mealsWithItems = await Promise.all(
            meals.map(async (meal) => {
                const items = await ctx.db
                    .query("mealItems")
                    .withIndex("by_mealId", (q) => q.eq("mealId", meal._id))
                    .collect();
                return { ...meal, items };
            })
        );

        // Get streak
        const streak = await ctx.db
            .query("streaks")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return {
            plan,
            meals: mealsWithItems,
            streak,
        };
    },
});

// Get meal history with pagination
export const getMealHistory = query({
    args: {
        paginationOpts: v.optional(v.object({
            numItems: v.number(),
            cursor: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return { meals: [], continueCursor: null };
        }

        const meals = await ctx.db
            .query("meals")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc")
            .take(args.paginationOpts?.numItems || 50);

        // Get meal items for each meal
        const mealsWithItems = await Promise.all(
            meals.map(async (meal) => {
                const items = await ctx.db
                    .query("mealItems")
                    .withIndex("by_mealId", (q) => q.eq("mealId", meal._id))
                    .collect();
                return { ...meal, items };
            })
        );

        return {
            meals: mealsWithItems,
            continueCursor: null, // Simplified for now
        };
    },
});

// Log meal from AI analysis
export const logMealFromAI = mutation({
    args: {
        mealType: v.union(
            v.literal("breakfast"),
            v.literal("lunch"),
            v.literal("dinner"),
            v.literal("snack")
        ),
        imageUrl: v.string(),
        dishes: v.array(
            v.object({
                dishKey: v.string(),
                dishName: v.string(),
                servings: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Look up nutritional values from foodDb
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalSodium = 0;

        const dishesWithNutrition = await Promise.all(
            args.dishes.map(async (dish) => {
                const foodItem = await ctx.db
                    .query("foodDb")
                    .withIndex("by_dishKey", (q) => q.eq("dishKey", dish.dishKey))
                    .first();

                if (!foodItem) {
                    // Fallback if food not in database
                    return {
                        ...dish,
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0,
                        sodium: 0,
                    };
                }

                const calories = foodItem.calories * dish.servings;
                const protein = foodItem.protein * dish.servings;
                const carbs = foodItem.carbs * dish.servings;
                const fat = foodItem.fat * dish.servings;
                const sodium = foodItem.sodium * dish.servings;

                totalCalories += calories;
                totalProtein += protein;
                totalCarbs += carbs;
                totalFat += fat;
                totalSodium += sodium;

                return {
                    ...dish,
                    calories,
                    protein,
                    carbs,
                    fat,
                    sodium,
                };
            })
        );

        // Create meal record
        const mealId = await ctx.db.insert("meals", {
            userId,
            timestamp: Date.now(),
            type: args.mealType,
            imageUrl: args.imageUrl,
            totalCalories: Math.round(totalCalories),
            totalProtein: Math.round(totalProtein),
            totalCarbs: Math.round(totalCarbs),
            totalFat: Math.round(totalFat),
            totalSodium: Math.round(totalSodium),
        });

        // Create meal items
        await Promise.all(
            dishesWithNutrition.map((dish) =>
                ctx.db.insert("mealItems", {
                    mealId,
                    dishKey: dish.dishKey,
                    dishName: dish.dishName,
                    servings: dish.servings,
                    calories: Math.round(dish.calories),
                    protein: Math.round(dish.protein),
                    carbs: Math.round(dish.carbs),
                    fat: Math.round(dish.fat),
                    sodium: Math.round(dish.sodium),
                })
            )
        );

        // Update streak
        const today = new Date().toISOString().split("T")[0];
        const streak = await ctx.db
            .query("streaks")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (streak) {
            const lastDate = new Date(streak.lastLogDate);
            const todayDate = new Date(today);
            const daysDiff = Math.floor(
                (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            let newCurrentStreak = streak.currentStreakDays;
            if (daysDiff === 0) {
                // Already logged today, no change
            } else if (daysDiff === 1) {
                // Consecutive day
                newCurrentStreak += 1;
            } else {
                // Gap, reset streak
                newCurrentStreak = 1;
            }

            const newBestStreak = Math.max(streak.bestStreakDays, newCurrentStreak);

            await ctx.db.patch(streak._id, {
                currentStreakDays: newCurrentStreak,
                bestStreakDays: newBestStreak,
                lastLogDate: today,
            });
        }

        // Update today's plan consumed values
        const plan = await ctx.db
            .query("plans")
            .withIndex("by_userId_date", (q) => q.eq("userId", userId).eq("date", today))
            .first();

        if (plan) {
            await ctx.db.patch(plan._id, {
                consumedCalories: (plan.consumedCalories || 0) + Math.round(totalCalories),
                consumedProtein: (plan.consumedProtein || 0) + Math.round(totalProtein),
                consumedCarbs: (plan.consumedCarbs || 0) + Math.round(totalCarbs),
                consumedFat: (plan.consumedFat || 0) + Math.round(totalFat),
                consumedSodium: (plan.consumedSodium || 0) + Math.round(totalSodium),
            });
        }

        return mealId;
    },
});
