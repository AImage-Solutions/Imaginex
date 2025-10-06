import React, { useState } from 'react';
import { generateImagePrompt, generateImagePromptFromTextAndImage } from '../services/geminiService';
import ResultCard from './shared/ResultCard';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';
import FileUpload from './shared/FileUpload';

const MAX_KEYWORDS_LENGTH = 300;

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload an Image (Optional)",
        description: "You can provide an image as inspiration for the prompt."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Enter Keywords",
        description: "Type in keywords or a theme. This is required if no image is uploaded."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Prompt",
        description: "The AI will use your inputs to create a detailed, creative prompt."
    },
];

const ImagePromptGenerator: React.FC = () => {
    const [keywords, setKeywords] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setPreview(null);
    };

    const handleSubmit = async () => {
        if (!keywords.trim() && !imageFile) {
            setError('Please enter some keywords or upload an image.');
            return;
        }

        setLoading(true);
        setError('');
        setPrompt('');

        try {
            let generatedPrompt;
            if (imageFile) {
                generatedPrompt = await generateImagePromptFromTextAndImage(keywords, imageFile);
            } else {
                generatedPrompt = await generateImagePrompt(keywords);
            }
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
            <ToolHeader toolKey={ToolKey.ImagePromptGenerator} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:sticky md:top-24 h-fit">
                             <div className="glass-card rounded-lg p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-700 mb-2">Image (Optional)</h3>
                                    {preview ? (
                                        <div className="relative group">
                                            <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                                            <button onClick={clearImage} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full" title="Remove image">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <FileUpload onFilesSelect={handleFileSelect} />
                                    )}
                                </div>
                                <div>
                                     <h3 className="text-lg font-medium text-slate-700 mb-2">Keywords</h3>
                                    <div className="relative">
                                        <textarea
                                            value={keywords}
                                            onChange={(e) => setKeywords(e.target.value)}
                                            placeholder="e.g., futuristic city, synthwave, neon"
                                            className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                            rows={3}
                                            maxLength={MAX_KEYWORDS_LENGTH}
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                            {keywords.length} / {MAX_KEYWORDS_LENGTH}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    title="Generate a detailed prompt"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400"
                                >
                                    Generate Prompt
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>
                        
                        <div>
                            {loading ? (
                                <ProcessingView
                                    title="Generating Creative Prompt..."
                                    messages={[ "Brainstorming concepts...", "Adding stylistic details...", "Refining lighting...", "Finalizing prompt..." ]}
                                    previewUrl={preview ?? undefined}
                                />
                            ) : (
                                prompt && <ResultCard title="Generated Image Prompt" content={prompt} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePromptGenerator;