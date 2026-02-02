import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Gender, Goal, ActivityLevel, UserProfile } from '../../types';

type FormData = Omit<UserProfile, 'dailyCalorieTarget'>;

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Unknown"
];

const HEALTH_ISSUES = [
    "Diabetes", "Hypertension", "Thyroid", "PCOD/PCOS", "Gluten Allergy",
    "Lactose Intolerance", "Egg Allergy", "Nut Allergy", "High Cholesterol"
];

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
    <div className="flex justify-center space-x-3 my-10">
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${i + 1 <= current ? 'w-12 bg-primary' : 'w-4 bg-card-custom border border-border-custom'}`}
            ></div>
        ))}
    </div>
);

const Step1_BasicInfo: React.FC<{ onNext: () => void; data: FormData; setData: React.Dispatch<React.SetStateAction<FormData>> }> = ({ onNext, data, setData }) => (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-6 duration-700 w-full px-4">
        <h2 className="text-5xl font-black text-primary-custom tracking-tighter italic mb-2">IDENTITY</h2>
        <p className="text-secondary-custom font-bold uppercase text-[11px] tracking-[0.25em] mb-12">Who are we building for?</p>

        <div className="w-full space-y-8 max-w-sm">
            <div className="space-y-3">
                <label className="block text-left text-[10px] font-black uppercase tracking-widest text-secondary-custom ml-6">Full Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={data.name}
                    onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                    className="w-full p-5 bg-card-custom border border-border-custom rounded-[1.8rem] text-lg font-bold text-primary-custom focus:ring-4 ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="block text-left text-[10px] font-black uppercase tracking-widest text-secondary-custom ml-6">Age</label>
                    <input
                        type="number"
                        placeholder="25"
                        value={data.age === 0 ? '' : data.age}
                        onChange={e => setData(d => ({ ...d, age: Number(e.target.value) }))}
                        className="w-full p-5 bg-card-custom border border-border-custom rounded-[1.8rem] text-lg font-bold text-primary-custom focus:ring-4 ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                    />
                </div>
                <div className="space-y-3">
                    <label className="block text-left text-[10px] font-black uppercase tracking-widest text-secondary-custom ml-6">Gender</label>
                    <div className="relative">
                        <select
                            value={data.gender}
                            onChange={e => setData(d => ({ ...d, gender: e.target.value as Gender }))}
                            className="w-full p-5 bg-card-custom border border-border-custom rounded-[1.8rem] text-lg font-bold text-primary-custom focus:ring-4 ring-primary/20 outline-none transition-all duration-300 shadow-sm appearance-none"
                        >
                            <option value={Gender.Female}>Female</option>
                            <option value={Gender.Male}>Male</option>
                            <option value={Gender.Other}>Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-secondary-custom text-xs">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-16 w-full max-w-sm">
            <button
                onClick={() => {
                    if (!data.name.trim()) {
                        alert("Please enter your name to proceed.");
                        return;
                    }
                    onNext();
                }}
                className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer"
            >
                Next Step
            </button>
        </div>
    </div>
);

const Step2_BodyMetrics: React.FC<{ onNext: () => void; data: FormData; setData: React.Dispatch<React.SetStateAction<FormData>> }> = ({ onNext, data, setData }) => (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-right-6 duration-700 w-full px-4 text-primary-custom">
        <h2 className="text-5xl font-black text-primary-custom tracking-tighter italic mb-2">METRICS</h2>
        <p className="text-secondary-custom font-bold uppercase text-[11px] tracking-[0.25em] mb-12">Calibration time.</p>

        <div className="w-full space-y-12 max-w-sm">
            <div className="p-10 bg-card-custom border border-border-custom rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                <label className="block text-[10px] font-black tracking-[0.4em] uppercase text-secondary-custom mb-10">Weight (kg)</label>

                <div className="relative flex items-center justify-center h-14 mb-8">
                    <input
                        type="range"
                        min="30"
                        max="200"
                        value={data.weight}
                        onChange={e => setData(d => ({ ...d, weight: Number(e.target.value) }))}
                        className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                    />
                    <div className="w-full h-3 bg-secondary-custom/20 rounded-full overflow-hidden relative z-10 p-0.5">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
                            style={{ width: `${((data.weight - 30) / (200 - 30)) * 100}%` }}
                        />
                    </div>
                    <div
                        className="absolute h-10 w-10 bg-app border-[6px] border-primary rounded-full shadow-2xl z-20 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center"
                        style={{ left: `calc(${((data.weight - 30) / (200 - 30)) * 100}% - 20px)` }}
                    >
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-7xl font-black tracking-tighter">{data.weight}</span>
                    <span className="text-2xl font-black italic text-primary-custom/40 uppercase">kg</span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-left text-[10px] font-black uppercase tracking-widest text-secondary-custom ml-6">Height (cm)</label>
                <input
                    type="number"
                    placeholder="180"
                    value={data.height === 0 ? '' : data.height}
                    onChange={e => setData(d => ({ ...d, height: Number(e.target.value) }))}
                    className="w-full p-5 bg-card-custom border border-border-custom rounded-[1.8rem] text-lg font-bold text-primary-custom focus:ring-4 ring-primary/20 outline-none transition-all duration-300 shadow-sm text-center"
                />
            </div>
        </div>

        <div className="mt-16 w-full max-w-sm">
            <button onClick={onNext} className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer">Continue</button>
        </div>
    </div>
);

const MetricCard: React.FC<{ title: string; icon: string; selected: boolean; onClick: () => void }> = ({ title, icon, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full p-8 border rounded-[2.5rem] text-center transition-all duration-500 relative overflow-hidden group cursor-pointer ${selected ? 'bg-primary border-primary shadow-2xl scale-[1.05]' : 'bg-card-custom border-border-custom grayscale-0 opacity-100 hover:border-primary/40'}`}
    >
        <div className="text-5xl mb-6 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">{icon}</div>
        <p className={`font-black uppercase text-[11px] tracking-[0.2em] ${selected ? 'text-primary-foreground' : 'text-primary-custom'}`}>{title}</p>
        {selected && (
            <div className="absolute top-4 right-4 w-2 h-2 bg-primary-foreground rounded-full animate-ping"></div>
        )}
    </button>
);

