import React from 'react';
import { blogPosts } from '../constants';

interface BlogProps {
    onNavigate: (pageKey: string) => void;
}

const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
    return (
        <div className="max-w-7xl mx-auto py-12">
            <div className="text-center mb-12 animate-fade-in-down">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl font-orbitron">The Imaginex Blog</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500">Insights, tutorials, and discussions on the future of AI creativity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <div 
                        key={post.slug}
                        onClick={() => onNavigate(`blog/${post.slug}`)}
                        className="glass-card rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
                        style={{ animation: `fade-in-up 0.5s ${index * 100}ms ease-out backwards` }}
                    >
                        <div className="overflow-hidden">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium text-blue-600">{post.category}</p>
                            <h2 className="mt-2 text-xl font-bold text-slate-800 transition-colors group-hover:text-blue-700">
                                {post.title}
                            </h2>
                            <p className="mt-3 text-base text-slate-600 h-24">{post.excerpt}</p>
                            <div className="mt-6 flex items-center">
                                <div className="flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full object-cover" src={post.authorAvatar} alt={post.author} />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-slate-900">{post.author}</p>
                                    <p className="text-sm text-slate-500">{post.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;