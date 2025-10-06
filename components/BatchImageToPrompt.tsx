import React, { useState } from 'react';
import { generatePromptFromImage } from '../services/geminiService';
import FileUpload from './shared/FileUpload';
import ResultCard from './shared/ResultCard';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import HowToUseGuide from './shared/HowToUseGuide';


const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload Multiple Images",
        description: "Select up to 5 images at once using the file dialog or by dragging and dropping."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate All Prompts",
        description: "Click the 'Generate Prompts' button to start processing all uploaded images in sequence."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
        title: "View & Copy Results",
        description: "Results for each image will appear below as they are completed. Copy the prompts you like."
    },
];

interface ImageResult {
    preview: string;
    prompt: string;
}

const BatchImageToPrompt: React.FC = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [results, setResults] = useState<ImageResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [progress, setProgress] = useState(0);

    const handleFileSelect = (files: File[]) => {
        const selectedFiles = files.slice(0, 5);
        setImageFiles(selectedFiles);
        setResults([]);
        setError('');
        setProgress(0);
        if (files.length > 5) {
            setError('You can select a maximum of 5 images.');
        }
    };

    const handleSubmit = async () => {
        if (imageFiles.length === 0) {
            setError('Please upload at least one image.');
            return;
        }
        if (imageFiles.length > 5) {
             setError('You can process a maximum of 5 images at a time.');
             return;
        }

        setLoading(true);
        setError('');
        setResults([]);
        setProgress(0);

        try {
            const newResults: ImageResult[] = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                setProgress(i + 1);
                const prompt = await generatePromptFromImage(file);
                const reader = new FileReader();
                const preview = await new Promise<string>(resolve => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
                newResults.push({ preview, prompt });
                setResults([...newResults]);
            }
        } catch (err) {
            setError('Failed to generate prompts. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.BatchImageToPrompt} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar: How to Use */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                {/* Main Content: Input and Output */}
                <div className="lg:col-span-8 xl:col-span-9">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Input Column */}
                        <div className="md:sticky md:top-24 h-fit">
                            <div className="glass-card p-6 rounded-lg space-y-4">
                                <FileUpload onFilesSelect={handleFileSelect} multiple accept="image/*" />
                                
                                {imageFiles.length > 0 && (
                                    <div className="pt-4">
                                        <h4 className="text-sm font-semibold text-slate-500 mb-2">Selected Files ({imageFiles.length}/5):</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {imageFiles.map((file, index) => (
                                                <div key={index} className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                                                    {file.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={imageFiles.length === 0 || loading}
                                    title="Generate a text prompt for each uploaded image"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            {`Processing ${progress} of ${imageFiles.length}...`}
                                        </>
                                    ) : (
                                        'Generate Prompts'
                                    )}
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>

                        {/* Output Column */}
                        <div className="space-y-6">
                            {loading && progress > 0 && (
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(progress / imageFiles.length) * 100}%` }}></div>
                                </div>
                            )}
                            
                            {results.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-800 font-orbitron">Results</h3>
                                    {results.map((result, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                            <div className="sm:col-span-1">
                                                <img src={result.preview} alt={`Result preview ${index + 1}`} className="rounded-lg shadow-md w-full" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <ResultCard title={`Prompt for Image ${index + 1}`} content={result.prompt} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchImageToPrompt;