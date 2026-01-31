

import React, { useState, useCallback, useMemo } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import SplashScreen from './components/onboarding/SplashScreen';
import WelcomeScreen from './components/onboarding/WelcomeScreen';
import ProfileSetupFlow from './components/onboarding/ProfileSetupFlow';
import FeatureShowcase from './components/onboarding/FeatureShowcase';
import AuthScreen from './components/onboarding/AuthScreen';
import DashboardScreen from './components/main/DashboardScreen';
import MealLogScreen from './components/main/MealLogScreen';
import CameraScreen from './components/main/CameraScreen';
import AnalysisScreen from './components/main/AnalysisScreen';
import PlannerScreen from './components/main/PlannerScreen';
import ProfileScreen from './components/main/ProfileScreen';
import BottomNav from './components/BottomNav';
import { Screen } from './types';

const AppContent: React.FC = () => {
    const { screen, onboardingStep, showOnboarding, imageForAnalysis, isLoading } = useAppContext();

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-app flex flex-col items-center justify-center p-10 font-sans">
                <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center animate-pulse mb-8 rotate-12">
                    <span className="text-5xl">🍏</span>
                </div>
                <div className="h-2 bg-secondary-custom/20 w-48 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.4em] opacity-40">Connecting Neural Link...</p>
            </div>
        );
    }

    if (showOnboarding) {
        const renderOnboarding = () => {
            switch (onboardingStep) {
                case 'splash':
                    return <SplashScreen />;
                case 'welcome':
                    return <WelcomeScreen />;
                case 'profileSetup':
                    return <ProfileSetupFlow />;
                case 'features':
                    return <FeatureShowcase />;
                case 'auth':
                    return <AuthScreen />;
                default:
                    return <SplashScreen />;
            }
        };

        return (
            <div className="h-screen w-full bg-app flex flex-col font-sans overflow-hidden">
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="max-w-md mx-auto w-full h-full">
                        {renderOnboarding()}
                    </div>
                </main>
            </div>
        );
    }

    const renderScreen = () => {
        if (imageForAnalysis) {
            return <AnalysisScreen />;
        }

        switch (screen) {
            case Screen.Dashboard:
                return <DashboardScreen />;
            case Screen.MealLog:
                return <MealLogScreen />;
            case Screen.Camera:
                return <CameraScreen />;
            case Screen.Planner:
                return <PlannerScreen />;
            case Screen.Profile:
                return <ProfileScreen />;
            default:
                return <DashboardScreen />;
        }
    };

    return (
        <div className="h-screen w-full bg-app flex flex-col md:flex-row font-sans overflow-hidden">
            {!imageForAnalysis && <BottomNav />}
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0 no-scrollbar">
                <div className="w-full">
                    {renderScreen()}
                </div>
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;