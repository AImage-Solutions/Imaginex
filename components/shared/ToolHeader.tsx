import React from 'react';
import { TOOLS } from '../../constants';
import { ToolKey } from '../../types';

interface ToolHeaderProps {
    toolKey: ToolKey;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ toolKey }) => {
    const tool = TOOLS.find(t => t.key === toolKey);

    if (!tool) return null;

    return (
        <div className="text-center mb-12 animate-fade-in-down">
            <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-5 text-blue-600 shadow-lg shadow-blue-500/10">
                {React.cloneElement(tool.icon, { className: 'h-10 w-10' })}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl font-orbitron">{tool.name}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">{tool.description}</p>
        </div>
    );
};

export default ToolHeader;