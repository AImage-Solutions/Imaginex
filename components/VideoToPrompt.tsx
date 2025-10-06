import React, { useState } from 'react';
import { generatePromptFromVideo } from '../services/geminiService';
import FileUpload from './shared/FileUpload';
import ResultCard from './shared/ResultCard';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload Your Video",
        description: "Click or drag and drop a video file into the upload area."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Prompt",
        description: "Let the AI analyze your video's content, style, and motion to generate a prompt."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
        title: "Copy & Use",
        description: "Your creative prompt will appear, ready for use in any AI generator."
    },
];

const VideoToPrompt: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setVideoFile(file);
            setPrompt('');
            setError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const clearState = () => {
        setVideoFile(null);
        setPreview(null);
        setPrompt('');
        setError('');
    };

    const handleSubmit = async () => {
        if (!videoFile) {
            setError('Please upload a video first.');
            return;
        }

        setLoading(true);
        setError('');
        setPrompt('');

        try {
            const generatedPrompt = await generatePromptFromVideo(videoFile);
            setPrompt(generatedPrompt);
        } catch (err) {
            setError('Failed to generate prompt. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.VideoToPrompt} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                        <div className="mt-4 bg-yellow-100/70 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg">
                            <p className="font-bold">Demo Notice</p>
                            <p className="text-sm">Generating prompts from video requires heavy processing that is not suitable for a browser. This tool uses a placeholder response to demonstrate the UI and potential workflow.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:sticky md:top-24 h-fit">
                            <div className="glass-card p-6 rounded-lg space-y-4">
                                {preview ? (
                                    <div className="relative group">
                                        <video src={preview} controls className="w-full h-auto rounded-lg shadow-lg" />
                                        <button onClick={clearState} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-opacity duration-300 opacity-0 group-hover:opacity-100" title="Remove video">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <FileUpload onFilesSelect={handleFileSelect} accept="video/*" />
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={!videoFile || loading}
                                    title="Generate a text prompt from your video"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
                                >
                                    Generate Prompt
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>

                        <div>
                            {loading ? (
                                <ProcessingView
                                    title="Analyzing Your Video..."
                                    messages={[
                                        "Extracting keyframes...",
                                        "Analyzing motion and flow...",
                                        "Identifying stylistic elements...",
                                        "Crafting a cinematic prompt..."
                                    ]}
                                />
                            ) : (
                                prompt && <ResultCard title="Generated Prompt from Video" content={prompt} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoToPrompt;