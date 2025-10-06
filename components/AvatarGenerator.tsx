import React, { useState } from 'react';
import { generateImage, generateImageFromImage } from '../services/geminiService';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';
import FileUpload from './shared/FileUpload';

const MAX_PROMPT_LENGTH = 1000;
const MAX_SCRIPT_LENGTH = 1000;

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload or Describe",
        description: "Upload an image to transform, or write a text description to create an avatar from scratch."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Add a Prompt or Style",
        description: "Describe your avatar or add a style to your uploaded image."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Image & Voice",
        description: "Generate the avatar image, then provide text to generate its voiceover."
    },
];

const PRESET_STYLES = [
    '3D Character',
    'Anime',
    'Cartoon',
    'Pixel Art',
    'Fantasy',
    'Photorealistic',
];

const AvatarGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [script, setScript] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<string>('');
    const [isVoiceGenerated, setIsVoiceGenerated] = useState<boolean>(false);
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
    const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
    const [imageError, setImageError] = useState<string>('');
    const [audioError, setAudioError] = useState<string>('');
    
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

    const handleStyleClick = (style: string) => {
        setPrompt(prev => {
            const newPrompt = prev.trim();
            if (newPrompt.toLowerCase().includes(style.toLowerCase())) return newPrompt;
            const separator = newPrompt && !newPrompt.endsWith(',') ? ', ' : ' ';
            return `${newPrompt}${separator}${style}`;
        });
    };

    const handleImageSubmit = async () => {
        if (!prompt.trim() && !imageFile) {
            setImageError('Please describe the avatar or upload an image.');
            return;
        }

        setLoadingImage(true);
        setImageError('');
        setAudioError('');
        setImage('');
        setIsVoiceGenerated(false);
        setScript('');

        try {
            if (imageFile) {
                const result = await generateImageFromImage(imageFile, `turn the person in this image into a digital avatar. Style: ${prompt || 'realistic 3d character'}`);
                setImage(`data:image/jpeg;base64,${result.image}`);
            } else {
                const avatarPrompt = `close-up portrait of a digital avatar, ${prompt}, high detail, character concept art`;
                const base64Image = await generateImage(avatarPrompt);
                setImage(`data:image/jpeg;base64,${base64Image}`);
            }
        } catch (err) {
            setImageError('Failed to generate avatar image. Please try again.');
            console.error(err);
        } finally {
            setLoadingImage(false);
        }
    };
    
    const handleAudioSubmit = async () => {
        if (!script.trim()) {
            setAudioError('Please enter a script for the voiceover.');
            return;
        }
        if (!('speechSynthesis' in window)) {
            setAudioError('Your browser does not support voice synthesis.');
            return;
        }

        setLoadingAudio(true);
        setAudioError('');
        setIsVoiceGenerated(false);

        try {
            // Simulate generation time
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsVoiceGenerated(true);
        } catch (err) {
            setAudioError('Failed to generate voiceover. Please try again.');
            console.error(err);
        } finally {
            setLoadingAudio(false);
        }
    };
    
    const handleImageDownload = () => {
        if (!image) return;
        const link = document.createElement('a');
        link.href = image;
        const safeFileName = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'generated-avatar';
        link.download = `${safeFileName}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePlayVoice = () => {
        if (!script || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(script);
        window.speechSynthesis.speak(utterance);
    };

    const handleShareImage = async () => {
        if (!image) {
            setImageError('No image to share.');
            return;
        }
        if (!navigator.share) {
            setImageError('Sharing is not supported on this browser.');
            return;
        }
        
        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], 'imaginex-avatar.jpg', { type: 'image/jpeg' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ 
                    title: 'AI Generated Avatar from Imaginex', 
                    text: `Check out this avatar! Prompt: "${prompt}"`, 
                    files: [file] 
                });
            } else {
                setImageError('Sharing files is not supported on this browser.');
            }
        } catch (error) {
             if ((error as DOMException).name !== 'AbortError') {
                setImageError('Sharing failed. Please try downloading the file instead.');
            }
        }
    };

    const btnClasses = "w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400";

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.AvatarGenerator} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:sticky md:top-24 h-fit">
                             <div className="glass-card rounded-lg p-6 space-y-6">
                                {/* --- STEP 1: IMAGE --- */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold font-orbitron text-slate-800">Step 1: Create Avatar Visual</h3>
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
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={imageFile ? "Describe the style to apply (e.g., cartoon)" : "Describe your avatar from scratch..."}
                                        className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                        rows={3} maxLength={MAX_PROMPT_LENGTH}
                                    />
                                     <div>
                                        <p className="text-sm font-medium text-slate-600 mb-2">Or add a style:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {PRESET_STYLES.map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => handleStyleClick(style)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100/70 rounded-full hover:bg-blue-200/70 transition-colors"
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleImageSubmit} disabled={loadingImage} className={btnClasses}>
                                        {loadingImage ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating...
                                            </>
                                        ) : (imageFile ? 'Transform Avatar' : 'Generate Avatar')}
                                    </button>
                                     {imageError && <p className="text-red-500 text-center text-sm">{imageError}</p>}
                                </div>

                                {/* --- STEP 2: VOICE (Conditional) --- */}
                                {image && (
                                    <div className="space-y-4 pt-6 border-t border-slate-200/80 animate-fade-in">
                                        <h3 className="text-xl font-bold font-orbitron text-slate-800">Step 2: Give it a Voice</h3>
                                        <textarea
                                            value={script}
                                            onChange={(e) => setScript(e.target.value)}
                                            placeholder="Enter text for your avatar to speak..."
                                            className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                            rows={4} maxLength={MAX_SCRIPT_LENGTH}
                                        />
                                        <button onClick={handleAudioSubmit} disabled={loadingAudio} className={btnClasses}>
                                            {loadingAudio ? 'Generating...' : 'Generate Voiceover'}
                                        </button>
                                        {audioError && <p className="text-red-500 text-center text-sm">{audioError}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            {loadingImage ? <ProcessingView title="Generating Your Avatar..." messages={["Sketching concept...", "Adding colors...", "Rendering final image..."]} previewUrl={preview ?? undefined} /> : (
                                image && (
                                    <div className="glass-card rounded-lg overflow-hidden space-y-4">
                                        <div className="p-6 pb-0">
                                            <h3 className="text-lg font-semibold text-blue-600">Generated Avatar</h3>
                                            <img src={image} alt="Generated Avatar" className="rounded-lg w-full mt-4"/>
                                        </div>
                                        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-end space-x-4">
                                            {navigator.share && (
                                                <button 
                                                    onClick={handleShareImage}
                                                    title="Share this avatar" 
                                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                                                    Share
                                                </button>
                                            )}
                                            <button onClick={handleImageDownload} title="Download this avatar" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Download
                                            </button>
                                        </div>
                                        {loadingAudio && <div className="p-6"><ProcessingView title="Generating Voice..." messages={["Analyzing script...", "Synthesizing audio...", "Preparing playback..."]} /></div>}
                                        {isVoiceGenerated && (
                                            <div className="p-6 pt-2 animate-fade-in">
                                                <h4 className="font-semibold text-slate-700 mb-2">Voiceover Ready</h4>
                                                <div className="bg-slate-100/50 p-3 rounded-md border border-slate-200 mb-3">
                                                    <p className="text-slate-600 text-sm">{script}</p>
                                                </div>
                                                <button 
                                                    onClick={handlePlayVoice}
                                                    title="Play the generated voiceover"
                                                    className="w-full mt-2 inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                    Play Voiceover
                                                </button>
                                            </div>
                                        )}
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
export default AvatarGenerator;