import React, { useState } from 'react';
import { generateImageFromImage } from '../services/geminiService';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';
import ProcessingView from './shared/ProcessingView';
import HowToUseGuide from './shared/HowToUseGuide';
import FileUpload from './shared/FileUpload';

const MAX_PROMPT_LENGTH = 1000;

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
        title: "Upload an Image",
        description: "Upload a photo of a person you want to turn into an avatar."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
        title: "Add a Style (Optional)",
        description: "Describe a style to apply, like 'cartoon', 'anime', or '3d character'."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Generate Avatar",
        description: "Generate the avatar image, then download or share your creation."
    },
];

const PRESET_STYLES = [ '3D Character', 'Anime', 'Cartoon', 'Pixel Art', 'Fantasy', 'Photorealistic' ];

const ImageToAvatar: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<string>('');
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
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
        setImage('');
        setError('');
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
        if (!imageFile) {
            setError('Please upload an image.');
            return;
        }

        setLoadingImage(true);
        setError('');
        setImage('');

        try {
            const result = await generateImageFromImage(imageFile, `turn the person in this image into a digital avatar. Style: ${prompt || 'realistic 3d character'}`);
            setImage(`data:image/jpeg;base64,${result.image}`);
        } catch (err) {
            setError('Failed to generate avatar image. Please try again.');
            console.error(err);
        } finally {
            setLoadingImage(false);
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

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.ImageToAvatar} />
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
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700">1. Upload Image</h3>
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
                                     <h3 className="text-lg font-semibold text-slate-700">2. Add Style (Optional)</h3>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={"Describe the style to apply (e.g., cartoon)"}
                                        className="w-full p-3 bg-white border border-slate-300 rounded-md"
                                        rows={3} maxLength={MAX_PROMPT_LENGTH}
                                    />
                                     <div>
                                        <p className="text-sm font-medium text-slate-600 mb-2">Or pick a style:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {PRESET_STYLES.map(style => (
                                                <button key={style} onClick={() => handleStyleClick(style)} className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100/70 rounded-full hover:bg-blue-200/70 transition-colors">
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleImageSubmit} disabled={loadingImage || !imageFile} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                                        {loadingImage ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Transforming...
                                            </>
                                        ) : (
                                            'Transform to Avatar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            {loadingImage ? <ProcessingView title="Generating Your Avatar..." messages={["Analyzing photo...", "Applying new style...", "Rendering final avatar..."]} previewUrl={preview ?? undefined} /> : (
                                image && (
                                    <div className="glass-card rounded-lg overflow-hidden space-y-4">
                                        <div className="p-6 pb-0">
                                            <h3 className="text-lg font-semibold text-blue-600">Generated Avatar</h3>
                                            <img src={image} alt="Generated Avatar" className="rounded-lg w-full mt-4"/>
                                        </div>
                                        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-end space-x-4">
                                            <button onClick={handleImageDownload} title="Download this avatar" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                            {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageToAvatar;