import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { analyzeMealFromImage } from '../../services/geminiService';
import { FoodItem, Meal, MealType } from '../../types';

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse space-y-10">
        <div className="h-80 lg:h-[30rem] bg-card-custom rounded-[3rem] border border-custom shadow-inner"></div>
        <div className="p-10 bg-card-custom rounded-[3rem] border border-custom">
            <div className="h-10 bg-secondary-custom/20 rounded-xl w-1/2 mb-8"></div>
            <div className="space-y-6">
                <div className="h-6 bg-secondary-custom/10 rounded-lg w-full"></div>
                <div className="h-6 bg-secondary-custom/10 rounded-lg w-5/6"></div>
                <div className="h-6 bg-secondary-custom/10 rounded-lg w-4/6"></div>
            </div>
        </div>
    </div>
);

const AnalysisScreen: React.FC = () => {
    const { imageForAnalysis, setImageForAnalysis, addMeal } = useAppContext();
    const [analysis, setAnalysis] = useState<{ items: FoodItem[], totalCalories: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [hungerLevel, setHungerLevel] = useState<string | null>(null);
    const [mealType, setMealType] = useState<MealType>(MealType.Lunch);
    const [multipliers, setMultipliers] = useState<Record<number, number>>({});

    const performAnalysis = async (level: string) => {
        if (imageForAnalysis) {
            try {
                setLoading(true);
                setError(null);
                setHungerLevel(level);
                const result = await analyzeMealFromImage(imageForAnalysis, level);
                setAnalysis(result);
                // Initialize multipliers to 1.0 for all items
                const initialMultipliers = result.items.reduce((acc, _, index) => ({ ...acc, [index]: 1.0 }), {});
                setMultipliers(initialMultipliers);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleMultiplierChange = (index: number, change: number) => {
        setMultipliers(prev => ({
            ...prev,
            [index]: Math.max(0.25, (prev[index] || 1) + change)
        }));
    };

    // Calculate total calories based on current multipliers
    const adjustedTotalCalories = analysis ? analysis.items.reduce((total, item, index) => {
        const itemCalories = Number(item.calories || 0);
        return total + (itemCalories * (multipliers[index] || 1));
    }, 0) : 0;

    const handleAddToLog = () => {
        if (!analysis || !imageForAnalysis) return;

        // Apply multipliers to items before saving
        const textQuantities = ["0x", "0.25x", "0.5x", "0.75x", "1x", "1.25x", "1.5x", "1.75x", "2x", "2.25x", "2.5x", "2.75x", "3x"];

        const adjustedItems = analysis.items.map((item, index) => {
            const m = multipliers[index] || 1;
            const calories = Number(item.calories || 0);
            const protein = Number(item.protein || 0);
            const carbs = Number(item.carbs || 0);
            const fat = Number(item.fat || 0);
            return {
                ...item,
                quantity: `${m}x (${item.quantity})`,
                calories: Math.round(calories * m),
                protein: Math.round(protein * m),
                carbs: Math.round(carbs * m),
                fat: Math.round(fat * m),
            };
        });

        const newMeal: Meal = {
            id: new Date().toISOString(),
            type: mealType,
            items: adjustedItems,
            totalCalories: Math.round(adjustedTotalCalories),
            photo: `data:image/jpeg;base64,${imageForAnalysis}`,
            timestamp: new Date(),
        };
        addMeal(newMeal);
        setImageForAnalysis(null);
    };

    return (
        <div className="p-6 md:p-10 bg-app min-h-full max-w-7xl mx-auto font-sans">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-primary-custom tracking-tighter italic">ANALYSIS</h1>
                    <p className="text-secondary-custom font-bold uppercase tracking-widest text-[11px] mt-2 opacity-70">AI Bio-Signature Identification</p>
                </div>
                <button
                    onClick={() => setImageForAnalysis(null)}
                    className="px-8 py-3 bg-card-custom text-primary-custom rounded-full font-black uppercase text-xs tracking-widest border border-custom hover:bg-[#CCFF00]/10 transition-all shadow-sm"
                >
                    Retake Photo
                </button>
            </header>

            {loading && <SkeletonLoader />}

            {error && (
                <div className="text-center py-20 px-8 bg-card-custom rounded-[4rem] border border-custom shadow-xl">
                    <div className="text-7xl mb-6">⚠️</div>
                    <p className="font-black text-2xl text-primary-custom mb-4 italic uppercase tracking-tighter">Analysis Interrupted</p>
                    <p className="text-secondary-custom mb-10 font-bold max-w-md mx-auto">{error}</p>
                    <button
                        onClick={() => {
                            setHungerLevel(null);
                            setError(null);
                        }}
                        className="w-full bg-[#CCFF00] text-black flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(204,255,0,0.3)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest md:w-auto px-16 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !hungerLevel && !analysis && !error && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-full max-w-2xl mb-12">
                        <img
                            src={`data:image/jpeg;base64,${imageForAnalysis}`}
                            alt="Your meal"
                            className="w-full h-[25rem] object-cover rounded-[3rem] shadow-2xl border-4 border-card-custom"
                        />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-primary-custom mb-2 uppercase italic tracking-tighter text-center">How hungry were you?</h2>
                    <p className="text-secondary-custom font-bold mb-10 uppercase tracking-widest text-xs opacity-60">Help AI calibrate portion sizes</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                        {[
                            { id: 'Less Hungry', icon: '🥗', color: 'blue' },
                            { id: 'Normal', icon: '🍽️', color: 'orange' },
                            { id: 'Super Hungry', icon: '🦍', color: 'red' }
                        ].map((level) => (
                            <button
                                key={level.id}
                                onClick={() => performAnalysis(level.id)}
                                className="bg-card-custom p-8 rounded-[2.5rem] border border-border-custom hover:border-[#CCFF00] hover:bg-[#CCFF00]/5 hover:-translate-y-2 transition-all duration-300 shadow-lg group text-center cursor-pointer"
                            >
                                <span className="text-5xl mb-4 block group-hover:scale-125 transition-transform duration-300">{level.icon}</span>
                                <span className="text-xl font-black text-primary-custom uppercase italic tracking-tighter">{level.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!loading && analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in fade-in zoom-in-95 duration-500">
                    <div className="space-y-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#CCFF00] to-[#CCFF00]/30 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <img
                                src={`data:image/jpeg;base64,${imageForAnalysis}`}
                                alt="Analyzed meal"
                                className="relative w-full h-[30rem] object-cover rounded-[3rem] shadow-2xl border border-custom"
                            />
                            <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-black text-primary uppercase tracking-widest">
                                DNA: {hungerLevel}
                            </div>
                        </div>

                        <div className="bg-card-custom p-10 rounded-[3.5rem] shadow-sm border border-custom">
                            <label className="font-bold text-secondary-custom uppercase text-[10px] tracking-[0.3em] mb-8 block">Classification</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[MealType.Breakfast, MealType.Lunch, MealType.Dinner, MealType.Snack].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setMealType(type)}
                                        className={`px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 cursor-pointer ${mealType === type ? 'bg-[#CCFF00] text-black shadow-xl scale-105' : 'bg-app text-secondary-custom hover:bg-[#CCFF00]/5 border border-custom'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="p-10 bg-card-custom rounded-[4rem] shadow-xl border border-custom flex-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 rounded-bl-full"></div>

                            <div className="flex justify-between items-end mb-12 pb-8 border-b border-custom">
                                <div>
                                    <h2 className="text-3xl font-black text-primary-custom tracking-tighter italic uppercase">Results</h2>
                                    <p className="text-secondary-custom font-bold text-[10px] tracking-widest mt-1">NUTRITIONAL COMPOSITION</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-6xl font-black text-primary-custom tracking-tighter">{Math.round(adjustedTotalCalories)}</span>
                                        <span className="text-xl font-black italic text-[#CCFF00]/60 uppercase">Kcal</span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-12 mb-12">
                                {analysis.items.map((item, index) => {
                                    const multiplier = multipliers[index] || 1;
                                    const calories = Number(item.calories || 0);
                                    const protein = Number(item.protein || 0);
                                    const carbs = Number(item.carbs || 0);
                                    const fat = Number(item.fat || 0);

                                    return (
                                        <li key={index} className="group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-primary-custom text-xl font-black tracking-tight uppercase italic">{item.name}</span>
                                                    <span className="text-[10px] font-black text-secondary-custom uppercase tracking-widest mt-0.5 opacity-60">{item.quantity}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-primary-custom font-black italic text-lg">🔥 {Math.round(calories * multiplier)}</span>

                                                </div>
                                            </div>

                                            {/* Quantity Control */}
                                            <div className="flex items-center space-x-4 mb-4 bg-app/50 p-2 px-4 rounded-2xl w-fit">
                                                <span className="text-[10px] uppercase font-black text-secondary-custom tracking-widest">Quantity:</span>
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() => handleMultiplierChange(index, -0.25)}
                                                        className="w-8 h-8 rounded-full bg-card-custom border border-custom flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-colors font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-black text-primary-custom w-12 text-center text-sm">{multiplier}x</span>
                                                    <button
                                                        onClick={() => handleMultiplierChange(index, 0.25)}
                                                        className="w-8 h-8 rounded-full bg-card-custom border border-custom flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-colors font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className="flex-1 h-2.5 bg-[#CCFF00]/10 rounded-full overflow-hidden flex p-0.5">
                                                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(protein * 4 / (calories || 1)) * 100}%` }}></div>
                                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(carbs * 4 / (calories || 1)) * 100}%` }}></div>
                                                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(fat * 9 / (calories || 1)) * 100}%` }}></div>
                                                </div>
                                                <div className="flex space-x-4 text-[10px] font-black uppercase text-secondary-custom tracking-tighter shrink-0 opacity-80">
                                                    <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />{Math.round(protein * multiplier)}G</span>
                                                    <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-orange-500 mr-1.5" />{Math.round(carbs * multiplier)}G</span>
                                                    <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-400 mr-1.5" />{Math.round(fat * multiplier)}G</span>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <button
                                onClick={handleAddToLog}
                                className="w-full bg-[#CCFF00] text-black flex items-center justify-center font-black py-6 rounded-[2.5rem] text-xl transition-all duration-300 shadow-[0_15px_30px_rgba(204,255,0,0.25)] hover:shadow-[0_20px_40px_rgba(204,255,0,0.4)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer"
                            >
                                Confirm & Deploy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisScreen;
