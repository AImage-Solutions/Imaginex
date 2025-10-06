import React from 'react';

const socialLinks = [
    { name: 'Facebook', href: '#', icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg> },
    { name: 'Instagram', href: '#', icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg> },
    { name: 'LinkedIn', href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.408 2.495-5.026 4.5-5.026h.025v4.988h-2.5c-.832 0-1.5.734-1.5 1.5v6.937h4.484v-16h-4.984z"/></svg> },
    { name: 'Twitter', href: '#', icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
];
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L0 24zm6.595-3.803c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>;


const Contact: React.FC = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto glass-card rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Form Section */}
                    <div className="p-8 md:p-12 lg:p-16">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-orbitron">Contact Us</h2>
                        <p className="mt-2 text-lg text-slate-500">Let's Start a Conversation</p>
                        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                <div>
                                    <label htmlFor="name" className="sr-only">Name</label>
                                    <input type="text" name="name" id="name" className="block w-full shadow-sm py-3 px-4 placeholder-slate-400 border-slate-300 rounded-md bg-white/70 focus:ring-blue-500 focus:border-blue-500" placeholder="Name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input type="email" name="email" id="email" className="block w-full shadow-sm py-3 px-4 placeholder-slate-400 border-slate-300 rounded-md bg-white/70 focus:ring-blue-500 focus:border-blue-500" placeholder="Email" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="sr-only">Phone</label>
                                    <input type="text" name="phone" id="phone" className="block w-full shadow-sm py-3 px-4 placeholder-slate-400 border-slate-300 rounded-md bg-white/70 focus:ring-blue-500 focus:border-blue-500" placeholder="Phone" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="subject" className="sr-only">Subject</label>
                                    <input type="text" name="subject" id="subject" className="block w-full shadow-sm py-3 px-4 placeholder-slate-400 border-slate-300 rounded-md bg-white/70 focus:ring-blue-500 focus:border-blue-500" placeholder="Subject" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="sr-only">Message</label>
                                    <textarea id="message" name="message" rows={4} className="block w-full shadow-sm py-3 px-4 placeholder-slate-400 border-slate-300 rounded-md bg-white/70 focus:ring-blue-500 focus:border-blue-500" placeholder="Message"></textarea>
                                </div>
                            </div>
                            <div>
                                <button type="submit" title="Submit your message" className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">Send Message</button>
                            </div>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="p-8 md:p-12 lg:p-16 bg-slate-50/50">
                        <h3 className="text-2xl font-bold text-slate-800">Contact Information</h3>
                        <div className="mt-6 space-y-6 text-slate-600">
                             <div>
                                <h4 className="font-semibold text-slate-900">The Imaginex Team</h4>
                            </div>
                            <div>
                                <p className="font-semibold">Support & General Inquiries:</p>
                                <a href="mailto:contact@imaginex.com" className="hover:text-blue-600">contact@imaginex.com</a>
                            </div>
                            <div>
                                <p className="font-semibold">Phone:</p>
                                <a href="tel:+1-555-123-4567" className="hover:text-blue-600">+1 (555) 123-4567</a>
                            </div>
                            <div>
                                <p className="font-semibold">Address:</p>
                                <p>123 Creative Lane, Tech City, 90210</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-slate-800">Office Hours</h4>
                            <p className="mt-1 text-slate-600">9am to 5pm, Monday to Friday</p>
                            <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" title="Start a chat with us on WhatsApp" className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors">
                                <WhatsAppIcon />
                                Chat on WhatsApp
                            </a>
                        </div>
                        <div className="mt-8 flex justify-center space-x-6">
                            {socialLinks.map((link) => (
                                <a key={link.name} href={link.href} title={`Find us on ${link.name}`} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="sr-only">{link.name}</span>
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;