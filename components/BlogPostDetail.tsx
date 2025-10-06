import React from 'react';
import { BlogPost } from '../types';

interface BlogPostDetailProps {
    post: BlogPost;
    onNavigate: (page: string) => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onNavigate }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 animate-fade-in">
            <button
                onClick={() => onNavigate('blog')}
                title="Return to the blog listing page"
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium mb-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Blog
            </button>

            <article>
                <header className="mb-8">
                    <p className="text-base font-semibold text-blue-600 uppercase tracking-wide">{post.category}</p>
                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl font-orbitron">{post.title}</h1>
                    <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                            <img className="h-12 w-12 rounded-full object-cover" src={post.authorAvatar} alt={post.author} />
                        </div>
                        <div className="ml-4">
                            <p className="text-base font-medium text-slate-900">{post.author}</p>
                            <p className="text-sm text-slate-500">{post.date}</p>
                        </div>
                    </div>
                </header>

                <div className="mb-8">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded-lg shadow-lg object-cover aspect-video" />
                </div>

                <div className="prose prose-lg lg:prose-xl max-w-none text-slate-600 leading-8">
                    {post.content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>
        </div>
    );
};

export default BlogPostDetail;