import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from "@google/genai";
import { ToolKey } from '../types';
import ToolHeader from './shared/ToolHeader';
import HowToUseGuide from './shared/HowToUseGuide';

// --- Audio Encoding/Decoding Helpers ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const guideSteps = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
        title: "Start the Conversation",
        description: "Click the 'Start Session' button and allow microphone access to begin talking with your AI co-pilot."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        title: "Brainstorm Ideas",
        description: "Talk to the AI to brainstorm ideas, refine concepts, and build the perfect prompt for an image or video."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: "Use Your Prompt",
        description: "When you're happy with a prompt, click the 'Use This Prompt' button to take it to the right generator."
    },
];

type TranscriptEntry = {
    speaker: 'You' | 'AI';
    text: string;
    isFinal: boolean;
};

const CreativeCoPilot: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [error, setError] = useState('');

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextRefs = useRef<{ input: AudioContext | null, output: AudioContext | null }>({ input: null, output: null });
    const audioStreamRef = useRef<MediaStream | null>(null);
    const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const audioSources = useRef(new Set<AudioBufferSourceNode>()).current;
    const nextStartTime = useRef(0);

    const stopSession = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (audioProcessorRef.current) {
            audioProcessorRef.current.disconnect();
            audioProcessorRef.current = null;
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
            audioStreamRef.current = null;
        }
        audioSources.forEach(source => source.stop());
        audioSources.clear();
        setStatus('idle');
    }, [audioSources]);
    
    useEffect(() => {
        return () => stopSession();
    }, [stopSession]);
    
    const startSession = async () => {
        setStatus('connecting');
        setError('');
        setTranscript([]);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            if (!audioContextRefs.current.input) {
                audioContextRefs.current.input = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            }
            if (!audioContextRefs.current.output) {
                audioContextRefs.current.output = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const inputAudioContext = audioContextRefs.current.input;
            const outputAudioContext = audioContextRefs.current.output;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(d => d * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                        audioProcessorRef.current = scriptProcessor;
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            const { text, isFinal } = message.serverContent.inputTranscription;
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.speaker === 'You' && !last.isFinal) {
                                    const newTranscript = [...prev];
                                    newTranscript[prev.length - 1] = { ...last, text, isFinal };
                                    return newTranscript;
                                }
                                return [...prev, { speaker: 'You', text, isFinal }];
                            });
                        }
                        if (message.serverContent?.outputTranscription) {
                            const { text, isFinal } = message.serverContent.outputTranscription;
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.speaker === 'AI' && !last.isFinal) {
                                    const newTranscript = [...prev];
                                    newTranscript[prev.length - 1] = { ...last, text, isFinal };
                                    return newTranscript;
                                }
                                return [...prev, { speaker: 'AI', text, isFinal }];
                            });
                        }

                        // Handle audio playback
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (audioData) {
                            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.destination);
                            source.addEventListener('ended', () => audioSources.delete(source));
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            audioSources.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error', e);
                        setError('A connection error occurred. Please try again.');
                        stopSession();
                    },
                    onclose: () => {
                         console.log('Session closed');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are a creative co-pilot. Your goal is to help users brainstorm and refine ideas into detailed prompts for generating images and videos. Be encouraging and imaginative. Keep your spoken responses concise.',
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err) {
            console.error('Failed to start session', err);
            let errorMessage = 'Could not access microphone. Please try again.';
            if (err instanceof DOMException) {
                switch (err.name) {
                    case 'NotFoundError':
                    case 'DevicesNotFoundError':
                        errorMessage = 'No microphone found. Please ensure a microphone is connected and enabled.';
                        break;
                    case 'NotAllowedError':
                    case 'PermissionDeniedError':
                        errorMessage = 'Microphone access was denied. Please allow microphone permissions in your browser settings and try again.';
                        break;
                    case 'NotReadableError':
                    case 'TrackStartError':
                         errorMessage = 'Your microphone might be in use by another application. Please close it and try again.';
                        break;
                    default:
                        errorMessage = `An unexpected error occurred: ${err.message}. Please check your microphone connection and permissions.`;
                        break;
                }
            } else {
                 errorMessage = 'An unknown error occurred while trying to access the microphone.';
            }
            setError(errorMessage);
            setStatus('error');
        }
    };
    
    const StatusIndicator = () => {
        switch (status) {
            case 'connecting': return <p className="text-sm text-slate-500">Connecting...</p>;
            case 'connected': return <p className="text-sm text-green-600 font-semibold">Connected</p>;
            case 'error': return <p className="text-sm text-red-600 font-semibold">Error</p>;
            default: return <p className="text-sm text-slate-500">Ready to start</p>;
        }
    };
    
    const CoPilotButton = () => {
        const isBusy = status === 'connecting';
        const isConnected = status === 'connected';
        return (
             <button
                onClick={isConnected ? stopSession : startSession}
                disabled={isBusy}
                className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 flex items-center justify-center
                    ${isConnected ? 'border-red-500 bg-red-100/50' : 'border-blue-500 bg-blue-100/50'}
                    ${isBusy ? 'cursor-not-allowed' : ''}`}
                title={isConnected ? "End Session" : "Start Session"}
            >
                <div className={`absolute inset-0 rounded-full ${isConnected ? 'animate-pulse-red' : 'animate-pulse-blue'}`}></div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 transition-colors ${isConnected ? 'text-red-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
        )
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.CreativeCoPilot} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                 <div className="lg:col-span-4 xl:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <HowToUseGuide steps={guideSteps} />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="glass-card rounded-lg p-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <CoPilotButton />
                            <StatusIndicator />
                            {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
                        </div>

                        <div className="mt-8 h-96 bg-slate-100/50 rounded-lg p-4 overflow-y-auto space-y-4">
                            {transcript.length === 0 && (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <p>Conversation transcript will appear here...</p>
                                </div>
                            )}
                            {transcript.map((entry, index) => (
                                <div key={index} className={`flex ${entry.speaker === 'You' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${entry.speaker === 'You' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        <p style={{ opacity: entry.isFinal ? 1 : 0.7 }}>{entry.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreativeCoPilot;