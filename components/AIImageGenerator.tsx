import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import ResultCard from './shared/ResultCard';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';

const MAX_PROMPT_LENGTH = 1000;

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Write a Detailed Prompt",
        description: "Describe the image you want to create. Be specific about subjects, style, and lighting."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Image",
        description: "Click the generate button and wait for the AI to bring your prompt to life."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
        title: "Download & Share",
        description: "Once your image is ready, you can download it or share it with others."
    },
];

const AIImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [fileName, setFileName] = useState('generated-image.jpg');

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }

        setLoading(true);
        setError('');
        setImage('');
        const safeFileName = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'generated';
        setFileName(`${safeFileName}.jpg`);

        try {
            const base64Image = await generateImage(prompt);
            setImage(`data:image/jpeg;base64,${base64Image}`);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.AIImageGenerator} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar: How to Use */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                {/* Main Content: Input and Output */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Input Column */}
                        <div className="md:sticky md:top-24 h-fit">
                            <div className="glass-card rounded-lg p-6 space-y-4">
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Enter a detailed prompt to generate an image..."
                                        className="w-full p-3 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        rows={4}
                                        maxLength={MAX_PROMPT_LENGTH}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                        {prompt.length} / {MAX_PROMPT_LENGTH}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    title="Generate an image based on your prompt"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Image'
                                    )}
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>

                        {/* Output Column */}
                        <div>
                            {loading ? (
                                <ProcessingView
                                    title="Generating Your Image..."
                                    messages={[
                                        "Initializing diffusion process...",
                                        "Iterating on visual concepts...",
                                        "Upscaling to high resolution...",
                                        "Adding final touches..."
                                    ]}
                                />
                            ) : (
                                image && (
                                    <ResultCard 
                                        title="Generated Image"
                                        content={prompt}
                                        imageUrl={image}
                                        onDownload={handleDownload}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIImageGenerator;