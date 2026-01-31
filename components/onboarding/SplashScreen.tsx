
import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const SplashScreen: React.FC = () => {
    const { completeOnboardingStep } = useAppContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            completeOnboardingStep('welcome');
        }, 2500);
        return () => clearTimeout(timer);
    }, [completeOnboardingStep]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-primary text-primary-foreground">
            <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-primary-foreground text-primary rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce">
                    <span className="text-5xl">🍏</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic animate-pulse">CALMATE</h1>
            </div>
            <div className="absolute bottom-12 flex flex-col items-center space-y-2">
                <div className="w-12 h-1 bg-primary-foreground/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-foreground animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Processing Bio-Data</p>
            </div>
        </div>
    );
};

export default SplashScreen;