const Step3_Goal: React.FC<{ onNext: () => void; data: FormData; setData: React.Dispatch<React.SetStateAction<FormData>> }> = ({ onNext, data, setData }) => (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-right-6 duration-700 w-full px-4">
        <h2 className="text-5xl font-black text-primary-custom tracking-tighter italic mb-2">MISSION</h2>
        <p className="text-secondary-custom font-bold uppercase text-[11px] tracking-[0.25em] mb-12">What's the end game?</p>

        <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            <MetricCard title="Cut" icon="🎯" selected={data.goal === Goal.WeightLoss} onClick={() => setData(d => ({ ...d, goal: Goal.WeightLoss, targetWeight: d.weight - 5 }))} />
            <MetricCard title="Bulk" icon="💪" selected={data.goal === Goal.WeightGain} onClick={() => setData(d => ({ ...d, goal: Goal.WeightGain, targetWeight: d.weight + 5 }))} />
            <MetricCard title="Maintain" icon="⚖️" selected={data.goal === Goal.Maintain} onClick={() => setData(d => ({ ...d, goal: Goal.Maintain, targetWeight: d.weight }))} />
            <MetricCard title="Build" icon="🏋️" selected={data.goal === Goal.BuildMuscle} onClick={() => setData(d => ({ ...d, goal: Goal.BuildMuscle, targetWeight: d.weight + 2 }))} />
        </div>

        <div className="mt-16 w-full max-w-sm">
            <button onClick={onNext} className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer">Next Step</button>
        </div>
    </div>
);

