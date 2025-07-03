import React from 'react';
import { useForm, Head } from '@inertiajs/react';

const Navbar = () => {
    // A simplified navbar for the contact page, or you can import your main one
    return (
        <nav className="bg-white/20 backdrop-blur-lg shadow-lg fixed w-full z-10 top-0">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a className="text-xl font-bold text-white" href="/">
                    FastTrack Examen Alerts
                </a>
                <div>
                    <a className="text-white hover:text-gray-200" href="/">Home</a>
                </div>
            </div>
        </nav>
    );
};

export default function ContactPage() {
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Contact Us" />
            <div className="font-sans text-gray-900 antialiased bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-400 min-h-screen">
                <Navbar />
                <main className="min-h-screen flex items-center justify-center pt-20">
                    <div className="w-full max-w-lg p-8 space-y-8 bg-white/30 backdrop-blur-xl rounded-xl shadow-lg">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold text-gray-900">Contact Us</h2>
                            <p className="mt-2 text-lg text-gray-800">Have a question? We'd love to hear from you.</p>
                        </div>

                        {wasSuccessful && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                                <p className="font-bold">Success!</p>
                                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="text-sm font-bold text-gray-800 block mb-2">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full p-3 bg-white/50 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-bold text-gray-800 block mb-2">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full p-3 bg-white/50 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="text-sm font-bold text-gray-800 block mb-2">Message</label>
                                <textarea
                                    id="message"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full p-3 h-32 bg-white/50 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    required
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                            >
                                {processing ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
