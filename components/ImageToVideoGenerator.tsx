import React, { useState } from 'react';
import { generateVideoFromImage, fetchGeneratedFile } from '../services/geminiService';
import FileUpload from './shared/FileUpload';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';

const loadingMessages = [
    "Analyzing your source image...",
    "Setting up the virtual cameras...",
    "Imagining motion from your prompt...",
    "Rendering the first few frames...",
    "This can take a few minutes, hang tight!",
    "Animating the scene...",
    "Adding special effects...",
    "Great things are worth waiting for...",
    "Finalizing the color grading...",
    "Almost there, just polishing the lens..."
];

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload a Starting Image",
        description: "Choose a base image that you want to bring to life."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Describe the Action",
        description: "Write a prompt describing the motion or scene you want to create from the image."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Video",
        description: "Click generate. Video creation takes a few minutes, so please be patient."
    }
];

const ImageToVideoGenerator: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setImageFile(file);
            setVideoUrl('');
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
            setError('Please upload an image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please enter a prompt to describe the video.');
            return;
        }

        setLoading(true);
        setError('');
        setVideoUrl('');

        try {
            const downloadUri = await generateVideoFromImage(imageFile, prompt);
            const videoBlob = await fetchGeneratedFile(downloadUri);
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
        } catch (err) {
            setError('Failed to generate video. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        const safeFileName = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'generated';
        link.download = `${safeFileName}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.AIVideoGenerator} />

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
                            <div className="glass-card rounded-lg p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-700 mb-2">1. Upload Starting Image</h3>
                                        {preview ? (
                                            <div className="relative group">
                                                <img src={preview} alt="Upload preview" className="rounded-lg w-full object-contain max-h-64 bg-slate-100" />
                                                <button onClick={() => { setPreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-opacity duration-300 opacity-0 group-hover:opacity-100" title="Remove image">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <FileUpload onFilesSelect={handleFileSelect} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-700 mb-2">2. Describe the Motion</h3>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="e.g., zoom out slowly, make the clouds move, a car drives by"
                                            className="w-full h-full min-h-[100px] p-3 bg-slate-50/70 border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!imageFile || !prompt || loading}
                                    title="Generate an animated video from your image and prompt"
                                    className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Video'
                                    )}
                                </button>
                                {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                            </div>
                        </div>
                        
                        {/* Output Column */}
                        <div>
                            {loading && (
                                <ProcessingView title="Generating Your Video..." messages={loadingMessages} previewUrl={preview!} />
                            )}
                            
                            {videoUrl && (
                                <div className="glass-card rounded-lg overflow-hidden animate-fade-in">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Generated Video</h3>
                                        <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg" />
                                    </div>
                                    <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-end space-x-3">
                                        <button onClick={handleDownload} title="Download the generated video" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageToVideoGenerator;