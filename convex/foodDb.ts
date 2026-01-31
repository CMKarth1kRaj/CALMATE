import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get food item nutritional info
export const getFoodItem = query({
    args: {
        dishKey: v.string(),
    },
    handler: async (ctx, args) => {
        const foodItem = await ctx.db
            .query("foodDb")
            .withIndex("by_dishKey", (q) => q.eq("dishKey", args.dishKey))
            .first();

        return foodItem;
    },
});

// Seed food database with common Indian dishes
export const seedFoodDatabase = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if already seeded
        const existing = await ctx.db.query("foodDb").first();
        if (existing) {
            return "Database already seeded";
        }

        const indianFoodData = [
            // Breads
            {
                dishKey: "roti",
                displayName: "Roti/Chapati",
                perUnit: "1 medium roti (30g)",
                calories: 71,
                protein: 2.7,
                carbs: 15.0,
                fat: 0.4,
                sodium: 120,
            },
            {
                dishKey: "naan",
                displayName: "Naan",
                perUnit: "1 piece (90g)",
                calories: 262,
                protein: 8.7,
                carbs: 45.6,
                fat: 5.1,
                sodium: 419,
            },
            {
                dishKey: "paratha",
                displayName: "Paratha",
                perUnit: "1 piece (60g)",
                calories: 210,
                protein: 4.5,
                carbs: 24.0,
                fat: 10.5,
                sodium: 268,
            },

            // Rice
            {
                dishKey: "white_rice",
                displayName: "White Rice",
                perUnit: "1 cup cooked (158g)",
                calories: 205,
                protein: 4.3,
                carbs: 44.5,
                fat: 0.4,
                sodium: 2,
            },
            {
                dishKey: "brown_rice",
                displayName: "Brown Rice",
                perUnit: "1 cup cooked (195g)",
                calories: 216,
                protein: 5.0,
                carbs: 44.8,
                fat: 1.8,
                sodium: 10,
            },
            {
                dishKey: "biryani",
                displayName: "Chicken Biryani",
                perUnit: "1 serving (300g)",
                calories: 420,
                protein: 22.0,
                carbs: 52.0,
                fat: 14.0,
                sodium: 890,
            },

            // Lentils & Dals
            {
                dishKey: "dal_tadka",
                displayName: "Dal Tadka",
                perUnit: "1 cup (200g)",
                calories: 180,
                protein: 9.5,
                carbs: 28.0,
                fat: 4.2,
                sodium: 615,
            },
            {
                dishKey: "rajma",
                displayName: "Rajma (Kidney Beans)",
                perUnit: "1 cup (200g)",
                calories: 215,
                protein: 13.4,
                carbs: 37.0,
                fat: 1.6,
                sodium: 525,
            },
            {
                dishKey: "chana_masala",
                displayName: "Chana Masala",
                perUnit: "1 cup (200g)",
                calories: 240,
                protein: 11.0,
                carbs: 35.0,
                fat: 7.0,
                sodium: 680,
            },

            // Curries
            {
                dishKey: "chicken_curry",
                displayName: "Chicken Curry",
                perUnit: "1 serving (200g)",
                calories: 285,
                protein: 28.0,
                carbs: 8.5,
                fat: 16.0,
                sodium: 720,
            },
            {
                dishKey: "paneer_butter_masala",
                displayName: "Paneer Butter Masala",
                perUnit: "1 serving (200g)",
                calories: 390,
                protein: 16.0,
                carbs: 12.0,
                fat: 32.0,
                sodium: 840,
            },
            {
                dishKey: "aloo_gobi",
                displayName: "Aloo Gobi",
                perUnit: "1 serving (150g)",
                calories: 145,
                protein: 3.2,
                carbs: 22.0,
                fat: 5.8,
                sodium: 420,
            },
            {
                dishKey: "palak_paneer",
                displayName: "Palak Paneer",
                perUnit: "1 serving (200g)",
                calories: 320,
                protein: 14.5,
                carbs: 15.0,
                fat: 24.0,
                sodium: 680,
            },

            // South Indian
            {
                dishKey: "idli",
                displayName: "Idli",
                perUnit: "1 piece (50g)",
                calories: 58,
                protein: 2.0,
                carbs: 12.0,
                fat: 0.3,
                sodium: 65,
            },
            {
                dishKey: "dosa",
                displayName: "Dosa",
                perUnit: "1 plain dosa (120g)",
                calories: 168,
                protein: 4.8,
                carbs: 29.0,
                fat: 3.7,
                sodium: 182,
            },
            {
                dishKey: "sambhar",
                displayName: "Sambhar",
                perUnit: "1 bowl (200ml)",
                calories: 105,
                protein: 5.2,
                carbs: 18.0,
                fat: 1.8,
                sodium: 550,
            },
            {
                dishKey: "upma",
                displayName: "Upma",
                perUnit: "1 serving (150g)",
                calories: 192,
                protein: 4.5,
                carbs: 32.0,
                fat: 5.2,
                sodium: 485,
            },

            // Snacks
            {
                dishKey: "samosa",
                displayName: "Samosa",
                perUnit: "1 piece (100g)",
                calories: 262,
                protein: 5.0,
                carbs: 38.0,
                fat: 10.0,
                sodium: 422,
            },
            {
                dishKey: "pakora",
                displayName: "Pakora",
                perUnit: "1 serving (100g)",
                calories: 285,
                protein: 6.5,
                carbs: 28.0,
                fat: 16.0,
                sodium: 380,
            },

            // Proteins
            {
                dishKey: "boiled_egg",
                displayName: "Boiled Egg",
                perUnit: "1 large egg (50g)",
                calories: 78,
                protein: 6.3,
                carbs: 0.6,
                fat: 5.3,
                sodium: 62,
            },
            {
                dishKey: "grilled_chicken",
                displayName: "Grilled Chicken Breast",
                perUnit: "100g",
                calories: 165,
                protein: 31.0,
                carbs: 0,
                fat: 3.6,
                sodium: 74,
            },
            {
                dishKey: "paneer",
                displayName: "Paneer (Raw)",
                perUnit: "100g",
                calories: 265,
                protein: 18.3,
                carbs: 1.2,
                fat: 20.8,
                sodium: 18,
            },

            // Vegetables
            {
                dishKey: "mixed_veg_sabzi",
                displayName: "Mixed Vegetable Sabzi",
                perUnit: "1 serving (150g)",
                calories: 95,
                protein: 2.8,
                carbs: 14.0,
                fat: 3.5,
                sodium: 320,
            },
            {
                dishKey: "bhindi_masala",
                displayName: "Bhindi Masala",
                perUnit: "1 serving (150g)",
                calories: 112,
                protein: 2.4,
                carbs: 12.0,
                fat: 6.5,
                sodium: 365,
            },
        ];

        // Insert all food items
        await Promise.all(
            indianFoodData.map((food) => ctx.db.insert("foodDb", food))
        );

        return `Seeded ${indianFoodData.length} food items`;
    },
});
