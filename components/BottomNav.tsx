import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import { HomeIcon, LogIcon, CameraIcon, PlannerIcon, ProfileIcon } from './icons';

const NavItem: React.FC<{
    screen: Screen;
    label: string;
    Icon: React.FC<{ className?: string }>;
}> = ({ screen, label, Icon }) => {
    const { screen: currentScreen, setScreen } = useAppContext();
    const isActive = currentScreen === screen;
    const color = isActive ? 'text-primary' : 'text-secondary-custom hover:text-primary-custom';
    const iconColor = isActive ? 'text-primary' : 'text-secondary-custom group-hover:text-primary-custom';

    return (
        <button
            onClick={() => setScreen(screen)}
            aria-label={label}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full md:px-6 md:py-4 transition-all duration-300 group space-y-1 md:space-y-0 md:space-x-4 h-full md:h-auto rounded-2xl ${isActive ? 'md:bg-primary/5' : 'hover:md:bg-primary/5'}`}
        >
            <div className={`relative flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon className={`relative h-6 w-6 transition-colors duration-300 ${iconColor}`} />
                {isActive && (
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full animate-ping shadow-[0_0_10px_rgba(204,255,0,0.8)]"></div>
                )}
            </div>
            <span className={`text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 ${color}`}>{label}</span>
        </button>
    );
};


const BottomNav: React.FC = () => {
    const { setScreen, screen } = useAppContext();
    const isCameraActive = screen === Screen.Camera;

    return (
        <>
            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
                <div className="relative h-20 bg-card-custom/80 backdrop-blur-2xl border border-custom flex items-center justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-[2.5rem] px-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
                    <NavItem screen={Screen.Dashboard} label="Home" Icon={HomeIcon} />
                    <NavItem screen={Screen.MealLog} label="Log" Icon={LogIcon} />

                    <button
                        onClick={() => setScreen(Screen.Camera)}
                        aria-label="Open Camera"
                        className={`w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-500 transform hover:scale-110 active:scale-90 ${isCameraActive ? 'ring-4 ring-primary/40' : ''}`}
                    >
                        <CameraIcon className="w-7 h-7" />
                    </button>

                    <NavItem screen={Screen.Planner} label="Plan" Icon={PlannerIcon} />
                    <NavItem screen={Screen.Profile} label="Me" Icon={ProfileIcon} />
                </div>
            </div>

            {/* Desktop/Tablet Sidebar */}
            <div className="hidden md:flex flex-col w-64 lg:w-72 h-screen bg-app border-r border-custom py-12 px-6 shadow-2xl z-50 transition-colors duration-500">
                <div className="mb-16 px-4 flex items-center space-x-4 group cursor-pointer" onClick={() => setScreen(Screen.Dashboard)}>
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        <span className="text-3xl group-hover:scale-110 transition-transform">🍏</span>
                    </div>
                    <h1 className="text-2xl font-black text-primary-custom tracking-tighter italic">CALMATE</h1>
                </div>

                <div className="flex-1 space-y-4">
                    <NavItem screen={Screen.Dashboard} label="DASHBOARD" Icon={HomeIcon} />
                    <NavItem screen={Screen.MealLog} label="HISTORY" Icon={LogIcon} />
                    <NavItem screen={Screen.Planner} label="DAILY PLAN" Icon={PlannerIcon} />
                    <NavItem screen={Screen.Profile} label="MY PROFILE" Icon={ProfileIcon} />
                </div>

                <div className="mt-auto pt-8 border-t border-custom">
                    <button
                        onClick={() => setScreen(Screen.Camera)}
                        className="w-full bg-primary text-primary-foreground rounded-[1.8rem] p-6 flex items-center justify-center space-x-3 shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(204,255,0,0.3)] font-black uppercase text-xs tracking-[0.25em]"
                    >
                        <CameraIcon className="w-6 h-6" />
                        <span>Log Meal</span>
                    </button>

                    <p className="mt-8 text-center text-[9px] font-black text-secondary-custom uppercase tracking-widest opacity-30">
                        V1.0.0-PRO
                    </p>
                </div>
            </div>
        </>
    );
};

export default BottomNav;
