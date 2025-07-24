import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Navbar } from '@/components/navbar';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const { csrf } = usePage().props;
    
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('_token', csrf as string);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('message', formData.message);
            
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrf as string,
                },
                body: formDataToSend
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage({
                    text: data.message || 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
                    type: 'success'
                });
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error(data.message || 'Er is iets misgegaan. Probeer het later opnieuw.');
            }
        } catch (error) {
            setMessage({
                text: error instanceof Error ? error.message : 'Er is iets misgegaan. Probeer het later opnieuw.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Contact Us" />
            <div className="min-h-screen font-sans antialiased text-gray-200 bg-gradient-to-br from-black via-gray-900 to-purple-900">
                <Navbar />
                <main className="flex justify-center items-center px-4 pt-20 min-h-screen">
                    <div className="p-8 space-y-8 w-full max-w-lg rounded-xl border shadow-2xl backdrop-blur-lg bg-gray-800/50 border-gray-700/50">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold text-white">Neem contact met ons op</h2>
                            <p className="mt-2 text-lg text-gray-300">Heb je een vraag? We horen graag van je.</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-md border-l-4 ${
                                message.type === 'success' 
                                    ? 'text-green-700 bg-green-100 border-green-500' 
                                    : 'text-red-700 bg-red-100 border-red-500'
                            }`} role="alert">
                                <p className="font-bold">{message.type === 'success' ? 'Gelukt!' : 'Fout'}</p>
                                <p>{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6" id="contact-form">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Naam
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block p-2 mt-1 w-full text-white rounded-md border-gray-600 shadow-sm bg-gray-700/50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    required
                                />
                                {message.type === 'error' && message.text.includes('name') && (
                                    <p className="mt-1 text-sm text-red-400">{message.text}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block p-2 mt-1 w-full text-white rounded-md border-gray-600 shadow-sm bg-gray-700/50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    required
                                />
                                {message.type === 'error' && message.text.includes('email') && (
                                    <p className="mt-1 text-sm text-red-400">{message.text}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                                    Bericht
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="block p-2 mt-1 w-full text-white rounded-md border-gray-600 shadow-sm bg-gray-700/50 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                    required
                                ></textarea>
                                {message.type === 'error' && message.text.includes('message') && (
                                    <p className="mt-1 text-sm text-red-400">{message.text}</p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex justify-center px-4 py-3 w-full text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Versturen...' : 'Verstuur bericht'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContactPage;
