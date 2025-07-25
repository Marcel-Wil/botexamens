import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';

export const Navbar = () => {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = auth?.user !== null;

    const handleScroll = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 z-10 w-full bg-transparent shadow-lg backdrop-blur-lg">
            <div className="container mx-auto flex items-center justify-between px-6 py-3">
                <a className="text-xl font-bold text-white" href="/">
                    FastTrack Examen Alerts
                </a>
                <div className="hidden items-center space-x-6 md:flex">
                    {/* <a className="text-white hover:text-gray-200" href="/" onClick={(e) => handleScroll(e, 'home')}>
                        Home
                    </a>
                    <a className="text-white hover:text-gray-200" onClick={(e) => handleScroll(e, 'pricing')}>
                        Prijzen
                    </a> */}

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
                                className="cursor-pointer text-white hover:text-gray-200"
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
                <div className="md:hidden">
                    <button className="text-white focus:outline-none">
                        <svg
                            className="h-6 w-6"
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
                </div>
            </div>
        </nav>
    );
};
