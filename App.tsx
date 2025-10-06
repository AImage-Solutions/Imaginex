

import React, { useState, useCallback, Suspense } from 'react';
import { ToolKey } from './types';
import { blogPosts } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/shared/Spinner';
import Home from './components/Home';

// Lazy load page components
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));
const Blog = React.lazy(() => import('./components/Blog'));
const BlogPostDetail = React.lazy(() => import('./components/BlogPostDetail'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./components/TermsAndConditions'));

// Lazy load tool components
const CreativeCoPilot = React.lazy(() => import('./components/CreativeCoPilot'));
const VisualDemographic = React.lazy(() => import('./components/VisualDemographic'));
const ImageToVideo = React.lazy(() => import('./components/ImageToVideo'));
const ThreeDUGCAd = React.lazy(() => import('./components/ThreeDUGCAd'));
const ImageToAvatar = React.lazy(() => import('./components/ImageToAvatar'));
const BatchImageToPrompt = React.lazy(() => import('./components/BatchImageToPrompt'));
const AIDescribeImage = React.lazy(() => import('./components/AIDescribeImage'));
const ImagePromptGenerator = React.lazy(() => import('./components/ImagePromptGenerator'));
const AIImageGenerator = React.lazy(() => import('./components/AIImageGenerator'));
const AIVideoGenerator = React.lazy(() => import('./components/AIVideoGenerator'));
const ImageToImageGenerator = React.lazy(() => import('./components/ImageToImageGenerator'));
const VideoPromptGenerator = React.lazy(() => import('./components/VideoPromptGenerator'));
const ImageToVideoPrompt = React.lazy(() => import('./components/ImageToVideoPrompt'));
const Inspiration = React.lazy(() => import('./components/Inspiration'));
const AIProductPhotoshoot = React.lazy(() => import('./components/AIProductPhotoshoot'));
const AIVideoScriptwriter = React.lazy(() => import('./components/AIVideoScriptwriter'));
const VideoToPrompt = React.lazy(() => import('./components/VideoToPrompt'));
const UGCAdsGenerator = React.lazy(() => import('./components/UGCAdsGenerator'));
const CGIAdsGenerator = React.lazy(() => import('./components/CGIAdsGenerator'));
const PromotionalAdsGenerator = React.lazy(() => import('./components/PromotionalAdsGenerator'));
const AvatarGenerator = React.lazy(() => import('./components/AvatarGenerator'));
const AvatarToUGC = React.lazy(() => import('./components/AvatarToUGC'));
const AIVoiceoverGenerator = React.lazy(() => import('./components/AIVoiceoverGenerator'));


// FIX: Changed type from React.FC to React.ComponentType to be compatible with React.lazy's return type.
const componentMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    [ToolKey.About]: About,
    [ToolKey.Contact]: Contact,
    [ToolKey.Blog]: Blog,
    [ToolKey.PrivacyPolicy]: PrivacyPolicy,
    [ToolKey.TermsAndConditions]: TermsAndConditions,
    
    // Image Suite
    [ToolKey.BatchImageToPrompt]: BatchImageToPrompt,
    [ToolKey.AIImageGenerator]: AIImageGenerator,
    [ToolKey.ImageToImageGenerator]: ImageToImageGenerator,
    [ToolKey.ImagePromptGenerator]: ImagePromptGenerator,

    // Video Suite
    [ToolKey.AIVideoGenerator]: AIVideoGenerator,
    [ToolKey.VideoPromptGenerator]: VideoPromptGenerator,
    [ToolKey.ImageToVideoPrompt]: ImageToVideoPrompt,
    [ToolKey.VideoToPrompt]: VideoToPrompt,
    [ToolKey.ImageToVideo]: ImageToVideo,
    
    // Ad Factory
    [ToolKey.AIProductPhotoshoot]: AIProductPhotoshoot,
    [ToolKey.AIVideoScriptwriter]: AIVideoScriptwriter,
    [ToolKey.UGCAdsGenerator]: UGCAdsGenerator,
    [ToolKey.CGIAdsGenerator]: CGIAdsGenerator,
    [ToolKey.PromotionalAdsGenerator]: PromotionalAdsGenerator,
    [ToolKey.ThreeDUGCAd]: ThreeDUGCAd,
    
    // Avatar Studio
    [ToolKey.AvatarGenerator]: AvatarGenerator,
    [ToolKey.AvatarToUGC]: AvatarToUGC,
    [ToolKey.ImageToAvatar]: ImageToAvatar,
    
    // Utility
    [ToolKey.CreativeCoPilot]: CreativeCoPilot,
    [ToolKey.AIDescribeImage]: AIDescribeImage,
    [ToolKey.Inspiration]: Inspiration,
    [ToolKey.AIVoiceoverGenerator]: AIVoiceoverGenerator,
    // FIX: Reverted 'VisualDemographic' to 'ImageToPrompt' to match the component's functionality.
    [ToolKey.ImageToPrompt]: VisualDemographic,
};

const App: React.FC = () => {
    const [activePage, setActivePage] = useState<string>(ToolKey.Home);

    const handleNavigate = useCallback((pageKey: string) => {
        setActivePage(pageKey);
        window.scrollTo(0, 0);
    }, []);
    
    const renderContent = () => {
        if (activePage.startsWith('blog/')) {
            const slug = activePage.substring(5);
            const post = blogPosts.find(p => p.slug === slug);
            if (post) {
                return <BlogPostDetail post={post} onNavigate={handleNavigate} />;
            }
        }
        
        const ActiveComponent = componentMap[activePage];
        if (ActiveComponent) {
            return <ActiveComponent onNavigate={handleNavigate} />;
        }
        
        return <Home onNavigate={handleNavigate} />;
    };

    return (
        <div className="min-h-screen text-slate-200 flex flex-col">
            <Header onNavigate={handleNavigate} activePageKey={activePage} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Suspense fallback={<div className="flex justify-center items-center h-96"><Spinner /></div>}>
                    {renderContent()}
                </Suspense>
            </main>
            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default App;