import React from 'react';

const About: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12 lg:p-16">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl font-orbitron animate-fade-in-down">
                            About Imaginex
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                           Welcome to Imaginex, the all-in-one creative suite designed to supercharge your imagination. We are at the forefront of the digital revolution, blending artistic vision with cutting-edge artificial intelligence. 
                        </p>
                         <p className="mt-4 text-lg text-slate-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                           Our mission is to empower creators, brands, and marketers by providing a powerful and intuitive toolkit that turns ideas into reality. We believe that creativity should be limitless, and our next-gen AI tools are built to break down technical barriers, making it effortless for anyone to produce studio-quality content.
                        </p>
                        
                        <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                             <h2 className="text-3xl font-bold tracking-tight text-blue-600 font-orbitron">
                                Our Vision
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                                We envision a future where anyone can be a creator. Imaginex is more than just a set of tools; it's a co-pilot for your creative journey. Whether you're generating stunning images, directing dynamic videos, or crafting the next viral ad campaign, we're here to help you bring your vision to life, faster and more beautifully than ever before.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-64 md:h-full overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-200 opacity-50"></div>
                         <svg className="absolute inset-0 w-full h-full text-white/20" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polygon points="0,100 100,0 100,100" />
                            <polygon points="0,0 0,100 100,0" opacity="0.5"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 bg-white/30 rounded-full animate-pulse backdrop-blur-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;