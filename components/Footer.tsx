import React from 'react';
import { ToolKey } from '../types';
import { Logo } from '../constants';

interface FooterProps {
    onNavigate: (pageKey: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    
    const socialLinks = [
        { name: 'WhatsApp', href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"><path fill="#25D366" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L0 24zm6.595-3.803c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg> },
        { name: 'Facebook', href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"><path fill="#1877F2" d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg> },
        { name: 'Twitter', href: '#', icon: <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true"><path fill="#1DA1F2" d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
        { name: 'LinkedIn', href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"><path fill="#0A66C2" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.408 2.495-5.026 4.5-5.026h.025v4.988h-2.5c-.832 0-1.5.734-1.5 1.5v6.937h4.484v-16h-4.984z"/></svg> },
        { name: 'GitHub', href: '#', icon: <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true"><path fill="#1a202c" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg> },
    ];
    
    return (
        <footer className="bg-workflow-pattern border-t border-slate-200/80 mt-12">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                     <button onClick={() => onNavigate(ToolKey.Home)} title="Go to Homepage" className="flex items-center gap-2 text-slate-800 text-xl font-bold font-orbitron">
                        <Logo />
                        Imaginex
                    </button>
                    <p className="mt-4 text-sm text-slate-600 max-w-md">
                        Your all-in-one AI creative studio. Generate stunning images, dynamic videos, unique avatars, and high-impact ads—powered by next-gen AI.
                    </p>
                     <div className="flex space-x-6 mt-6">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} title={`Follow us on ${link.name}`} className="text-slate-500 hover:text-primary transition-transform hover:scale-110">
                                <span className="sr-only">{link.name}</span>
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-500 text-center sm:text-left order-2 sm:order-1">
                        &copy; {new Date().getFullYear()} Imaginex. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 text-sm text-slate-500 order-1 sm:order-2">
                        <button onClick={() => onNavigate(ToolKey.PrivacyPolicy)} className="hover:text-primary transition-colors">Privacy Policy</button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => onNavigate(ToolKey.TermsAndConditions)} className="hover:text-primary transition-colors">Terms & Conditions</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;