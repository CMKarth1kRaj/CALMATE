import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ProfileScreen: React.FC = () => {
    const { userProfile, signOut, theme, toggleTheme, meals } = useAppContext();
    const [historyRange, setHistoryRange] = React.useState<'1D' | '7D' | '30D' | '1Y' | 'ALL'>('7D');

    if (!userProfile) {
        return <div className="p-10 text-center text-primary-custom font-black animate-pulse uppercase tracking-widest">Loading Bio-Profile...</div>
    }

    const xp = 2450;
    const level = 12;
    const nextLevelXp = 3000;
    const progress = (xp / nextLevelXp) * 100;

    // History Analytics Logic
    const getHistoryStats = () => {
        const now = new Date();
        const getDateDiff = (date: Date) => {
            const diffTime = Math.abs(now.getTime() - date.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const filteredMeals = meals.filter(meal => {
            const mealDate = new Date(meal.timestamp);
            const daysAgo = getDateDiff(mealDate);

            switch (historyRange) {
                case '1D': return daysAgo <= 1;
                case '7D': return daysAgo <= 7;
                case '30D': return daysAgo <= 30;
                case '1Y': return daysAgo <= 365;
                case 'ALL': return true;
                default: return true;
            }
        });

        const totalCals = filteredMeals.reduce((acc, curr) => acc + curr.totalCalories, 0);
        const uniqueDays = new Set(filteredMeals.map(m => new Date(m.timestamp).toDateString())).size || 1;

        return {
            totalMeals: filteredMeals.length,
            avgCalories: Math.round(totalCals / uniqueDays),
            totalProtein: Math.round(filteredMeals.reduce((acc, curr) => acc + curr.totalProtein, 0) / uniqueDays),
            bestStreak: 12 // Placeholder for complex streak logic
        };
    };

    const stats = getHistoryStats();

    return (
        <div className="p-6 md:p-10 bg-app min-h-full max-w-5xl mx-auto font-sans animate-in fade-in duration-700">
            {/* Header / Hero Section */}
            <div className="relative mb-16">
                <div className="absolute inset-0 h-56 bg-gradient-to-br from-primary to-primary/20 rounded-[4rem] opacity-5"></div>
                <div className="relative pt-12 px-10 flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-12">
                    <div className="relative group">
                        <div className="w-44 h-44 rounded-full border-4 border-primary p-1.5 bg-app shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            <img
                                src={`https://api.dicebear.com/8.x/initials/svg?seed=${userProfile.name}`}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover bg-card-custom"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black border-[6px] border-app shadow-xl">
                            {level}
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left pb-4">
                        <div className="flex flex-col md:flex-row items-center md:items-baseline md:space-x-4 mb-2">
                            <h1 className="text-5xl font-black text-primary-custom tracking-tighter italic uppercase">{userProfile.name}</h1>
                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">Elite Agent</span>
                        </div>
                        <p className="text-secondary-custom font-bold text-lg uppercase tracking-widest opacity-60">Level {level} Bio-Optimizer • Joined Jan 2026</p>

                        {/* XP Bar */}
                        <div className="mt-8 max-w-md">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-secondary-custom mb-3 opacity-80">
                                <span>{xp} XP / {nextLevelXp} XP</span>
                                <span className="text-primary italic">PROGRESS {Math.round(progress)}%</span>
                            </div>
                            <div className="h-4 bg-card-custom rounded-full border border-border-custom overflow-hidden p-1 shadow-inner">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(204,255,0,0.5)]"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-12">
                {/* Stats Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-8 bg-card-custom rounded-[3rem] border border-border-custom shadow-sm group hover:bg-primary/5 transition-all duration-300">
                        <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] mb-2 group-hover:text-primary transition-colors">Current Weight</p>
                        <h3 className="text-4xl font-black text-primary-custom italic tracking-tighter uppercase">{userProfile.weight}<span className="text-sm not-italic ml-2 opacity-40">kg</span></h3>
                    </div>
                    <div className="p-8 bg-card-custom rounded-[3rem] border border-border-custom shadow-sm group hover:bg-primary/5 transition-all duration-300">
                        <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] mb-2 group-hover:text-primary transition-colors">Target Objective</p>
                        <h3 className="text-4xl font-black text-primary-custom italic tracking-tighter uppercase">{userProfile.targetWeight}<span className="text-sm not-italic ml-2 opacity-40">kg</span></h3>
                    </div>
                    <div className="p-8 bg-card-custom rounded-[3rem] border border-border-custom shadow-sm group hover:bg-primary/5 transition-all duration-300">
                        <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] mb-2 group-hover:text-primary transition-colors">Physical Height</p>
                        <h3 className="text-4xl font-black text-primary-custom italic tracking-tighter uppercase">{userProfile.height}<span className="text-sm not-italic ml-2 opacity-40">cm</span></h3>
                    </div>
                    <div className="p-8 bg-card-custom rounded-[3rem] border border-border-custom shadow-sm group hover:bg-primary/5 transition-all duration-300">
                        <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] mb-2 group-hover:text-primary transition-colors">Daily Fuel Cap</p>
                        <h3 className="text-4xl font-black text-primary-custom italic tracking-tighter uppercase">{userProfile.dailyCalorieTarget}<span className="text-sm not-italic ml-2 opacity-40">kcal</span></h3>
                    </div>
                </section>

                {/* Regional & Health Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-card-custom rounded-[3rem] border border-border-custom shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] mb-2">Native State</p>
                            <h3 className="text-2xl font-black text-primary-custom italic tracking-tighter uppercase">{userProfile.state}</h3>
                        </div>
                        <div className="text-4xl">🇮🇳</div>
                    </div>
                    <div className="p-8 bg-card-custom rounded-[3rem] border border-border-custom shadow-sm">
                        <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] mb-2">Health Bio-Data</p>
                        <div className="flex flex-wrap gap-2">
                            {userProfile.healthIssues.length > 0 ? (
                                userProfile.healthIssues.map(issue => (
                                    <span key={issue} className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded-full border border-red-500/20 uppercase tracking-tighter">
                                        {issue}
                                    </span>
                                ))
                            ) : (
                                <span className="text-secondary-custom font-black text-[10px] uppercase opacity-40 italic">No constraints detected</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* History Analytics */}
                <section className="bg-card-custom rounded-[3.5rem] p-10 border border-border-custom shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <h2 className="text-xl font-black text-primary-custom uppercase tracking-[0.2em] italic">Temporal Analysis</h2>
                        <div className="flex p-1 bg-app rounded-full border border-border-custom">
                            {['1D', '7D', '30D', '1Y', 'ALL'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setHistoryRange(range as any)}
                                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${historyRange === range ? 'bg-[#CCFF00] text-black shadow-lg' : 'text-secondary-custom hover:text-primary-custom'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-app/50 rounded-[2.5rem] border border-border-custom">
                            <div className="text-secondary-custom text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Interactions</div>
                            <div className="text-5xl font-black text-primary-custom tracking-tighter">{stats.totalMeals}</div>
                            <div className="text-xs text-secondary-custom font-bold mt-2 opacity-60">MEALS LOGGED</div>
                        </div>
                        <div className="p-8 bg-app/50 rounded-[2.5rem] border border-border-custom">
                            <div className="text-secondary-custom text-[10px] font-black uppercase tracking-[0.3em] mb-4">Avg. Daily Fuel</div>
                            <div className="text-5xl font-black text-primary-custom tracking-tighter">{stats.avgCalories}</div>
                            <div className="text-xs text-secondary-custom font-bold mt-2 opacity-60">KCAL / DAY</div>
                        </div>
                        <div className="p-8 bg-app/50 rounded-[2.5rem] border border-border-custom">
                            <div className="text-secondary-custom text-[10px] font-black uppercase tracking-[0.3em] mb-4">Avg. Protein</div>
                            <div className="text-5xl font-black text-primary-custom tracking-tighter">{stats.totalProtein}g</div>
                            <div className="text-xs text-secondary-custom font-bold mt-2 opacity-60">PER DAY</div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Achievements */}
                    <section className="bg-card-custom rounded-[3.5rem] p-10 border border-border-custom shadow-sm">
                        <h2 className="text-xl font-black text-primary-custom mb-10 uppercase tracking-[0.2em] italic">Bio-Achievements</h2>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`aspect-square rounded-3xl flex items-center justify-center text-3xl border-2 transition-all duration-500 ${i < 3 ? 'bg-primary/10 border-primary/30 grayscale-0 scale-105 shadow-lg' : 'bg-app border-border-custom grayscale opacity-20'}`}>
                                    {['🔥', '🥑', '⚖️', '🏆', '💎', '🎯'][i]}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Settings Column */}
                    <section className="bg-card-custom rounded-[3.5rem] p-10 border border-border-custom shadow-xl">
                        <h2 className="text-xl font-black text-primary-custom mb-10 uppercase tracking-[0.2em] italic">System Configuration</h2>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-5 bg-app border border-border-custom rounded-[2rem] hover:bg-primary/5 transition-all group cursor-pointer">
                                <span className="font-black text-[10px] uppercase tracking-widest text-primary-custom">Edit Bio-Identity</span>
                                <span className="text-secondary-custom group-hover:translate-x-1 transition-transform">→</span>
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between p-5 bg-app border border-border-custom rounded-[2rem] hover:bg-primary/5 transition-all group cursor-pointer"
                            >
                                <span className="font-black text-[10px] uppercase tracking-widest text-primary-custom">Visual Protocol</span>
                                <div className="flex items-center space-x-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{theme}</span>
                                    <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                                </div>
                            </button>

                            <button className="w-full flex items-center justify-between p-5 bg-app border border-border-custom rounded-[2rem] hover:bg-red-500/10 transition-all group text-red-500 cursor-pointer" onClick={signOut}>
                                <span className="font-black text-[10px] uppercase tracking-widest">Terminate Session</span>
                                <span className="text-xl transition-transform group-hover:translate-x-1">🚪</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-20 text-center text-secondary-custom text-[10px] font-black uppercase tracking-[0.8em] opacity-10">
                CALMATE DNA SYSTEMS v1.0.4-ELITE
            </div>

            <div className="h-24 md:hidden"></div>
        </div>
    );
};

export default ProfileScreen;