
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
        <div className="flex flex-col h-full w-full items-center justify-between bg-black text-white p-8">
            <div className="text-center mt-8">
                <h1 className="text-3xl font-bold">Log Your Meal</h1>
                <p className="text-gray-300 mt-2">Capture or upload a photo of your food.</p>
            </div>
            
            <div className="w-full max-w-xs aspect-square bg-gray-900 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-600">
                <CameraIcon className="w-16 h-16 text-gray-700" />
            </div>

            <div className="w-full flex flex-col items-center space-y-4 mb-8">
                <button onClick={triggerFileInput} aria-label="Capture Photo" className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-500 shadow-lg transform transition hover:scale-110">
                    <div className="w-16 h-16 bg-white rounded-full ring-2 ring-inset ring-black"></div>
                </button>
                <button onClick={triggerFileInput} className="bg-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-700 transition">
                    Upload from Gallery
                </button>
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};

export default CameraScreen;
