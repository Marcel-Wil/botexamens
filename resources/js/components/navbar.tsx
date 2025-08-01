import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export const Navbar = () => {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = auth?.user !== null;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleScroll = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 z-10 w-full bg-transparent shadow-lg backdrop-blur-lg">
            <div className="container flex justify-between items-center px-6 py-3 mx-auto">
                <a className="text-xl font-bold text-white" href="/">
                    RijexamenMeldingen
                </a>
                <div className="hidden items-center space-x-6 md:flex">
                    {isAuthenticated ? (
                        <>
                            <a className="text-white hover:text-gray-200" href="/dashboard">
                                Dashboard
                            </a>
                            <a className="text-white hover:text-gray-200" href="/contact">
                                Contact
                            </a>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.post('/logout');
                                }}
                                className="text-white cursor-pointer hover:text-gray-200"
                            >
                                Uitloggen
                            </button>
                        </>
                    ) : (
                        <>
                            <a className="text-white hover:text-gray-200" href="/login">
                                Inloggen
                            </a>
                            <a className="text-white hover:text-gray-200" href="/register">
                                Registreren
                            </a>
                            <a className="text-white hover:text-gray-200" href="/contact">
                                Contact
                            </a>
                        </>
                    )}
                </div>
                <div className="relative md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>

                    {isMobileMenuOpen && (
                        <div className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
                            {isAuthenticated ? (
                                <>
                                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Dashboard
                                    </a>
                                    <a href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Contact
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.post('/logout');
                                        }}
                                        className="block px-4 py-2 w-full text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                        Uitloggen
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Inloggen
                                    </a>
                                    <a href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Registreren
                                    </a>
                                    <a href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Contact
                                    </a>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
