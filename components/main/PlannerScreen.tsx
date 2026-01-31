import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateMealPlan, MealPlanItem } from '../../services/geminiService';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const PlanSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card-custom rounded-[2.5rem] border border-custom overflow-hidden shadow-sm h-32"></div>
        ))}
    </div>
);


const PlanMealCard: React.FC<{ meal: MealPlanItem }> = ({ meal }) => (
    <div className="bg-card-custom rounded-[3rem] overflow-hidden shadow-sm border border-custom group transition-all hover:bg-[#CCFF00]/5 hover:shadow-xl hover:-translate-y-1 p-8 duration-500">
        <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-black text-secondary-custom uppercase tracking-[0.3em]">{meal.mealType}</p>
            <div className="flex items-center text-primary-custom font-black text-sm italic">
                <span className="mr-1 opacity-70">🔥</span> {meal.calories}
            </div>
        </div>
        <h3 className="font-black text-2xl text-primary-custom tracking-tighter leading-tight uppercase italic">{meal.dish}</h3>
        <div className="mt-6 flex items-center space-x-2 text-secondary-custom font-bold text-xs uppercase tracking-widest opacity-60">
            <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full"></div>
            <span>Chef's Choice Recipe</span>
        </div>
    </div>
);


const PlannerScreen: React.FC = () => {
    const { userProfile } = useAppContext();
    const dailyPlan = useQuery(api.plans.getDailyPlan, {
        date: new Date().toISOString().split('T')[0]
    });
    const savePlanSummary = useMutation(api.plans.saveDailyPlanSummary);

    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<MealPlanItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Sync local state with Convex data when it arrives
    useEffect(() => {
        if (dailyPlan && dailyPlan.aiPlanSummary) {
            try {
                const parsedPlan = JSON.parse(dailyPlan.aiPlanSummary);
                if (Array.isArray(parsedPlan)) {
                    setPlan(parsedPlan);
                } else if (parsedPlan.plan) {
                    setPlan(parsedPlan.plan);
                }
            } catch (e) {
                console.error("Failed to parse plan summary", e);
            }
        } else {
            setPlan(null);
        }
    }, [dailyPlan]);

    const handleGeneratePlan = async () => {
        if (!userProfile) return;
        setLoading(true);
        setError(null);
        try {
            // Generate plan using AI service
            const result = await generateMealPlan(userProfile);

            // Save to Convex
            await savePlanSummary({
                date: new Date().toISOString().split('T')[0],
                aiPlanSummary: JSON.stringify(result.plan),
                targetCalories: userProfile.dailyCalorieTarget,
                targetProtein: Math.round((userProfile.dailyCalorieTarget * 0.3) / 4),
                targetCarbs: Math.round((userProfile.dailyCalorieTarget * 0.4) / 4),
                targetFat: Math.round((userProfile.dailyCalorieTarget * 0.3) / 9),
            });

            // Local state will update via useQuery subscription automatically
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (!userProfile) {
        return <div className="p-10 text-center text-secondary-custom font-black uppercase tracking-widest animate-pulse">Initializing DNA Plan...</div>
    }

    const isFetching = dailyPlan === undefined;

    return (
        <div className="p-6 md:p-10 bg-app min-h-full max-w-6xl mx-auto font-sans">
            <header className="mb-20 text-center md:text-left relative">
                <div className="absolute -left-10 top-0 w-1 bg-[#CCFF00] h-full opacity-30 rounded-full hidden lg:block"></div>
                <h1 className="text-4xl md:text-7xl font-black text-primary-custom mb-6 tracking-tighter italic">DAILY PLAN</h1>
                <p className="text-secondary-custom font-bold text-lg leading-relaxed uppercase tracking-widest text-[11px] opacity-70">
                    Proprietary strategy for <span className="text-primary-custom font-black underline decoration-[#CCFF00]/40">{userProfile.dailyCalorieTarget} kcal</span> objective.
                </p>
            </header>

            {(loading || isFetching) && !plan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <PlanSkeleton />
                    <PlanSkeleton />
                </div>
            )}

            {error && (
                <div className="text-center py-20 px-8 bg-card-custom rounded-[4rem] border border-custom shadow-xl">
                    <div className="text-6xl mb-6">⚠️</div>
                    <p className="font-black text-2xl text-primary-custom mb-4 italic uppercase tracking-tighter">System Malfunction</p>
                    <p className="text-secondary-custom mb-10 font-bold max-w-sm mx-auto">{error}</p>
                    <button
                        onClick={handleGeneratePlan}
                        className="w-full bg-[#CCFF00] text-black flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(204,255,0,0.3)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest md:w-auto px-16 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !isFetching && plan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {plan.map((meal, index) => <PlanMealCard key={index} meal={meal} />)}
                </div>
            )}

            {!loading && !isFetching && !plan && !error && (
                <div className="text-center py-20 px-8 bg-card-custom rounded-[4rem] border border-border-custom shadow-xl border-dashed opacity-70">
                    <div className="text-6xl mb-6">📝</div>
                    <p className="font-black text-2xl text-primary-custom mb-4 italic uppercase tracking-tighter">No Plan Detected</p>
                    <p className="text-secondary-custom mb-10 font-bold max-w-sm mx-auto uppercase text-[10px] tracking-widest">Generate a new strategy for today's mission.</p>
                </div>
            )}

            {!loading && !isFetching && (
                <div className="mt-20 flex justify-center pb-12">
                    <button
                        onClick={handleGeneratePlan}
                        disabled={loading}
                        className="w-full bg-[#CCFF00] text-black flex items-center justify-center font-black py-6 rounded-[2.5rem] text-xl transition-all duration-300 shadow-[0_15px_30px_rgba(204,255,0,0.25)] hover:shadow-[0_20px_40px_rgba(204,255,0,0.4)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest md:max-w-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'CALCULATING STRATEGY...' : (plan ? 'REGENERATE MISSION' : 'GENERATE MISSION')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlannerScreen;
