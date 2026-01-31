import { useAppContext } from '../../context/AppContext';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const MealCard: React.FC<{ meal: any }> = ({ meal }) => {
    const time = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const protein = meal.totalProtein;
    const carbs = meal.totalCarbs;
    const fats = meal.totalFat;

    return (
        <div className="flex items-center space-x-6 p-6 bg-card-custom rounded-[2.5rem] shadow-sm border border-border-custom group transition-all hover:bg-primary/5 hover:scale-[1.01] duration-300">
            <div className="relative shrink-0">
                <img src={meal.imageUrl} alt={meal.items[0]?.dishName || 'Meal'} className="w-24 h-24 rounded-[2rem] object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-black px-2 py-1 rounded-full shadow-lg text-black">
                    {meal.type}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-black text-xl text-primary-custom tracking-tight truncate pr-4 uppercase italic">
                        {meal.items[0]?.dishName || 'Meal'}{meal.items.length > 1 ? ` + ${meal.items.length - 1}` : ''}
                    </p>
                    <span className="text-[10px] text-secondary-custom font-black uppercase tracking-widest bg-app px-2 py-1 rounded-md border border-border-custom">{time}</span>
                </div>

                <div className="flex items-center text-primary-custom font-black text-xl mb-4 group-hover:text-primary transition-colors">
                    <span className="mr-2 text-lg">🔥</span> {meal.totalCalories} <span className="text-xs ml-1 opacity-50 uppercase not-italic">kcal</span>
                </div>

                <div className="flex space-x-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-secondary-custom uppercase tracking-tighter opacity-50">Protein</span>
                        <div className="flex items-center font-bold text-primary-custom"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" /> {Math.round(protein)}g</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-secondary-custom uppercase tracking-tighter opacity-50">Carbs</span>
                        <div className="flex items-center font-bold text-primary-custom"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" /> {Math.round(carbs)}g</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-secondary-custom uppercase tracking-tighter opacity-50">Fat</span>
                        <div className="flex items-center font-bold text-primary-custom"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5" /> {Math.round(fats)}g</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MealLogScreen: React.FC = () => {
    const historyData = useQuery(api.meals.getMealHistory, {});
    const meals = historyData?.meals || [];

    // Group meals by date
    const groupedMeals = meals.reduce((groups, meal) => {
        const date = new Date(meal.timestamp).toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(meal);
        return groups;
    }, {} as Record<string, any[]>);

    const dates = Object.keys(groupedMeals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="p-6 md:p-10 lg:p-14 bg-app min-h-full max-w-5xl mx-auto font-sans">
            <header className="mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-primary-custom tracking-tighter uppercase italic">HISTORY</h1>
                <p className="text-secondary-custom font-bold mt-2 uppercase text-xs tracking-[0.3em] opacity-60">Complete Nutritional Log</p>
            </header>

            {dates.length > 0 ? (
                <div className="space-y-16">
                    {dates.map(date => (
                        <div key={date} className="relative pt-4">
                            <div className="flex items-center space-x-4 mb-8">
                                <h3 className="text-sm font-black text-primary uppercase tracking-[0.4em] px-4 py-2 bg-primary/5 rounded-xl border border-primary/20">{date === new Date().toDateString() ? 'TODAY' : date}</h3>
                                <div className="flex-1 h-px bg-border-custom opacity-30"></div>
                            </div>
                            <div className="space-y-6">
                                {groupedMeals[date].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(meal => (
                                    <MealCard key={meal._id} meal={meal} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-card-custom rounded-[4rem] border border-border-custom border-dashed">
                    <div className="text-8xl mb-8 opacity-20">🍽️</div>
                    <p className="text-2xl font-black text-primary-custom uppercase tracking-tighter italic">No Records Found</p>
                    <p className="text-secondary-custom font-bold mt-2 text-sm opacity-50 uppercase tracking-widest">Initialization of data required</p>
                </div>
            )}

            <div className="h-20"></div>
        </div>
    );
};

export default MealLogScreen;
