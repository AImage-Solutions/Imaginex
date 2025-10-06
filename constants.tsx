import React from 'react';
import { Tool, ToolKey, BlogPost } from './types';
import Home from './components/Home';
import CreativeCoPilot from './components/CreativeCoPilot';
import VisualDemographic from './components/VisualDemographic';
import ImageToVideo from './components/ImageToVideo';
import ThreeDUGCAd from './components/ThreeDUGCAd';
import ImageToAvatar from './components/ImageToAvatar';
import BatchImageToPrompt from './components/BatchImageToPrompt';
import AIDescribeImage from './components/AIDescribeImage';
import ImagePromptGenerator from './components/ImagePromptGenerator';
import AIImageGenerator from './components/AIImageGenerator';
import AIVideoGenerator from './components/AIVideoGenerator';
import ImageToImageGenerator from './components/ImageToImageGenerator';
import VideoPromptGenerator from './components/VideoPromptGenerator';
import ImageToVideoPrompt from './components/ImageToVideoPrompt';
import Inspiration from './components/Inspiration';
import AIProductPhotoshoot from './components/AIProductPhotoshoot';
import AIVideoScriptwriter from './components/AIVideoScriptwriter';
import VideoToPrompt from './components/VideoToPrompt';
import UGCAdsGenerator from './components/UGCAdsGenerator';
import CGIAdsGenerator from './components/CGIAdsGenerator';
import PromotionalAdsGenerator from './components/PromotionalAdsGenerator';
import AvatarGenerator from './components/AvatarGenerator';
import AvatarToUGC from './components/AvatarToUGC';
import AIVoiceoverGenerator from './components/AIVoiceoverGenerator';


export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className || "h-7 w-7"}>
      <defs>
        <linearGradient id="imaginex-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#60a5fa'}} />
          <stop offset="50%" style={{stopColor: '#a855f7'}} />
          <stop offset="100%" style={{stopColor: '#c4b5fd'}} />
        </linearGradient>
      </defs>
      <g>
        <path d="M 4,4 C 12,12 12,12 20,20" stroke="url(#imaginex-grad)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 4,20 C 12,12 12,12 20,4" stroke="url(#imaginex-grad)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
);


export const NAV_LINKS = [
    { key: 'tools', name: 'Tools' },
    { key: ToolKey.Blog, name: 'Blog' },
    { key: ToolKey.About, name: 'About' },
    { key: ToolKey.Contact, name: 'Contact' },
];

// --- ICONS ---
const IconWrapper = ({ children, className }: { children: React.ReactNode, className?: string}) => (
    <div className={className}>{children}</div>
);

// --- CATEGORY ICONS ---
const HomeIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg></IconWrapper>;
const ImageIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></IconWrapper>;
const VideoIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg></IconWrapper>;
const AdsIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 12h-3a7.5 7.5 0 000-12h3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 9a4.5 4.5 0 110 6h-3a4.5 4.5 0 010-6h3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6a7.5 7.5 0 100 12h3a7.5 7.5 0 000-12h-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 9a4.5 4.5 0 110 6h3a4.5 4.5 0 010-6h-3z" /></svg></IconWrapper>;
const AvatarIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></IconWrapper>;
const UtilityIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995a6.427 6.427 0 010 .255c0 .382.145.755.438.995l1.003.827c.48.398.587 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.645.87l-.213 1.281c-.09.543-.56.941-1.11.941h-2.593c-.55 0-1.02-.398-1.11-.941l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613.438-.995a6.427 6.427 0 010-.255c0-.382-.145-.755-.438-.995l-1.003-.827c-.48-.398-.587-1.03-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;

// --- TOOL ICONS ---
const ToolIcon = ({ d, className }: { d: string, className?: string}) => <IconWrapper className={className}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg></IconWrapper>;

const CreativeCoPilotIcon = (p:any) => <ToolIcon {...p} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />;
const ImagePromptGeneratorIcon = (p:any) => <ToolIcon {...p} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.455L12.75 18l1.197-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.197a3.375 3.375 0 002.455 2.455L20.25 18l-1.197.398a3.375 3.375 0 00-2.455 2.455z" />;
const AIImageGeneratorIcon = (p:any) => <ToolIcon {...p} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />;
const ImageToImageIcon = (p:any) => <ToolIcon {...p} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m-3.182 4.995v4.992m0 0h-4.992m4.992 0l-3.182-3.182a8.25 8.25 0 00-11.667 0l-3.181 3.181" />;
const BatchImagePromptIcon = (p:any) => <ToolIcon {...p} d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6H6.75V4.522c0-.572.46-1.033 1.033-1.033h8.398c.573 0 1.033.46 1.033 1.033V6.75h3.375c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125V7.125zM11.25 4.5v2.25h1.5V4.5h-1.5z" />;

