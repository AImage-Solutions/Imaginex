import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ToolKey } from '../types';
import { TOOLS, CategoryIcons, categories } from '../constants';
import './Home.css';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface HomeProps {
    onNavigate: (toolKey: ToolKey | string) => void;
}

const NeuralNexus = ({ onNodeClick }: { onNodeClick: (id: string) => void }) => {
    const categoryNodes = categories.filter(c => c !== 'All');
    const nodePositions = [
        { top: '5%', left: '50%' },   // Image
        { top: '35%', left: '95%' },  // Video
        { top: '85%', left: '85%' },  // Ads
        { top: '85%', left: '15%' },  // Avatars
        { top: '35%', left: '5%' },   // Utility
    ];

    return (
        <div className="neural-nexus-container">
            <div className="nexus-core"></div>
            <div className="nexus-rotator">
                <svg className="nexus-lines" viewBox="0 0 400 400">
                    {nodePositions.map((pos, index) => (
                        <line key={index} x1="200" y1="200" x2={parseInt(pos.left) * 4} y2={parseInt(pos.top) * 4} />
                    ))}
                </svg>
                {categoryNodes.map((category, index) => {
                    const Icon = CategoryIcons[category];
                    return (
                        <button
                            key={category}
                            className={`nexus-node nexus-node-${category.toLowerCase()}`}
                            style={{ top: nodePositions[index].top, left: nodePositions[index].left }}
                            onClick={() => onNodeClick(`tools-${category}`)}
                            title={`Go to ${category} Suite`}
                        >
                            <div className="nexus-node-icon">
                                <Icon className='w-7 h-7' />
                            </div>
                            <span className="nexus-node-label">{category}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const recognitionRef = useRef<any>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const handleScrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredTools = useMemo(() => {
        if (!searchQuery.trim()) {
            return TOOLS;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return TOOLS.filter(tool => 
            tool.name.toLowerCase().includes(lowercasedQuery) ||
            tool.description.toLowerCase().includes(lowercasedQuery) ||
            tool.category.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery]);
    
    const handleToolNavigation = (key: ToolKey | string) => {
        setSearchQuery('');
        onNavigate(key);
    };
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                setIsListening(true);
                setSpeechError('');
            };
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    setSpeechError('Microphone access denied. Please allow microphone permissions in your browser settings to use voice search.');
                } else if (event.error === 'no-speech') {
                    setSpeechError('No speech was detected. Please try again.');
                } else {
                    setSpeechError('Speech recognition failed. Please try again.');
                }
                setIsListening(false);
            };
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
            };
            recognitionRef.current = recognition;
        }
    }, []);

    const handleMicClick = () => {
        setSpeechError('');
        if (!recognitionRef.current) {
            setSpeechError('Voice search is not supported by your browser.');
            return;
        }
        
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting speech recognition", e);
                setSpeechError("Could not start voice search. Ensure microphone is enabled.");
            }
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                // Keep search query to allow filtering
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toolsByCategory = useMemo(() => {
        const grouped: { [key: string]: typeof TOOLS } = {};
        TOOLS.forEach(tool => {
            if (!grouped[tool.category]) {
                grouped[tool.category] = [];
            }
            grouped[tool.category].push(tool);
        });
        return grouped;
    }, []);

    const categoryOrder = useMemo(() => {
        return categories.filter(c => c !== 'All' && c in toolsByCategory);
    }, [toolsByCategory]);
    
    const workflowIcons = {
        idea: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-3.75 0M10.5 1.5L9 4.5h6L13.5 1.5h-3zm-3.75 6.375a12.064 12.064 0 017.5 0" /></svg>,
        visuals: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" /></svg>,
        story: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>,
        video: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg>,
    };

    const tipsIcons = {
        prompt: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.455L12.75 18l1.197-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.197a3.375 3.375 0 002.455 2.455L20.25 18l-1.197.398a3.375 3.375 0 00-2.455 2.455z" /></svg>,
        iterate: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m-3.182 4.995v4.992m0 0h-4.992m4.992 0l-3.182-3.182a8.25 8.25 0 00-11.667 0l-3.181 3.181" /></svg>,
        combine: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
    };

    const isSearching = searchQuery.trim().length > 0;
    
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-neural-bg relative overflow-hidden pt-12 pb-12 -mx-4 sm:-mx-6 lg:-mx-8">
                 <div className="hero-particles"></div>
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 min-h-[450px]">
                    <div className="animate-fade-in-up text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter font-orbitron text-slate-900">
                           The <span className="hero-title-highlight">Evolution</span>
                            <br />
                            of Creativity.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-slate-600 mx-auto lg:mx-0">
                           Seamlessly generate studio-quality <strong className="hero-desc-highlight">images</strong>, cinematic <strong className="hero-desc-highlight">videos</strong>, and viral <strong className="hero-desc-highlight">ad campaigns</strong> from simple text prompts. Imaginex is the definitive AI co-pilot, integrating into and elevating your entire creative workflow.
                        </p>
                        <div className="mt-8 flex flex-col items-center lg:items-start">
                            <button onClick={() => handleScrollTo('tools')} title="Explore all tools" className="cta-button">
                                Explore The Toolkit
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 flex items-center justify-center pointer-events-none lg:pointer-events-auto">
                        <NeuralNexus onNodeClick={handleScrollTo} />
                    </div>
                 </div>
            </section>
            
            {/* Tools Grid Section */}
            <section id="tools" aria-labelledby="tools-heading" className="toolkit-section">
                <div className="toolkit-header-container">
                    <h2 id="tools-heading" className="section-heading">
                        Our Creative Toolkit
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                        All the power you need in one place. Explore our full suite of tools, organized by category.
                    </p>
                    <div className="mt-8 w-full max-w-2xl mx-auto" ref={searchContainerRef}>
                        <div className="hero-search-container">
                            <div className="hero-search-bar">
                                <svg xmlns="http://www.w3.org/2000/svg" className="hero-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input 
                                    type="text" 
                                    placeholder="Search for a tool..." 
                                    className="hero-search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <button onClick={handleMicClick} className={`mic-button ${isListening ? 'listening' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                </button>
                                <div className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                                    Search with voice
                                </div>
                            </div>
                        </div>
                        {speechError && (
                            <p className="text-red-500 text-xs mt-2 text-center">{speechError}</p>
                        )}
                    </div>
                </div>
                
                <div className="container mx-auto relative z-10 animate-fade-in-up">
                    {isSearching && (
                        filteredTools.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {filteredTools.map((tool) => (
                                    <div
                                        key={tool.key}
                                        onClick={() => handleToolNavigation(tool.key)}
                                        title={`Go to the ${tool.name} tool`}
                                        className="tool-card group"
                                    >
                                        {tool.isNew && <div className="new-tag">New</div>}
                                        <div className="flex items-center gap-4">
                                            <div className={`tool-card-icon bg-gradient-to-br ${tool.gradient}`}>
                                                {React.cloneElement(tool.icon, { className: 'h-8 w-8' })}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{tool.name}</h2>
                                                <p className="text-sm mt-1 text-slate-500">{tool.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="font-semibold text-xl text-slate-700">No tools found</p>
                                <p className="text-slate-500 mt-2">Try a different search term.</p>
                            </div>
                        )
                    )}
                    
                    {!isSearching && (
                        <div className="space-y-16">
                            {categoryOrder.map(category => {
                                const Icon = CategoryIcons[category];
                                return (
                                <div 
                                    key={category} 
                                    id={`tools-${category}`} 
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="p-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl text-primary shadow-sm">
                                            <Icon className="w-7 h-7" />
                                        </span>
                                        <h3 className="text-3xl font-bold font-orbitron text-slate-900">{category} Suite</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {toolsByCategory[category].map((tool, index) => (
                                            <div
                                                key={tool.key}
                                                onClick={() => onNavigate(tool.key)}
                                                title={`Go to the ${tool.name} tool`}
                                                className="tool-card group"
                                            >
                                                {tool.isNew && (
                                                    <div className="new-tag">
                                                        New
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <div className={`tool-card-icon bg-gradient-to-br ${tool.gradient}`}>
                                                        {React.cloneElement(tool.icon, { className: 'h-8 w-8' })}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{tool.name}</h2>
                                                        <p className="text-sm mt-1 text-slate-500">{tool.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <div className="section-separator"></div>
            
            {/* Workflow Section */}
            <section id="workflow" aria-labelledby="workflow-heading" className="pb-12 bg-workflow-pattern">
                <div className="text-center mb-12">
                    <h2 id="workflow-heading" className="section-heading">
                        From Idea to Masterpiece
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">Combine our tools to build amazing creative projects. Here’s how.</p>
                </div>
                <div className="workflow-container">
                    <div className="workflow-path">
                        <div className="workflow-step">
                            <div className="workflow-icon">{workflowIcons.idea}</div>
                            <h3 className="workflow-title">1. Spark an Idea</h3>
                            <p className="workflow-description">Use the <strong>Prompt Generator</strong> to brainstorm a unique concept.</p>
                        </div>
                        <div className="workflow-connector"></div>
                        <div className="workflow-step">
                            <div className="workflow-icon">{workflowIcons.visuals}</div>
                            <h3 className="workflow-title">2. Create Visuals</h3>
                            <p className="workflow-description">Bring your concept to life with the <strong>Image Generator</strong>.</p>
                        </div>
                        <div className="workflow-connector"></div>
                        <div className="workflow-step">
                            <div className="workflow-icon">{workflowIcons.story}</div>
                            <h3 className="workflow-title">3. Write the Story</h3>
                            <p className="workflow-description">Generate a script for your visual using the <strong>Video Scriptwriter</strong>.</p>
                        </div>
                        <div className="workflow-connector"></div>
                        <div className="workflow-step">
                            <div className="workflow-icon">{workflowIcons.video}</div>
                            <h3 className="workflow-title">4. Generate Video</h3>
                            <p className="workflow-description">Turn your image into a dynamic clip with the <strong>Video Generator</strong>.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="section-separator"></div>

            {/* Pro Tips Section */}
            <section id="tips" aria-labelledby="tips-heading" className="pb-12 bg-tips-pattern">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 id="tips-heading" className="section-heading">
                            Creator's Corner
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">Unlock the full potential of our AI with these pro tips.</p>
                    </div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="tip-card">
                            <div className="tip-icon">{tipsIcons.prompt}</div>
                            <h3 className="tip-title">Master the Prompt</h3>
                            <p className="tip-description">Detail is your best friend. Instead of "a dog", try "a golden retriever puppy with a red ball, playing in a sunny park, cinematic lighting". Specificity is key!</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-icon">{tipsIcons.iterate}</div>
                            <h3 className="tip-title">Iterate and Evolve</h3>
                            <p className="tip-description">Your first result is just the beginning. Use the <strong>Image-to-Image</strong> tool to refine your creation. Add elements, change styles, or perfect the composition.</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-icon">{tipsIcons.combine}</div>
                            <h3 className="tip-title">Combine Your Tools</h3>
                            <p className="tip-description">The magic happens when you connect workflows. Create an <strong>Avatar</strong>, write a <strong>UGC script</strong> for it, then generate a <strong>Voiceover</strong> to bring it to life.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;