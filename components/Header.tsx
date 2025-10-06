import React, { useState, useRef, useEffect } from 'react';
import { ToolKey } from '../types';
import { TOOLS, NAV_LINKS, Logo } from '../constants';

interface HeaderProps {
    onNavigate: (pageKey: string) => void; 
    activePageKey: string;
}

const ToolsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const BlogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const AboutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ContactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;

const navIcons: { [key: string]: React.ReactElement } = {
    'tools': <ToolsIcon />,
    [ToolKey.Blog]: <BlogIcon />,
    [ToolKey.About]: <AboutIcon />,
    [ToolKey.Contact]: <ContactIcon />,
};

const Header: React.FC<HeaderProps> = ({ onNavigate, activePageKey }) => {
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toolsMenuRef = useRef<HTMLDivElement>(null);

    const handleNavClick = (pageKey: string) => {
        onNavigate(pageKey);
        setIsToolsOpen(false);
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const linkBaseClasses = "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const linkInactiveClasses = "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50";
    const linkActiveClasses = "text-primary font-semibold";
    
    return (
        <header className="bg-white/60 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/80 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => handleNavClick(ToolKey.Home)} title="Go to Homepage" className="flex-shrink-0 flex items-center gap-2 text-slate-800 text-xl font-bold font-orbitron">
                            <Logo />
                            Imaginex
                        </button>
                    </div>
                    <div className="hidden md:flex items-center">
                        <nav className="ml-10 flex items-baseline space-x-4">
                            {NAV_LINKS.map(link => {
                                if (link.key === 'tools') {
                                    return (
                                        <div key={link.key} className="relative" ref={toolsMenuRef}>
                                            <button onClick={() => setIsToolsOpen(!isToolsOpen)} title="Explore available tools" className={`${linkBaseClasses} ${linkInactiveClasses}`}>
                                                <span className="text-primary">{navIcons[link.key]}</span>
                                                {link.name}
                                                <svg className={`w-4 h-4 ml-1 transform transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </button>
                                            {isToolsOpen && (
                                                <div className="absolute left-0 mt-2 w-[34rem] rounded-xl glass-card ring-1 ring-black ring-opacity-5 z-20 animate-fade-in-down shadow-2xl">
                                                    <div className="p-2 grid grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto">
                                                        {TOOLS.map((tool) => (
                                                            <button key={tool.key} onClick={() => handleNavClick(tool.key)} title={`Navigate to ${tool.name}`} className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activePageKey === tool.key ? 'text-primary bg-blue-100/50' : 'text-slate-700'} hover:bg-blue-100/50 hover:text-primary`}>
                                                                <span className="text-primary">{React.cloneElement(tool.icon, {className: 'w-5 h-5'})}</span>
                                                                <span>{tool.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                const isActive = activePageKey === link.key || (link.key === ToolKey.Blog && activePageKey.startsWith('blog'));
                                return (
                                    <button key={link.key} onClick={() => handleNavClick(link.key)} title={`Navigate to ${link.name}`} className={`${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`}>
                                        <span className="text-primary">{navIcons[link.key]}</span>
                                        {link.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" title="Open main menu" className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden glass-card border-t border-slate-200" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {TOOLS.map((tool) => (
                              <button key={tool.key} onClick={() => handleNavClick(tool.key)} title={`Navigate to ${tool.name}`} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${activePageKey === tool.key ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                                <span className="text-primary">{React.cloneElement(tool.icon, {className: 'w-5 h-5'})}</span>
                                {tool.name}
                              </button>
                         ))}
                         <hr className="border-slate-200 my-2" />
                         {NAV_LINKS.filter(l => l.key !== 'tools').map(link => {
                            const isActive = activePageKey === link.key || (link.key === ToolKey.Blog && activePageKey.startsWith('blog'));
                            return (
                                <button key={link.key} onClick={() => handleNavClick(link.key)} title={`Navigate to ${link.name}`} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                                    <span className="text-primary">{navIcons[link.key]}</span>
                                    {link.name}
                                </button>
                            );
                         })}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;