import React, { useState } from 'react';
import { generateImageFromImage } from '../services/geminiService';
import FileUpload from './shared/FileUpload';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload Your Product",
        description: "Select a clear image of your product, preferably with a simple background."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Describe the Ad Scene",
        description: "Write a prompt for the background or setting you want to place your product in."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Ad",
        description: "The AI will generate a promotional image featuring your product in the described setting."
    },
];


const PromotionalAdsGenerator: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [result, setResult] = useState<{ text: string, image: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setImageFile(file);
            setResult(null);
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            setError('Please upload a product image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please describe the scene for the ad.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const fullPrompt = `Create a promotional advertisement image. Place the product from the user's uploaded image into the following scene, ensuring a professional and appealing composition: "${prompt}". The result should look like a high-quality ad.`
            const generatedResult = await generateImageFromImage(imageFile, fullPrompt);
            setResult({
                ...generatedResult,
                image: `data:image/png;base64,${generatedResult.image}`
            });
        } catch (err) {
            setError('Failed to generate ad. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.PromotionalAdsGenerator} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:sticky md:top-24 h-fit">
                            <div className="glass-card rounded-lg p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-700 mb-2">1. Upload Product Image</h3>
                                        {preview ? (
                                            <div className="relative group">
                                                <img src={preview} alt="Upload preview" className="rounded-lg w-full object-contain max-h-64 bg-slate-100" />
                                                <button onClick={() => { setPreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70" title="Remove image">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <FileUpload onFilesSelect={handleFileSelect} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-700 mb-2">2. Describe Ad Scene</h3>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="e.g., on a minimalist concrete podium with dramatic lighting, surrounded by splashing water and fruit"
                                            className="w-full h-full min-h-[100px] p-3 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!imageFile || !prompt || loading}
                                    title="Generate a promotional ad"
                                    className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Ad'
                                    )}
                                </button>
                                {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                            </div>
                        </div>
                        
                        <div>
                            {loading && (
                                <ProcessingView
                                    title="Producing Your Ad..."
                                    messages={[ "Analyzing product...", "Building the virtual set...", "Adjusting lighting...", "Generating final shot..." ]}
                                    previewUrl={preview!}
                                />
                            )}
                            
                            {result && (
                                <div className="glass-card p-4 rounded-lg border border-blue-500/50 animate-fade-in">
                                    <h3 className="text-xl font-semibold mb-3 text-center text-blue-600">Generated Ad</h3>
                                    <img src={result.image} alt="Generated" className="rounded-lg shadow-lg w-full" />
                                    <p className="mt-4 text-sm text-slate-600 bg-slate-100/50 p-3 rounded-md">{result.text}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionalAdsGenerator;