
export enum Screen {
    Dashboard = 'DASHBOARD',
    MealLog = 'MEAL_LOG',
    Camera = 'CAMERA',
    Planner = 'PLANNER',
    Profile = 'PROFILE',
}

export type OnboardingStep = 'splash' | 'welcome' | 'profileSetup' | 'features' | 'auth';

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

export enum Goal {
    WeightLoss = 'lose',
    WeightGain = 'gain',
    Maintain = 'maintain',
    BuildMuscle = 'muscle',
}

export enum ActivityLevel {
    Sedentary = 'sedentary',
    LightlyActive = 'lightly_active',
    ModeratelyActive = 'moderately_active',
    VeryActive = 'very_active',
    ExtremelyActive = 'extremely_active',
}

export interface UserProfile {
    name: string;
    age: number;
    gender: Gender;
    weight: number; // in kg
    height: number; // in cm
    goal: Goal;
    targetWeight: number;
    activityLevel: ActivityLevel;
    dailyCalorieTarget: number;
}

export interface FoodItem {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export enum MealType {
    Breakfast = 'breakfast',
    Lunch = 'lunch',
    Dinner = 'dinner',
    Snack = 'snack',
}

export interface Meal {
    id: string;
    type: MealType;
    items: FoodItem[];
    totalCalories: number;
    photo?: string; // base64 string
    timestamp: Date;
}