const Step4_RegionAndHealth: React.FC<{ onNext: () => void; data: FormData; setData: React.Dispatch<React.SetStateAction<FormData>> }> = ({ onNext, data, setData }) => {
    const toggleIssue = (issue: string) => {
        setData(d => ({
            ...d,
            healthIssues: d.healthIssues.includes(issue)
                ? d.healthIssues.filter(i => i !== issue)
                : [...d.healthIssues, issue]
        }));
    };

    return (
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-right-6 duration-700 w-full px-4">
            <h2 className="text-5xl font-black text-primary-custom tracking-tighter italic mb-2">BIO-DATA</h2>
            <p className="text-secondary-custom font-bold uppercase text-[11px] tracking-[0.25em] mb-12">Regional & Health check.</p>

            <div className="w-full space-y-8 max-w-sm">
                <div className="space-y-3">
                    <label className="block text-left text-[10px] font-black uppercase tracking-widest text-secondary-custom ml-6">Native State (for regional food)</label>
                    <div className="relative">
                        <select
                            value={data.state}
                            onChange={e => setData(d => ({ ...d, state: e.target.value }))}
                            className="w-full p-5 bg-card-custom border border-border-custom rounded-[1.8rem] text-lg font-bold text-primary-custom focus:ring-4 ring-primary/20 outline-none transition-all duration-300 shadow-sm appearance-none"
                        >
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-secondary-custom text-xs">▼</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-left text-[10px] font-black uppercase tracking-widest text-secondary-custom ml-6">Health Conditions / Allergies</label>
                    <div className="grid grid-cols-2 gap-3">
                        {HEALTH_ISSUES.map(issue => (
                            <button
                                key={issue}
                                onClick={() => toggleIssue(issue)}
                                className={`p-3 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all duration-300 border ${data.healthIssues.includes(issue)
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : 'bg-card-custom border-border-custom text-secondary-custom opacity-60'
                                    }`}
                            >
                                {issue}
                            </button>
                        ))}
                    </div>
                    {data.healthIssues.length === 0 && <p className="text-[9px] text-secondary-custom font-bold italic mt-2">None selected - Standard plan will be applied.</p>}
                </div>
            </div>

            <div className="mt-16 w-full max-w-sm">
                <button onClick={onNext} className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer">Last Step</button>
            </div>
        </div>
    );
};

const Step5_Activity: React.FC<{ onNext: () => void; data: FormData; setData: React.Dispatch<React.SetStateAction<FormData>>; loading?: boolean }> = ({ onNext, data, setData, loading }) => {
    const levels = Object.values(ActivityLevel);
    return (
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-right-6 duration-700 w-full px-4">
            <h2 className="text-5xl font-black text-primary-custom tracking-tighter italic mb-2">ACTIVE</h2>
            <p className="text-secondary-custom font-bold uppercase text-[11px] tracking-[0.25em] mb-12">Intensity level?</p>

            <div className="w-full space-y-4 max-w-sm">
                {levels.map(l => (
                    <button
                        key={l}
                        onClick={() => setData(d => ({ ...d, activityLevel: l }))}
                        className={`w-full p-6 border rounded-[2rem] text-center transition-all duration-300 cursor-pointer ${data.activityLevel === l ? 'bg-primary border-primary text-primary-foreground font-black shadow-xl ring-4 ring-primary/10' : 'bg-card-custom border-border-custom text-primary-custom hover:border-primary/40 uppercase text-[11px] tracking-[0.3em]'}`}
                    >
                        {l.replace('_', ' ').toLowerCase()}
                    </button>
                ))}
            </div>

            <div className="mt-16 w-full max-w-sm">
                <button
                    onClick={onNext}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground flex items-center justify-center font-black py-5 rounded-[2.2rem] text-xl transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'INITIALIZING...' : 'Complete Setup'}
                </button>
            </div>
        </div>
    );
};

const ProfileSetupFlow: React.FC = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { completeOnboardingStep, setUserProfile } = useAppContext();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        age: 25,
        gender: Gender.Male,
        weight: 75,
        height: 180,
        goal: Goal.WeightLoss,
        targetWeight: 70,
        activityLevel: ActivityLevel.ModeratelyActive,
        state: 'Unknown',
        healthIssues: []
    });

    const nextStep = () => {
        if (step < 5) {
            setStep(s => s + 1);
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            await setUserProfile({
                ...formData,
                dailyCalorieTarget: 0, // Backend will calculate this
            });
            completeOnboardingStep('done');
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1_BasicInfo onNext={nextStep} data={formData} setData={setFormData} />;
            case 2: return <Step2_BodyMetrics onNext={nextStep} data={formData} setData={setFormData} />;
            case 3: return <Step3_Goal onNext={nextStep} data={formData} setData={setFormData} />;
            case 4: return <Step4_RegionAndHealth onNext={nextStep} data={formData} setData={setFormData} />;
            case 5: return <Step5_Activity onNext={handleFinish} data={formData} setData={setFormData} loading={loading} />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-screen w-full p-8 bg-app overflow-y-auto no-scrollbar items-center pb-20">
            <StepIndicator current={step} total={5} />
            <div className="flex-1 flex flex-col justify-center w-full max-w-lg">
                {renderStep()}
            </div>
        </div>
    );
};

export default ProfileSetupFlow;