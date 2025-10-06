import React, { useState } from 'react';
import { generateImage, generateAdScript, generateImageFromImage } from '../services/geminiService';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';
import FileUpload from './shared/FileUpload';

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Create Your Avatar",
        description: "Generate the avatar you want to feature by uploading an image or describing it with text."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Provide Ad Context",
        description: "Enter the product/topic for the UGC ad. You can also upload a product image."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Script",
        description: "The AI will generate a UGC script tailored for your avatar and product."
    },
];

interface Script {
    title: string;
    hook: string;
    scenes: { scene: number, visual: string, voiceover: string }[];
    cta: string;
}

const AvatarToUGC: React.FC = () => {
    const [avatarPrompt, setAvatarPrompt] = useState<string>('');
    const [adTopic, setAdTopic] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [productFile, setProductFile] = useState<File | null>(null);
    const [productPreview, setProductPreview] = useState<string | null>(null);
    const [avatarImage, setAvatarImage] = useState<string>('');
    const [script, setScript] = useState<Script | null>(null);
    const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
    const [loadingScript, setLoadingScript] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleAvatarFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setAvatarFile(files[0]);
            setAvatarPreview(URL.createObjectURL(files[0]));
        }
    };

    const handleProductFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setProductFile(files[0]);
            setProductPreview(URL.createObjectURL(files[0]));
        }
    };

    const handleAvatarSubmit = async () => {
        if (!avatarPrompt.trim() && !avatarFile) {
            setError('Please describe the avatar or upload an image.');
            return;
        }
        setLoadingAvatar(true);
        setError('');
        try {
            if (avatarFile) {
                const result = await generateImageFromImage(avatarFile, `turn the person in this image into a digital avatar. Style: ${avatarPrompt || 'realistic 3d character'}`);
                setAvatarImage(`data:image/jpeg;base64,${result.image}`);
            } else {
                const fullPrompt = `close-up portrait of a digital avatar, ${avatarPrompt}, high detail, character concept art`;
                const base64Image = await generateImage(fullPrompt);
                setAvatarImage(`data:image/jpeg;base64,${base64Image}`);
            }
        } catch (e) {
            setError('Failed to generate avatar.');
        } finally {
            setLoadingAvatar(false);
        }
    };

    const handleScriptSubmit = async () => {
        if (!adTopic.trim()) {
            setError('Please provide an ad topic.');
            return;
        }
        setLoadingScript(true);
        setError('');
        try {
            const fullPrompt = `Generate a UGC-style ad script for the following topic: ${adTopic}. The script should be spoken by the avatar.`;
            const generatedScript = await generateAdScript(fullPrompt, 'UGC', productFile ?? undefined);
            setScript(generatedScript);
        } catch (e) {
            setError('Failed to generate script.');
        } finally {
            setLoadingScript(false);
        }
    };
    
    const btnClasses = "w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400";

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.AvatarToUGC} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-lg space-y-4">
                                <h3 className="text-lg font-semibold text-slate-700">1. Create Your Avatar</h3>
                                {avatarPreview ? (
                                    <div className="relative group"><img src={avatarPreview} alt="Preview" className="rounded-lg w-full" /><button onClick={() => {setAvatarFile(null); setAvatarPreview(null);}} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white" title="Remove"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                                ) : <FileUpload onFilesSelect={handleAvatarFileSelect} />}
                                <textarea
                                    value={avatarPrompt}
                                    onChange={(e) => setAvatarPrompt(e.target.value)}
                                    placeholder={avatarFile ? "Describe style change (e.g., cartoon)" : "Describe avatar from scratch..."}
                                    className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                    rows={3}
                                />
                                <button onClick={handleAvatarSubmit} disabled={loadingAvatar || (!avatarPrompt && !avatarFile)} className={btnClasses}>
                                    {loadingAvatar ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Avatar'
                                    )}
                                </button>
                            </div>
                            {avatarImage && (
                                <div className="glass-card p-6 rounded-lg space-y-4 animate-fade-in">
                                    <h3 className="text-lg font-semibold text-slate-700">2. Define Ad Topic</h3>
                                    {productPreview ? (
                                        <div className="relative group"><img src={productPreview} alt="Preview" className="rounded-lg w-full" /><button onClick={() => {setProductFile(null); setProductPreview(null)}} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white" title="Remove"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                                    ) : <FileUpload onFilesSelect={handleProductFileSelect} />}
                                    <textarea
                                        value={adTopic}
                                        onChange={(e) => setAdTopic(e.target.value)}
                                        placeholder="e.g., a review of a new energy drink"
                                        className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                        rows={3}
                                    />
                                    <button onClick={handleScriptSubmit} disabled={loadingScript || !adTopic} className={btnClasses}>
                                        {loadingScript ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Generating...
                                            </>
                                        ) : (
                                            'Generate UGC Script'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-6">
                            {loadingAvatar && <ProcessingView title="Generating Avatar..." messages={["Creating character...", "Rendering image..."]} previewUrl={avatarPreview ?? undefined} />}
                            {avatarImage && (
                                <div className="glass-card p-4 rounded-lg animate-fade-in">
                                    <img src={avatarImage} alt="Generated Avatar" className="w-full rounded-lg" />
                                </div>
                            )}
                            {loadingScript && <ProcessingView title="Writing Script..." messages={["Brainstorming UGC ideas...", "Writing scenes...", "Finalizing script..."]} previewUrl={productPreview ?? undefined} />}
                            {script && (
                                <div className="glass-card rounded-lg shadow-lg p-6 animate-fade-in space-y-4">
                                    <h3 className="text-xl font-bold text-blue-600">{script.title}</h3>
                                    <div><h4 className="font-semibold text-slate-800">Hook:</h4><p className="text-slate-600 italic">"{script.hook}"</p></div>
                                    <div className="space-y-3"><h4 className="font-semibold text-slate-800">Scenes:</h4>
                                        {script.scenes.map(s => (
                                            <div key={s.scene} className="border-l-2 border-blue-200 pl-3 text-sm">
                                                <p><strong className="text-slate-900">Visual:</strong> {s.visual}</p>
                                                <p><strong className="text-slate-900">Voiceover:</strong> {s.voiceover}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div><h4 className="font-semibold text-slate-800">CTA:</h4><p className="text-slate-600">{script.cta}</p></div>
                                </div>
                            )}
                            {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarToUGC;