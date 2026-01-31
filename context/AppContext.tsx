import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { useAuthToken, useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Screen, OnboardingStep, UserProfile, Meal, Gender, Goal, ActivityLevel, MealType } from '../types';

interface AppContextType {
    screen: Screen;
    setScreen: (screen: Screen) => void;
    showOnboarding: boolean;
    setShowOnboarding: (show: boolean) => void;
    onboardingStep: OnboardingStep;
    completeOnboardingStep: (nextStep: OnboardingStep | 'done') => void;
    userProfile: UserProfile | null;
    setUserProfile: (profile: UserProfile) => Promise<void>;
    meals: any[];
    addMeal: (meal: any) => Promise<void>;
    imageForAnalysis: string | null;
    setImageForAnalysis: (imageData: string | null) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    signOut: () => void;
    isLoading: boolean;
    todayPlan: any;
    streak: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const authToken = useAuthToken();
    const { signOut: authSignOut } = useAuthActions();
    const isAuthenticated = authToken !== null;

    const [screen, setScreen] = useState<Screen>(Screen.Dashboard);
    const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
    const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');
    const [imageForAnalysis, setImageForAnalysis] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    // Convex Queries
    const convexUser = useQuery(api.users.getUserProfile);
    const todayOverview = useQuery(api.meals.getTodayOverview);

    // Convex Mutations
    const updateProfileMutation = useMutation(api.users.updateUserProfile);
    const logMealMutation = useMutation(api.meals.logMealFromAI);
    const ensureUserCreated = useMutation(api.users.ensureUserCreated);

    const isLoading = convexUser === undefined && isAuthenticated;

    useEffect(() => {
        const syncUser = async () => {
            if (isAuthenticated && convexUser === null) {
                // Authenticated but no profile entry in 'users' table
                console.log('[AppContext] Authenticated but no profile found. Creating initial user...');
                try {
                    // The backend has access to the auth context so it knows the userId
                    // Email is optional here as the backend can often derive it, but we provide it for safety
                    await ensureUserCreated({
                        email: "syncing...",
                        name: "New User"
                    });
                } catch (e) {
                    console.error('[AppContext] Failed to ensure user created:', e);
                }
            }
        };

        syncUser();

        if (isAuthenticated) {
            if (convexUser) {
                const isProfileComplete = convexUser.name && convexUser.name !== "New User" && convexUser.name !== "User" && convexUser.age > 0;

                if (isProfileComplete) {
                    if (showOnboarding) {
                        setShowOnboarding(false);
                    }
                } else {
                    if (onboardingStep !== 'profileSetup') {
                        setShowOnboarding(true);
                        setOnboardingStep('profileSetup');
                    }
                }
            }
        } else {
            setShowOnboarding(true);
        }
    }, [isAuthenticated, convexUser, onboardingStep, showOnboarding, ensureUserCreated]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);
            return newTheme;
        });
    }, []);

    const completeOnboardingStep = useCallback((nextStep: OnboardingStep | 'done') => {
        if (nextStep === 'done') {
            setShowOnboarding(false);
        } else {
            setOnboardingStep(nextStep);
        }
    }, []);

    const setUserProfile = async (profile: UserProfile) => {
        await updateProfileMutation({
            name: profile.name,
            age: profile.age,
            gender: profile.gender as any,
            heightCm: profile.height,
            weightKg: profile.weight,
            goal: profile.goal as any,
            activityLevel: profile.activityLevel as any,
            conditions: [], // Default empty for now
        });
    };

    const addMeal = async (mealData: any) => {
        await logMealMutation({
            mealType: mealData.type,
            imageUrl: mealData.photo || "",
            dishes: mealData.items.map((item: any) => ({
                dishKey: item.name.toLowerCase().replace(/ /g, "_"), // Simple mapping
                dishName: item.name,
                servings: 1, // Default
            })),
        });
    };

    const signOut = () => {
        authSignOut();
        setShowOnboarding(true);
        setOnboardingStep('welcome');
        setScreen(Screen.Dashboard);
    };

    // Map Convex user to UserProfile type
    const userProfile: UserProfile | null = convexUser ? {
        name: convexUser.name,
        age: convexUser.age,
        gender: convexUser.gender as Gender,
        weight: convexUser.weightKg,
        height: convexUser.heightCm,
        goal: convexUser.goal as Goal,
        targetWeight: convexUser.weightKg, // Placeholder
        activityLevel: convexUser.activityLevel as ActivityLevel,
        dailyCalorieTarget: todayOverview?.plan?.targetCalories || 2000,
    } : null;

    return (
        <AppContext.Provider value={{
            screen,
            setScreen,
            showOnboarding,
            setShowOnboarding,
            onboardingStep,
            completeOnboardingStep,
            userProfile,
            setUserProfile,
            meals: todayOverview?.meals || [],
            addMeal,
            imageForAnalysis,
            setImageForAnalysis,
            theme,
            toggleTheme,
            signOut,
            isLoading,
            todayPlan: todayOverview?.plan,
            streak: todayOverview?.streak
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};