# Convex Backend Setup Instructions

## Initial Setup (One-time)

Since Convex requires interactive login, you'll need to run this once:

### Step 1: Initialize Convex
```bash
bun run convex:dev
```

This will:
1. Prompt you to log in to Convex (or create an account)
2. Create a new project
3. Generate `.env.local` with your deployment URL
4. Generate TypeScript types in `convex/_generated/`

### Step 2: Seed the Food Database
After Convex is initialized, seed the food database:
```bash
bun x convex run foodDb:seedFoodDatabase
```

## Running the App

### Terminal 1: Convex Backend
```bash
bun run convex:dev
```

### Terminal 2: React Frontend
```bash
bun run dev
```

## Convex Dashboard

Access your local Convex dashboard at:
```
https://dashboard.convex.dev
```

You can:
- View all tables and data
- Manually query/insert data
- Monitor function execution
- Debug queries in real-time

##Backend Structure

### Tables
- `users` - User profiles with health data
- `plans` - Daily nutrition targets
- `meals` - Logged meals with images
- `mealItems` - Individual dishes in each meal
- `streaks` - Engagement tracking
- `foodDb` - Nutritional database (25+ Indian dishes)

### Key Functions
- **Auth**: `getCurrentUser`, `ensureUserCreated`
- **Profile**: `getUserProfile`, `updateUserProfile` (auto-calculates BMR/TDEE)
- **Meals**: `getTodayOverview`, `logMealFromAI`, `getMealHistory`
- **Plans**: `getDailyPlan`, `saveDailyPlanSummary`
- **FoodDb**: `getFoodItem`, `seedFoodDatabase`
