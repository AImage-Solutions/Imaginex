import React, { useState } from 'react';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';

const MAX_SCRIPT_LENGTH = 1500;

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Write Your Script",
        description: "Type or paste the text you want to convert into speech."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Voiceover",
        description: "Click the generate button to create the audio file."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l9 7.5" /></svg>,
        title: "Listen to the result",
        description: "Play the generated voiceover directly from your browser."
    },
];

const AIVoiceoverGenerator: React.FC = () => {
    const [script, setScript] = useState<string>('');
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async () => {
        if (!script.trim()) {
            setError('Please enter a script to generate a voiceover.');
            return;
        }
        if (!('speechSynthesis' in window)) {
            setError('Your browser does not support voice synthesis.');
            return;
        }

        setLoading(true);
        setError('');
        setIsGenerated(false);

        try {
            // Simulate generation time
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsGenerated(true);
        } catch (err) {
            setError('Failed to generate voiceover. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = () => {
        if (!script || !('speechSynthesis' in window)) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(script);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.AIVoiceoverGenerator} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar: How to Use */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24 space-y-4">
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
                                        value={script}
                                        onChange={(e) => setScript(e.target.value)}
                                        placeholder="Enter the text you want to convert to speech..."
                                        className="w-full p-3 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        rows={8}
                                        maxLength={MAX_SCRIPT_LENGTH}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                        {script.length} / {MAX_SCRIPT_LENGTH}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    title="Generate a voiceover from your script"
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    Generate Voiceover
                                </button>
                                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                            </div>
                        </div>
                        
                        {/* Output Column */}
                        <div>
                            {loading ? (
                                <ProcessingView
                                    title="Generating Voiceover..."
                                    messages={[
                                        "Warming up the vocal cords...",
                                        "Analyzing script tonality...",
                                        "Synthesizing speech...",
                                        "Finalizing audio output..."
                                    ]}
                                />
                            ) : (
                                isGenerated && (
                                    <div className="glass-card rounded-lg p-6 animate-fade-in space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Voiceover Ready</h3>
                                        <div className="bg-slate-100/50 p-4 rounded-md border border-slate-200">
                                            <p className="text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{script}</p>
                                        </div>
                                        <button 
                                            onClick={handlePlay}
                                            title="Play the generated voiceover"
                                            className="w-full mt-4 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                            Play Voiceover
                                        </button>
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

export default AIVoiceoverGenerator;