const VideoPromptGeneratorIcon = (p:any) => <ToolIcon {...p} d="M9 17.25v1.007a3 3 0 01-.375.158l-2.036.814a.75.75 0 01-.84.058l-1.921-.96a.75.75 0 01-.36-1.039l.814-2.036a3 3 0 01.158-.375H5.25M9 17.25h1.5M15 17.25v1.007a3 3 0 00.375.158l2.036.814a.75.75 0 00.84.058l1.921-.96a.75.75 0 00.36-1.039l-.814-2.036a3 3 0 00-.158-.375H18.75M15 17.25h-1.5m-3 0h3M9.75 6.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.5 0zM11.25 6v3" />;
const AIVideoGeneratorIcon = (p:any) => <ToolIcon {...p} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
const ImageToVideoPromptIcon = (p:any) => <ToolIcon {...p} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-6 2.25h6M3.75 16.5h16.5c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125zM16.5 18.75h-9" />;
const VideoToPromptIcon = (p:any) => <ToolIcon {...p} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />;

const ProductPhotoshootIcon = (p:any) => <ToolIcon {...p} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />;
const ScriptwriterIcon = (p:any) => <ToolIcon {...p} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />;
const UGCAdsIcon = (p:any) => <ToolIcon {...p} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />;
const CGIAdsIcon = (p:any) => <ToolIcon {...p} d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M12 7.5V5.25m0 2.25l-2.25-1.313m0 0L8.25 7.5M12 7.5l2.25-1.313M6 16.125l-2.25-1.313M6 16.125l2.25-1.313M6 16.125V13.5m12-3l2.25-1.313M18 13.5l-2.25-1.313M18 13.5V16.125" />;
const PromotionalAdsIcon = (p:any) => <ToolIcon {...p} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;

const AvatarGeneratorIcon = (p:any) => <ToolIcon {...p} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />;
const AvatarToUGCIcon = (p:any) => <ToolIcon {...p} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />;

const InspirationIcon = (p:any) => <ToolIcon {...p} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-3.75 0M10.5 1.5L9 4.5h6L13.5 1.5h-3zm-3.75 6.375a12.064 12.064 0 017.5 0" />;
const AIDescribeImageIcon = (p:any) => <ToolIcon {...p} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />;
const AIVoiceoverGeneratorIcon = (p:any) => <ToolIcon {...p} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l9 7.5" />;
const ImageToPromptIcon = (p:any) => <ToolIcon {...p} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />;
const ThreeDUGCIcon = (p:any) => <ToolIcon {...p} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-3.74-2.72a3 3 0 00-4.682 2.72 9.094 9.094 0 003.74.48m-3.74-2.72c.283.006.566.009.85.009s.567-.003.85-.009m-1.7 0c.283.006.566.009.85.009s.567-.003.85-.009m-1.7 0c.283.006.566.009.85.009s.567-.003.85-.009M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />;

// FIX: Changed to store component types instead of elements to allow passing props like className.
export const CategoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
    Home: HomeIcon,
    Image: ImageIcon,
    Video: VideoIcon,
    Ads: AdsIcon,
    Avatars: AvatarIcon,
    Utility: UtilityIcon,
};

export const categories = ['All', 'Image', 'Video', 'Ads', 'Avatars', 'Utility'];

export const TOOLS: Tool[] = [
    // Image Suite
    { key: ToolKey.ImagePromptGenerator, name: "Image Prompt Generator", description: "Generate creative prompts from keywords or images.", icon: <ImagePromptGeneratorIcon />, component: ImagePromptGenerator, category: 'Image', gradient: 'from-blue-400 to-blue-600' },
    { key: ToolKey.AIImageGenerator, name: "AI Image Generator", description: "Create stunning images from text descriptions.", icon: <AIImageGeneratorIcon />, component: AIImageGenerator, category: 'Image', gradient: 'from-blue-500 to-purple-500' },
    { key: ToolKey.ImageToImageGenerator, name: "Image to Image Generator", description: "Modify existing images with AI-powered edits.", icon: <ImageToImageIcon />, component: ImageToImageGenerator, category: 'Image', gradient: 'from-purple-400 to-pink-500' },
    { key: ToolKey.BatchImageToPrompt, name: "Batch Image to Prompt", description: "Generate prompts for multiple images at once.", icon: <BatchImagePromptIcon />, component: BatchImageToPrompt, category: 'Image', gradient: 'from-sky-400 to-cyan-500', isNew: true },
    
    // Video Suite
    { key: ToolKey.VideoPromptGenerator, name: "Video Prompt Generator", description: "Craft cinematic prompts for video generation.", icon: <VideoPromptGeneratorIcon />, component: VideoPromptGenerator, category: 'Video', gradient: 'from-pink-500 to-rose-500' },
    { key: ToolKey.AIVideoGenerator, name: "AI Video Generator", description: "Generate short video clips from text or images.", icon: <AIVideoGeneratorIcon />, component: AIVideoGenerator, category: 'Video', gradient: 'from-rose-500 to-red-600' },
    { key: ToolKey.ImageToVideoPrompt, name: "Image to Video Prompt", description: "Create video prompts based on a static image.", icon: <ImageToVideoPromptIcon />, component: ImageToVideoPrompt, category: 'Video', gradient: 'from-red-500 to-orange-500' },
    { key: ToolKey.VideoToPrompt, name: "Video to Prompt", description: "Generate a descriptive prompt from a video clip.", icon: <VideoToPromptIcon />, component: VideoToPrompt, category: 'Video', gradient: 'from-orange-400 to-amber-500' },
    { key: ToolKey.ImageToVideo, name: "Image to Video", description: "Animate a static image with a motion prompt.", icon: <AIVideoGeneratorIcon />, component: ImageToVideo, category: 'Video', gradient: 'from-rose-400 to-red-500', isNew: true },
    
    // Ad Factory
    { key: ToolKey.AIProductPhotoshoot, name: "AI Product Photoshoot", description: "Create professional product photos in any setting.", icon: <ProductPhotoshootIcon />, component: AIProductPhotoshoot, category: 'Ads', gradient: 'from-green-400 to-teal-500' },
    { key: ToolKey.AIVideoScriptwriter, name: "AI Video Scriptwriter", description: "Generate engaging scripts for promotional videos.", icon: <ScriptwriterIcon />, component: AIVideoScriptwriter, category: 'Ads', gradient: 'from-teal-400 to-cyan-500' },
    { key: ToolKey.UGCAdsGenerator, name: "UGC Ads Generator", description: "Create authentic-style User-Generated Content scripts.", icon: <UGCAdsIcon />, component: UGCAdsGenerator, category: 'Ads', gradient: 'from-cyan-400 to-sky-500' },
    { key: ToolKey.CGIAdsGenerator, name: "CGI Ads Generator", description: "Generate scripts for visually stunning CGI ads.", icon: <CGIAdsIcon />, component: CGIAdsGenerator, category: 'Ads', gradient: 'from-sky-400 to-blue-500' },
    { key: ToolKey.PromotionalAdsGenerator, name: "Promotional Ads Generator", description: "Create professional promotional ad visuals.", icon: <PromotionalAdsIcon />, component: PromotionalAdsGenerator, category: 'Ads', gradient: 'from-indigo-400 to-blue-500' },
    { key: ToolKey.ThreeDUGCAd, name: "3D UGC Ad Generator", description: "UGC-style scripts with 3D animated visuals.", icon: <ThreeDUGCIcon />, component: ThreeDUGCAd, category: 'Ads', gradient: 'from-cyan-400 to-teal-500', isNew: true },

    // Avatar Studio
    { key: ToolKey.AvatarGenerator, name: "AI Avatar Generator", description: "Create unique digital avatars from text or images.", icon: <AvatarGeneratorIcon />, component: AvatarGenerator, category: 'Avatars', gradient: 'from-purple-500 to-indigo-600' },
    { key: ToolKey.AvatarToUGC, name: "Avatar to UGC", description: "Generate UGC scripts for your AI-generated avatar.", icon: <AvatarToUGCIcon />, component: AvatarToUGC, category: 'Avatars', gradient: 'from-indigo-500 to-blue-600' },
    { key: ToolKey.ImageToAvatar, name: "Image to Avatar", description: "Transform a photo into a unique digital avatar.", icon: <AvatarGeneratorIcon />, component: ImageToAvatar, category: 'Avatars', gradient: 'from-purple-400 to-indigo-500', isNew: true },

    // Utility
    { key: ToolKey.CreativeCoPilot, name: "Creative Co-Pilot", description: "Brainstorm ideas with a conversational AI partner.", icon: <CreativeCoPilotIcon />, component: CreativeCoPilot, category: 'Utility', gradient: 'from-amber-400 to-orange-500', isNew: true },
    { key: ToolKey.Inspiration, name: "Inspiration Gallery", description: "Browse AI-generated art for creative ideas.", icon: <InspirationIcon />, component: Inspiration, category: 'Utility', gradient: 'from-yellow-400 to-amber-500' },
    { key: ToolKey.AIDescribeImage, name: "AI Describe Image", description: "Get detailed narrative descriptions of any image.", icon: <AIDescribeImageIcon />, component: AIDescribeImage, category: 'Utility', gradient: 'from-lime-400 to-green-500' },
    { key: ToolKey.AIVoiceoverGenerator, name: "AI Voiceover Generator", description: "Convert any text into a realistic voiceover.", icon: <AIVoiceoverGeneratorIcon />, component: AIVoiceoverGenerator, category: 'Utility', gradient: 'from-emerald-400 to-teal-500' },
    { key: ToolKey.ImageToPrompt, name: "Image to Prompt", description: "Generate a text prompt from an existing image.", icon: <ImageToPromptIcon />, component: VisualDemographic, category: 'Utility', gradient: 'from-lime-500 to-green-600', isNew: true },
];

const genericAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' clip-rule='evenodd' /%3E%3C/svg%3E`;

export const blogPosts: BlogPost[] = [
    {
        slug: 'getting-started-with-ai-images',
        title: 'From Zero to Hero: Your First AI-Generated Image',
        category: 'Image Generation',
        imageUrl: 'https://picsum.photos/seed/blog1/1200/800',
        excerpt: 'Dive headfirst into the world of AI image generation. This guide will walk you through crafting your first prompt, understanding key parameters, and creating a stunning visual from just a few words.',
        content: 'Creating images with AI might seem like magic, but it\'s a skill you can learn. The heart of any great AI image is the prompt. Think of yourself as a director and the AI as your incredibly talented, literal-minded artist. You need to be specific.\n\nStart with the subject. Instead of "a cat," try "a fluffy ginger tabby cat." Then, add context: "sitting on a stack of old books." Now, let\'s define the style. Do you want "photorealistic," "Studio Ghibli anime style," or "a watercolor painting"? Each will produce a wildly different result. Finally, add lighting and mood. "Cinematic lighting, warm and cozy afternoon sun, nostalgic feeling." Put it all together, and you have a powerful prompt that gives the AI a clear vision to work with.',
        author: 'The Imaginex Team',
        authorAvatar: genericAvatar,
        date: 'October 24, 2024',
    },
    {
        slug: 'unlocking-video-creativity',
        title: 'Beyond the Static: A Guide to AI Video Generation',
        category: 'Video Generation',
        imageUrl: 'https://picsum.photos/seed/blog2/1200/800',
        excerpt: 'AI video is the next frontier. Learn how to craft prompts that create motion, tell a story, and produce cinematic results that were once only possible with a full production crew.',
        content: 'AI video generation takes prompting to the next level. You\'re not just describing a scene; you\'re describing motion and time. The key is to think in shots. Start with a "wide shot of a futuristic city skyline." Then, describe the action: "flying cars zip between towering skyscrapers."\n\nCamera movement is crucial. Add terms like "slow panning shot," "a drone shot flying upwards," or "a shaky handheld camera following a character." These instructions guide the AI on how to frame the action. Don\'t forget to include details about the mood, color grading ("a Blade Runner-inspired neon and blue color palette"), and even the weather ("light rain slicking the streets") to create a truly immersive video clip.',
        author: 'The Imaginex Team',
        authorAvatar: genericAvatar,
        date: 'October 22, 2024',
    },
    {
        slug: 'ugc-ads-that-convert',
        title: 'The Secret to Authentic Ads: Generating UGC Scripts with AI',
        category: 'Ad Creation',
        imageUrl: 'https://picsum.photos/seed/blog3/1200/800',
        excerpt: 'User-Generated Content (UGC) is king in modern marketing. Discover how to use AI to generate scripts that feel genuine, relatable, and drive conversions for your brand.',
        content: 'The power of User-Generated Content (UGC) lies in its authenticity. When using an AI to write a UGC script, the goal is to sound like a real person, not a corporation. Start by telling the AI about your product and its key benefit. For example: "Write a UGC-style ad for a new portable coffee maker that\'s perfect for camping."\n\nInstruct the AI on the tone: "The tone should be excited, friendly, and a little informal." You can even give the AI a persona: "The script should be from the perspective of an avid hiker who just tried the product for the first time." The AI will then generate a script with a natural-sounding hook, a demonstration of the product in a real-world setting, and a call-to-action that feels like a genuine recommendation from a friend.',
        author: 'The Imaginex Team',
        authorAvatar: genericAvatar,
        date: 'October 20, 2024',
    },
];