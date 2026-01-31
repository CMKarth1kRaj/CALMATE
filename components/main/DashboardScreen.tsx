
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Meal, MealType, Screen } from '../../types';
import { StreakIcon, ProteinIcon, CarbsIcon, FatsIcon, CameraIcon, ProfileIcon } from '../icons';

const CircularProgress: React.FC<{
    progress: number;
    size: number;
    strokeWidth: number;
    icon?: React.ReactNode;
    color?: string;
    trackColor?: string;
}> = ({ progress, size, strokeWidth, icon, color = "#CCFF00", trackColor = "var(--border)" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    stroke={trackColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            {icon && <div className="absolute">{icon}</div>}
        </div>
    );
};

const MacroCard: React.FC<{ label: string; current: number; target: number; unit: string; color: string; icon: React.ReactNode }> = ({ label, current, target, unit, color, icon }) => {
    const left = Math.max(0, target - current);
    const progress = (current / (target || 1)) * 100;

    return (
        <div className="p-6 bg-card-custom rounded-[2.5rem] flex flex-col items-start shadow-lg border border-border-custom group hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
            <div className="mb-4">
                <p className="text-2xl font-black text-primary-custom truncate">{left}{unit}</p>
                <p className="text-[10px] text-secondary-custom uppercase font-black tracking-widest leading-none">{label} LEFT</p>
            </div>
            <div className="mt-2 self-center">
                <CircularProgress
                    progress={progress}
                    size={80}
                    strokeWidth={8}
                    color={color}
                    icon={icon}
                />
            </div>
        </div>
    );
};

const MealCardList: React.FC<{ meal: any }> = ({ meal }) => {
    const time = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const protein = meal.totalProtein;
    const carbs = meal.totalCarbs;
    const fats = meal.totalFat;

    return (
        <div className="flex items-center space-x-4 p-4 bg-card-custom rounded-[2rem] shadow-md border border-border-custom group transition-all hover:bg-primary/5 duration-300">
            {meal.imageUrl ? (
                <img src={meal.imageUrl} alt="meal" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
            ) : (
                <div className="w-20 h-20 bg-secondary-custom/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">🍽️</div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-sm text-primary-custom truncate pr-2 uppercase italic">{meal.type}</p>
                    <span className="text-[10px] text-secondary-custom font-bold uppercase tracking-widest">{time}</span>
                </div>
                <div className="flex items-center text-primary-custom font-black text-sm mb-2 group-hover:text-primary transition-colors">
                    <span className="mr-1">🔥</span> {meal.totalCalories} kcal
                </div>
                <div className="flex space-x-3">
                    <div className="flex items-center text-[9px] font-black uppercase text-secondary-custom">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1" /> {Math.round(protein)}g
                    </div>
                    <div className="flex items-center text-[9px] font-black uppercase text-secondary-custom">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1" /> {Math.round(carbs)}g
                    </div>
                    <div className="flex items-center text-[9px] font-black uppercase text-secondary-custom">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1" /> {Math.round(fats)}g
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardScreen: React.FC = () => {
    const { userProfile, meals, setScreen, isLoading, todayPlan, streak } = useAppContext();
    const [activeTab, setActiveTab] = useState<'Today' | 'Yesterday'>('Today');

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-10 bg-app animate-pulse">
                <div className="w-24 h-24 bg-primary/20 rounded-full mb-8"></div>
                <div className="h-8 bg-secondary-custom/20 w-48 rounded-xl mb-4"></div>
                <div className="h-4 bg-secondary-custom/10 w-32 rounded-lg"></div>
            </div>
        );
    }

    if (!userProfile) {
        return <div className="p-4 text-primary-custom font-black animate-pulse uppercase tracking-widest">Initializing Neural Link...</div>;
    }

    const targetCalories = todayPlan?.targetCalories || 2000;
    const consumedCalories = todayPlan?.consumedCalories || 0;
    const caloriesLeft = Math.max(0, targetCalories - consumedCalories);
    const calorieProgress = (consumedCalories / targetCalories) * 100;

    return (
        <div className="p-6 md:p-8 lg:p-12 bg-app min-h-full font-sans select-none max-w-[1400px] mx-auto animate-in fade-in duration-700">
            {/* Top Bar with Greeting */}
            <header className="flex justify-between items-start mb-10 px-2">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-primary-custom tracking-tighter italic uppercase text-limit-1">Welcome, {userProfile.name}</h2>
                    <p className="text-secondary-custom font-bold mt-1 uppercase text-[10px] md:text-xs tracking-[0.3em] opacity-60">Ready to crush your goals today?</p>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                    <button
                        onClick={() => setScreen(Screen.Camera)}
                        className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                        <CameraIcon className="w-6 h-6" />
                    </button>
                    <div className="px-4 py-2 bg-card-custom rounded-full flex items-center space-x-2 border border-border-custom shadow-sm">
                        <span className="text-sm font-black text-primary-custom tracking-tighter italic">🔥 {streak?.currentStreakDays || 0}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
                {/* Left Side: Stats & Goals */}
                <div className="space-y-10">
                    {/* Tabs */}
                    <div className="flex space-x-8 px-2 font-black text-sm uppercase tracking-widest border-b border-border-custom">
                        <button
                            onClick={() => setActiveTab('Today')}
                            className={`pb-4 transition-all relative ${activeTab === 'Today' ? 'text-primary-custom' : 'text-secondary-custom opacity-50'}`}
                        >
                            Today
                            {activeTab === 'Today' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('Yesterday')}
                            className={`pb-4 transition-all relative ${activeTab === 'Yesterday' ? 'text-primary-custom' : 'text-secondary-custom opacity-50'}`}
                        >
                            Yesterday
                            {activeTab === 'Yesterday' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>}
                        </button>
                    </div>

                    {/* Main Goal Card */}
                    <section className="bg-card-custom rounded-[4rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-2xl border border-border-custom relative overflow-hidden group">
                        <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-7xl md:text-8xl font-black text-primary-custom tracking-tighter italic">{caloriesLeft}</h2>
                            <p className="text-secondary-custom font-black mt-2 text-xl uppercase tracking-tighter opacity-60">Calories left</p>
                        </div>
                        <div className="relative z-10">
                            <CircularProgress
                                progress={calorieProgress}
                                size={200}
                                strokeWidth={20}
                                icon={<span className="text-5xl">🔥</span>}
                                color="#CCFF00"
                                trackColor="var(--border)"
                            />
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary opacity-[0.05] rounded-full blur-[80px] group-hover:opacity-[0.08] transition-opacity duration-1000"></div>
                    </section>

                    {/* Macro Cards Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <MacroCard
                            label="Protein"
                            current={todayPlan?.consumedProtein || 0}
                            target={todayPlan?.targetProtein || 150}
                            unit="g"
                            color="#FF3B30"
                            icon={<ProteinIcon className="w-4 h-4 text-primary-custom" />}
                        />
                        <MacroCard
                            label="Carbs"
                            current={todayPlan?.consumedCarbs || 0}
                            target={todayPlan?.targetCarbs || 200}
                            unit="g"
                            color="#FF9500"
                            icon={<CarbsIcon className="w-4 h-4 text-primary-custom" />}
                        />
                        <MacroCard
                            label="Fats"
                            current={todayPlan?.consumedFat || 0}
                            target={todayPlan?.targetFat || 66}
                            unit="g"
                            color="#007AFF"
                            icon={<FatsIcon className="w-4 h-4 text-primary-custom" />}
                        />
                    </section>
                </div>

                {/* Right Side: Recently Uploaded */}
                <aside className="xl:sticky xl:top-8 h-fit">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h3 className="text-xl font-black text-primary-custom uppercase tracking-tighter italic">Recent uploads</h3>
                        <button
                            onClick={() => setScreen(Screen.MealLog)}
                            className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline cursor-pointer"
                        >
                            View all
                        </button>
                    </div>
                    <div className="space-y-6">
                        {meals.length > 0 ? (
                            meals.map((meal: any) => <MealCardList key={meal._id} meal={meal} />)
                        ) : (
                            <div className="text-center py-24 bg-card-custom rounded-[3rem] border-2 border-dashed border-border-custom opacity-60">
                                <div className="text-5xl mb-4">📸</div>
                                <p className="text-primary-custom font-black uppercase tracking-tighter italic">No data clusters</p>
                                <p className="text-[10px] text-secondary-custom font-black uppercase tracking-widest mt-2">Initialization required</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
            <div className="h-24 md:hidden"></div>
        </div>
    );
};

export default DashboardScreen;
