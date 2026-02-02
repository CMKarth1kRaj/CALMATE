import React, { useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CameraIcon } from '../icons';

const CameraScreen: React.FC = () => {
    const { setImageForAnalysis } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImageForAnalysis(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col h-full w-full items-center justify-between bg-app text-primary-custom p-10 font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            <header className="text-center mt-12 z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none mb-4">
                    Neural Scan
                </h1>
                <p className="text-secondary-custom font-bold uppercase text-[10px] md:text-xs tracking-[0.4em] opacity-60">
                    Proprietary Dish Detection Sequence
                </p>
            </header>

            {/* Viewfinder Area */}
            <div className="relative w-full max-w-sm aspect-square z-10 group">
                {/* Tech Corners */}
                <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-2xl duration-500 group-hover:scale-110"></div>
                <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-2xl duration-500 group-hover:scale-110"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-2xl duration-500 group-hover:scale-110"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-2xl duration-500 group-hover:scale-110"></div>

                {/* Animated Scan Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(204,255,0,0.8)] animate-[scan_3s_linear_infinite] z-20"></div>

                <div className="w-full h-full bg-card-custom/40 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center border border-border-custom shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                    <CameraIcon className="w-24 h-24 text-primary opacity-20 mb-4 animate-bounce" />
                    <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.2em] opacity-40">Ready for capture</p>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full flex flex-col items-center space-y-12 mb-12 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-secondary-custom font-black uppercase text-[10px] tracking-[0.3em] italic mb-1">Status: <span className="text-primary italic">Neural Link Active</span></p>
                    <button
                        onClick={triggerFileInput}
                        aria-label="Capture Photo"
                        className="w-24 h-24 bg-primary text-black rounded-full flex items-center justify-center border-[8px] border-white shadow-[0_0_40px_rgba(204,255,0,0.4)] transform transition-all duration-500 hover:scale-110 active:scale-90 cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                            <span className="text-4xl">📸</span>
                        </div>
                    </button>
                </div>

                <div className="flex flex-col items-center space-y-4 w-full">
                    <button
                        onClick={triggerFileInput}
                        className="w-full max-w-xs bg-card-custom border border-border-custom text-primary-custom font-black py-6 rounded-[2.2rem] text-sm uppercase tracking-[0.25em] transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 shadow-xl cursor-pointer"
                    >
                        Upload Local File
                    </button>
                    <p className="text-secondary-custom font-black uppercase text-[9px] tracking-widest opacity-30 italic">Targeting Indian Cuisine Protocols V4.2</p>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Background elements */}
            <div className="absolute -left-20 bottom-1/4 w-60 h-60 bg-primary opacity-[0.03] rounded-full blur-[100px]"></div>
            <div className="absolute -right-20 top-1/4 w-80 h-80 bg-primary opacity-[0.03] rounded-full blur-[120px]"></div>
        </div>
    );
};

export default CameraScreen;
