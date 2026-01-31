import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const AuthScreen: React.FC = () => {
    const { completeOnboardingStep } = useAppContext();
    const { signIn } = useAuthActions();
    const ensureUserCreated = useMutation(api.users.ensureUserCreated);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [flow, setFlow] = useState<'signIn' | 'signUp'>('signUp');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        // Validation
        if (!email || !password) {
            setError('Missing credentials. Please fill all fields.');
            return;
        }

        if (!email.includes('@')) {
            setError('Invalid protocol format. Check your mail.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`[Auth] Initiating ${flow} sequence for:`, email);

            // Call Convex Auth signIn
            // The Password provider handles both sign in and sign up via the 'flow' param
            await signIn("password", { email, password, flow });

            console.log(`[Auth] ${flow} successful.`);

            // We don't call ensureUserCreated here anymore. 
            // We'll let the AppContext handle the redirect once it detects the auth state change.
            // This avoids race conditions between auth token and mutation calls.

        } catch (err: any) {
            console.error('[Auth] Error during sequence:', err);
            const msg = (err?.message || err?.toString() || '').toLowerCase();

            if (msg.includes('already exists') || msg.includes('unique constraint')) {
                setError('Account already synced. Try signing in.');
            } else if (msg.includes('invalid_confirm_password')) {
                setError('Keys do not match. Re-verify.');
            } else if (msg.includes('invalid_password') || msg.includes('incorrect password')) {
                setError('Invalid credentials for this protocol.');
            } else if (msg.includes('not found') || msg.includes('no user')) {
                if (flow === 'signIn') {
                    setError('No protocol found for this mail. Sign up instead.');
                } else {
                    // Show actual error for sign-up
                    setError(`Sign-up failed: ${err.message || 'Unknown Error'}`);
                }
            } else {
                setError(err.message || 'Neural link failed. Try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full p-10 bg-app text-primary-custom justify-between overflow-y-auto no-scrollbar">
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 my-10">
                <div className="w-28 h-28 bg-primary text-primary-foreground rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(204,255,0,0.2)] rotate-6">
                    <span className="text-6xl">🍏</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic mb-3 uppercase">
                    {flow === 'signUp' ? 'SECURE DATA' : 'ACCESS PORTAL'}
                </h1>
                <div className="h-1 bg-primary w-20 mb-4 rounded-full opacity-50"></div>
                <p className="text-secondary-custom font-black uppercase text-[11px] tracking-[0.4em] opacity-80">
                    {flow === 'signUp' ? 'Sync with your physiological profile.' : 'Unlock your nutritional bio-data.'}
                </p>
            </div>

            <div className="space-y-10 w-full max-w-sm mx-auto pb-12">
                <div className="space-y-8">
                    {error && (
                        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in-95">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="block text-[10px] font-black tracking-widest text-primary uppercase ml-6">Access Mail</label>
                        <input
                            type="email"
                            placeholder="user@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-custom"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-black tracking-widest text-primary uppercase ml-6">Neural Key</label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-custom"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleAuth}
                        disabled={loading}
                        className="onboarding-btn disabled:opacity-50"
                    >
                        {loading ? 'PROCESSING...' : flow === 'signUp' ? 'INITIALIZE ACCOUNT' : 'SECURE ACCESS'}
                    </button>

                    <button
                        onClick={() => setFlow(flow === 'signUp' ? 'signIn' : 'signUp')}
                        className="w-full text-center text-secondary-custom font-black uppercase text-[10px] tracking-[0.2em] hover:text-primary transition-colors"
                    >
                        {flow === 'signUp' ? 'Already have a protocol? Sign In' : 'New agent? Create Profile'}
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-border-custom opacity-50"></div>
                        <span className="flex-shrink mx-6 text-secondary-custom font-black uppercase text-[9px] tracking-[0.3em] opacity-40">alternative gateways</span>
                        <div className="flex-grow border-t border-border-custom opacity-50"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 opacity-50 grayscale pointer-events-none">
                        <button className="flex items-center justify-center space-x-3 p-5 bg-card-custom border border-border-custom rounded-3xl text-primary-custom font-black shadow-sm group">
                            <span className="text-xl">🔵</span>
                            <span className="uppercase text-[10px] tracking-widest leading-none">GOOGLE</span>
                        </button>
                        <button className="flex items-center justify-center space-x-3 p-5 bg-card-custom border border-border-custom rounded-3xl text-primary-custom font-black shadow-sm group">
                            <span className="text-xl">🍎</span>
                            <span className="uppercase text-[10px] tracking-widest leading-none">APPLE</span>
                        </button>
                    </div>
                </div>

                <p className="text-center text-[9px] font-black text-secondary-custom leading-relaxed opacity-40 uppercase tracking-widest">
                    Encryption Active. By continuing, you agree to the <br />
                    <a href="#" className="underline hover:text-primary">Bio-Terms</a> & <a href="#" className="underline hover:text-primary">Data-Policy</a>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;