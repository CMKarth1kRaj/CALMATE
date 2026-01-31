import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const features = [
    {
        icon: '📷',
        title: "SIG-IDENTIFY",
        subtitle: "Snap & Track Instantly",
        description: "Advanced AI identifies compounds and calculates bio-data automatically.",
    },
    {
        icon: '🤖',
        title: "CORE-GEN",
        subtitle: "AI-Powered Meal Plans",
        description: "Customized synthesis based on your evolving physiological goals.",
    },
    {
        icon: '📝',
        title: "BIO-LOG",
        subtitle: "Track Your Journey",
        description: "Encrypted history of all nutritional intake and progress markers.",
    },
    {
        icon: '📈',
        title: "METRI-CORE",
        subtitle: "Insights That Matter",
        description: "Deep analytics on calories, macros, and trend-line performance.",
    }
];

const FeatureShowcase: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const { completeOnboardingStep } = useAppContext();

    const next = () => {
        if (current < features.length - 1) {
            setCurrent(c => c + 1);
        } else {
            completeOnboardingStep('auth');
        }
    };

    return (
        <div className="flex flex-col h-screen w-full p-10 bg-app text-center justify-between">
            <div className="flex-1 flex flex-col justify-center items-center animate-in fade-in zoom-in-95 duration-700 max-w-sm mx-auto">
                <div className="relative mb-12">
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative text-7xl p-12 bg-card-custom border border-border-custom rounded-[3.5rem] shadow-2xl rotate-3">
                        {features[current].icon}
                    </div>
                </div>

                <h3 className="text-sm font-black text-primary tracking-[0.5em] mb-4 uppercase opacity-80">
                    {features[current].title}
                </h3>

                <h2 className="text-4xl font-black text-primary-custom tracking-tighter italic mb-4 uppercase">
                    {features[current].subtitle}
                </h2>

                <p className="mt-2 text-lg text-secondary-custom font-bold leading-relaxed max-w-[280px]">
                    {features[current].description}
                </p>
            </div>

            <div className="flex flex-col items-center space-y-12 pb-12 w-full max-w-sm mx-auto">
                <div className="flex justify-center space-x-3">
                    {features.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'bg-primary w-12' : 'bg-card-custom border border-border-custom w-4'}`}
                        ></div>
                    ))}
                </div>

                <button
                    onClick={next}
                    className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-6 rounded-[2.5rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer"
                >
                    {current < features.length - 1 ? 'NEXT PROTOCOL' : 'SECURE ACCESS'}
                </button>
            </div>
        </div>
    );
};

export default FeatureShowcase;
