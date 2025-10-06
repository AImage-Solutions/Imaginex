import React, { useState } from 'react';
import ToolHeader from './shared/ToolHeader';
import { ToolKey } from '../types';

interface InspirationItem {
    imageUrl: string;
    prompt: string;
}

const inspirationData: InspirationItem[] = [
    { imageUrl: 'https://picsum.photos/seed/spacecat/800/600', prompt: 'A photorealistic portrait of a cat in an astronaut suit, floating in the cosmic nebula, vibrant colors, detailed helmet reflection, 8k' },
    { imageUrl: 'https://picsum.photos/seed/futurecity/800/1200', prompt: 'Synthwave futuristic city at night, neon lights reflecting on wet streets, flying cars, towering holographic ads, cinematic lighting, Blade Runner aesthetic' },
    { imageUrl: 'https://picsum.photos/seed/magicforest/800/600', prompt: 'Enchanted forest with glowing mushrooms and a mystical deer, ethereal light beams filtering through the canopy, fantasy art, hyper-detailed, magical atmosphere' },
    { imageUrl: 'https://picsum.photos/seed/steampunk/800/800', prompt: 'Steampunk inventor in a cluttered workshop filled with gears and brass contraptions, intricate details, warm vintage lighting, detailed character design' },
    { imageUrl: 'https://picsum.photos/seed/underwater/800/1000', prompt: 'A serene underwater kingdom with bioluminescent coral reefs and ancient ruins, schools of glowing fish, majestic whale swimming by, digital painting' },
    { imageUrl: 'https://picsum.photos/seed/dragon/800/600', prompt: 'A majestic dragon perched atop a snowy mountain peak at sunrise, volumetric clouds, epic scale, lens flare, fantasy concept art' },
];

const Inspiration: React.FC = () => {
    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setCopiedPrompt(prompt);
        setTimeout(() => setCopiedPrompt(null), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ToolHeader toolKey={ToolKey.Inspiration} />

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {inspirationData.map((item, index) => (
                    <div key={index} className="break-inside-avoid group relative overflow-hidden rounded-lg glass-card shadow-lg">
                        <img src={item.imageUrl} alt={item.prompt} className="w-full h-auto transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                            <p className="text-sm text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.prompt}</p>
                            <button
                                onClick={() => handleCopy(item.prompt)}
                                title="Copy this prompt to your clipboard"
                                className="self-start mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                            >
                                {copiedPrompt === item.prompt ? 'Copied!' : 'Copy Prompt'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inspiration;