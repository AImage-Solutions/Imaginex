import React, { useState } from 'react';

interface ResultCardProps {
    title: string;
    content: string;
    imageUrl?: string;
    onDownload?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, imageUrl, onDownload }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleShare = async () => {
        const shareData: ShareData = {
            title: title,
            text: content,
        };

        if (imageUrl && navigator.canShare && navigator.canShare({ files: [] })) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'creative-nexus-image.png', { type: blob.type });
                shareData.files = [file];
            } catch (error) {
                console.error('Error fetching image for sharing:', error);
            }
        }
        
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };


    return (
        <div className="glass-card rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">{title}</h3>
                {imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <img src={imageUrl} alt="Generated content" className="w-full object-cover" />
                    </div>
                )}
                <div className="bg-slate-100/50 p-4 rounded-md border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{content}</p>
                </div>
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-end space-x-4">
                 <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
                    title="Copy to clipboard"
                >
                    {copied ? (
                         <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Copied
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            Copy
                        </>
                    )}
                </button>

                {navigator.share && (
                    <button onClick={handleShare} title="Share this result" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                       Share
                    </button>
                )}

                {onDownload && (
                     <button onClick={onDownload} title="Download the generated file" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResultCard;