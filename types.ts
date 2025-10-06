import React from 'react';

export enum ToolKey {
    Home = 'home',
    // Image Suite
    ImagePromptGenerator = 'image-prompt-generator',
    AIImageGenerator = 'ai-image-generator',
    ImageToImageGenerator = 'image-to-image-generator',
    BatchImageToPrompt = 'batch-image-to-prompt',
    
    // Video Suite
    VideoPromptGenerator = 'video-prompt-generator',
    AIVideoGenerator = 'ai-video-generator',
    ImageToVideoPrompt = 'image-to-video-prompt',
    VideoToPrompt = 'video-to-prompt',
    ImageToVideo = 'image-to-video', // NEW
    
    // Ad Factory
    AIProductPhotoshoot = 'ai-product-photoshoot',
    AIVideoScriptwriter = 'ai-video-scriptwriter',
    UGCAdsGenerator = 'ugc-ads-generator',
    CGIAdsGenerator = 'cgi-ads-generator',
    PromotionalAdsGenerator = 'promotional-ads-generator',
    ThreeDUGCAd = '3d-ugc-ad', // NEW

    // Avatar Studio
    AvatarGenerator = 'avatar-generator',
    AvatarToUGC = 'avatar-to-ugc',
    ImageToAvatar = 'image-to-avatar', // NEW

    // Utility
    CreativeCoPilot = 'creative-co-pilot',
    Inspiration = 'inspiration',
    AIDescribeImage = 'ai-describe-image',
    AIVoiceoverGenerator = 'ai-voiceover-generator',
    // FIX: Reverted 'VisualDemographic' to 'ImageToPrompt' to match functionality and fix compilation error.
    ImageToPrompt = 'image-to-prompt',


    // Pages
    PrivacyPolicy = 'privacy-policy',
    TermsAndConditions = 'terms-and-conditions',
    Blog = 'blog',
    About = 'about',
    Contact = 'contact',
}

export interface Tool {
    key: ToolKey;
    name: string;
    description: string;
    icon: React.ReactElement<{ className?: string }>;
    component: React.ComponentType<any>;
    category: 'Image' | 'Video' | 'Ads' | 'Avatars' | 'Utility';
    gradient: string;
    isNew?: boolean;
}

export interface BlogPost {
    slug: string;
    title: string;
    category: string;
    imageUrl: string;
    excerpt: string;
    content: string;
    author: string;
    authorAvatar: string;
    date: string;
}