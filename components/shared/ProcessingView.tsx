import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';

interface ProcessingViewProps {
    title?: string;
    messages: string[];
    previewUrl?: string;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ 
    title = "AI is thinking...", 
    messages,
    previewUrl
}) => {
    const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 3000);
        intervalRef.current = id;

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [messages]);

    return (
        <div className="mt-8 animate-fade-in">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden glass-card p-6 flex flex-col justify-center items-center">
                {previewUrl && (
                    <img 
                        src={previewUrl} 
                        alt="Processing preview" 
                        className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110" 
                    />
                )}
                <div className="absolute inset-0 bg-white/50"></div>
                <div className="relative z-10 text-center space-y-4">
                    <Spinner />
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-blue-700 animate-pulse transition-all duration-500">{currentMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default ProcessingView;