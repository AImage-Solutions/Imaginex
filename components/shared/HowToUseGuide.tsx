import React from 'react';

interface GuideStep {
    // FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
    icon: React.ReactElement;
    title: string;
    description: string;
}

interface HowToUseGuideProps {
    steps: GuideStep[];
}

const HowToUseGuide: React.FC<HowToUseGuideProps> = ({ steps }) => {
    return (
        <div className="glass-card p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4 font-orbitron">How to Use</h3>
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-blue-600 font-bold text-lg">
                           {step.icon}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">{step.title}</h4>
                            <p className="text-sm text-slate-600">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowToUseGuide;
