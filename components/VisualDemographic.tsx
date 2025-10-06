import React, { useState } from 'react';
import { generatePromptFromImage } from '../services/geminiService';
import FileUpload from './shared/FileUpload';
import ResultCard from './shared/ResultCard';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload Your Image",
        description: "Click or drag and drop an image file into the upload area."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Analyze Demographic",
        description: "Click the 'Analyze' button to let the AI analyze your image."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
        title: "Copy & Use",
        description: "Your detailed analysis will appear. Copy it for your marketing or creative briefs."
    },
];

const VisualDemographic: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setImageFile(file);
            setAnalysis('');
            setError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const clearState = () => {
        setImageFile(null);
        setPreview(null);
        setAnalysis('');
        setError('');
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        setError('');
        setAnalysis('');

        try {
            const generatedAnalysis = await generatePromptFromImage(imageFile);
            setAnalysis(generatedAnalysis);
        } catch (err) {
            setError('Failed to generate analysis. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* FIX: Changed key to ImageToPrompt to align with the functionality of the component and fix naming inconsistencies. */}
            <ToolHeader toolKey={ToolKey.ImageToPrompt} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:sticky md:top-24 h-fit">
                            <div className="glass-card p-6 rounded-lg space-y-4">
                                {preview ? (
                                    <div className="relative group">
                                        <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-lg object-contain max-h-96" />
                                        <button onClick={clearState} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-opacity duration-300 opacity-0 group-hover:opacity-100" title="Remove image">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <FileUpload onFilesSelect={handleFileSelect} />
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={!imageFile || loading}
                                    title="Generate a demographic analysis from your image"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze Demographic'
                                    )}
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>

                        <div>
                            {loading ? (
                                <ProcessingView
                                    title="Analyzing Your Image..."
                                    messages={[
                                        "Identifying key objects and subjects...",
                                        "Analyzing composition and lighting...",
                                        "Extracting stylistic elements...",
                                        "Compiling demographic analysis..."
                                    ]}
                                    previewUrl={preview!}
                                />
                            ) : (
                                analysis && <ResultCard title="Visual Analysis" content={analysis} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualDemographic;