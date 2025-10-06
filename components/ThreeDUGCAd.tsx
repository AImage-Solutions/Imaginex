import React, { useState } from 'react';
import { generateAdScript } from '../services/geminiService';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';
import FileUpload from './shared/FileUpload';

const MAX_TOPIC_LENGTH = 300;

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload Product Image (Optional)",
        description: "Provide an image of your product to get a more specific script."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Enter Your Topic",
        description: "Describe the product or topic for your 3D User-Generated Content style ad."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate 3D UGC Script",
        description: "The AI will write a script that feels authentic but with a 3D animated visual style."
    },
];

interface Script {
    title: string;
    hook: string;
    scenes: { scene: number, visual: string, voiceover: string }[];
    cta: string;
}

const ThreeDUGCAd: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [script, setScript] = useState<Script | null>(null);
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
        if (!topic.trim()) {
            setError('Please enter a topic for your script.');
            return;
        }

        setLoading(true);
        setError('');
        setScript(null);

        try {
            const fullPrompt = `The product/topic is: "${topic}". The visual style for every scene must be described as a 3D animation, like a Pixar or Dreamworks movie, but the voiceover should maintain an authentic, casual, User-Generated Content (UGC) feel.`
            const generatedScript = await generateAdScript(fullPrompt, 'UGC', imageFile ?? undefined);
            setScript(generatedScript);
        } catch (err) {
            setError('Failed to generate script. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.ThreeDUGCAd} />
            
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
                                    <h3 className="text-lg font-medium text-slate-700 mb-2">Product Image (Optional)</h3>
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
                                <div className="relative">
                                     <h3 className="text-lg font-medium text-slate-700 mb-2">Product / Topic</h3>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., a new brand of eco-friendly sneakers"
                                        className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                        rows={4}
                                        maxLength={MAX_TOPIC_LENGTH}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                        {topic.length} / {MAX_TOPIC_LENGTH}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    title="Generate a 3D UGC ad script from your topic"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Script'
                                    )}
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>
                        
                        <div>
                            {loading ? (
                                <ProcessingView
                                    title="Writing Your 3D UGC Script..."
                                    messages={[ "Finding an authentic angle...", "Crafting a relatable hook...", "Writing 3D animated scenes...", "Adding a friendly call to action..." ]}
                                    previewUrl={preview ?? undefined}
                                />
                            ) : (
                                script && (
                                    <div className="glass-card rounded-lg shadow-lg p-6 animate-fade-in space-y-4">
                                        <h3 className="text-2xl font-bold text-blue-600 font-orbitron">{script.title}</h3>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">Hook:</h4>
                                            <p className="text-slate-600 italic">"{script.hook}"</p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-slate-800">Scenes:</h4>
                                            {script.scenes.map(s => (
                                                <div key={s.scene} className="border-l-4 border-blue-200 pl-4">
                                                    <p className="text-slate-700"><strong className="text-slate-900">Visual:</strong> {s.visual}</p>
                                                    <p className="text-slate-700"><strong className="text-slate-900">Voiceover:</strong> {s.voiceover}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">Call to Action:</h4>
                                            <p className="text-slate-600">{script.cta}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreeDUGCAd;