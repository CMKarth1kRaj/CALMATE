import React from 'react';
import { useAppContext } from '../../context/AppContext';

const WelcomeScreen: React.FC = () => {
    const { completeOnboardingStep } = useAppContext();

    return (
        <div className="flex flex-col h-screen w-full p-10 bg-app items-center justify-between">
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in-95 duration-1000">
                <div className="w-32 h-32 bg-primary text-primary-foreground rounded-[3rem] flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(204,255,0,0.3)] rotate-6 group hover:rotate-12 transition-transform duration-500">
                    <span className="text-7xl group-hover:scale-110 transition-transform">🍏</span>
                </div>
                <h1 className="text-7xl md:text-8xl font-black text-primary-custom tracking-tighter leading-none mb-6 italic">
                    CALMATE
                </h1>
                <div className="h-2 w-24 bg-primary mb-8 rounded-full"></div>
                <p className="text-2xl text-secondary-custom font-black max-w-[320px] leading-tight uppercase italic opacity-80">
                    Elite AI Nutrition. <br />
                    <span className="text-primary-custom not-italic">Engineered for Results.</span>
                </p>
            </div>

            <div className="pb-16 w-full max-w-sm space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
                <button
                    onClick={() => completeOnboardingStep('features')}
                    className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-6 rounded-[2.5rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer"
                >
                    GET STARTED
                </button>
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-secondary-custom opacity-40">
                        HAVE AN ACCOUNT? <button onClick={() => completeOnboardingStep('auth')} className="text-primary-custom hover:underline ml-1 cursor-pointer">LOG IN</button>
                    </p>
                </div>
            </div>

            <div className="absolute bottom-6 text-[10px] font-black uppercase tracking-[1em] text-secondary-custom opacity-10">
                CALMATE DNA SYSTEMS
            </div>
        </div>
    );
};

export default WelcomeScreen;