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
    const [loading, setLoading] = useState(true);
    const [mealType, setMealType] = useState<MealType>(MealType.Lunch);

    useEffect(() => {
        const performAnalysis = async () => {
            if (imageForAnalysis) {
                try {
                    setLoading(true);
                    setError(null);
                    const result = await analyzeMealFromImage(imageForAnalysis);
                    setAnalysis(result);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                } finally {
                    setLoading(false);
                }
            }
        };
        performAnalysis();
    }, [imageForAnalysis]);

    const handleAddToLog = () => {
        if (!analysis || !imageForAnalysis) return;

        const newMeal: Meal = {
            id: new Date().toISOString(),
            type: mealType,
            items: analysis.items,
            totalCalories: analysis.totalCalories,
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
                        onClick={() => setImageForAnalysis(null)}
                        className="w-full bg-[#CCFF00] text-black flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(204,255,0,0.3)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest md:w-auto px-16"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#CCFF00] to-[#CCFF00]/30 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <img
                                src={`data:image/jpeg;base64,${imageForAnalysis}`}
                                alt="Analyzed meal"
                                className="relative w-full h-[30rem] object-cover rounded-[3rem] shadow-2xl border border-custom"
                            />
                        </div>

                        <div className="bg-card-custom p-10 rounded-[3.5rem] shadow-sm border border-custom">
                            <label className="font-bold text-secondary-custom uppercase text-[10px] tracking-[0.3em] mb-8 block">Classification</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[MealType.Breakfast, MealType.Lunch, MealType.Dinner, MealType.Snack].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setMealType(type)}
                                        className={`px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 ${mealType === type ? 'bg-[#CCFF00] text-black shadow-xl scale-105' : 'bg-app text-secondary-custom hover:bg-[#CCFF00]/5 border border-custom'}`}
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
                                        <span className="text-6xl font-black text-primary-custom tracking-tighter">{analysis.totalCalories}</span>
                                        <span className="text-xl font-black italic text-[#CCFF00]/60 uppercase">Kcal</span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-12 mb-12">
                                {analysis.items.map((item, index) => (
                                    <li key={index} className="group">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-primary-custom text-xl font-black tracking-tight uppercase italic">{item.name}</span>
                                                <span className="text-[10px] font-black text-secondary-custom uppercase tracking-widest mt-0.5 opacity-60">{item.quantity}</span>
                                            </div>
                                            <span className="text-primary-custom font-black italic">🔥 {item.calories}</span>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="flex-1 h-2.5 bg-[#CCFF00]/10 rounded-full overflow-hidden flex p-0.5">
                                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(item.protein * 4 / (item.calories || 1)) * 100}%` }}></div>
                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(item.carbs * 4 / (item.calories || 1)) * 100}%` }}></div>
                                                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(item.fat * 9 / (item.calories || 1)) * 100}%` }}></div>
                                            </div>
                                            <div className="flex space-x-4 text-[10px] font-black uppercase text-secondary-custom tracking-tighter shrink-0 opacity-80">
                                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />{item.protein}G</span>
                                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-orange-500 mr-1.5" />{item.carbs}G</span>
                                                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-400 mr-1.5" />{item.fat}G</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={handleAddToLog}
                                className="w-full bg-[#CCFF00] text-black flex items-center justify-center font-black py-6 rounded-[2.5rem] text-xl transition-all duration-300 shadow-[0_15px_30px_rgba(204,255,0,0.25)] hover:shadow-[0_20px_40px_rgba(204,255,0,0.4)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
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
