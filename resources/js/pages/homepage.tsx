import React from 'react';
import { Head } from '@inertiajs/react';

// You can create a dedicated component for this
const Navbar = () => {
    const handleScroll = () => {
        const target = document.getElementById("pricing");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <nav className="fixed top-0 z-10 w-full bg-transparent shadow-lg backdrop-blur-lg">
            <div className="container flex justify-between items-center px-6 py-3 mx-auto">
                <a className="text-xl font-bold text-white" href="#">
                    FastTrack Examen Alerts
                </a>
                <div className="hidden items-center space-x-6 md:flex">
                    <a className="text-white hover:text-gray-200" href="#home">Home</a>
                    <a className="text-white hover:text-gray-200" onClick={handleScroll}>Pricing</a>
                    <a className="text-white hover:text-gray-200" href="#">About</a>
                    <a className="text-white hover:text-gray-200" href="#">Contact</a>
                </div>
                <div className="md:hidden">
                    <button className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

// Hero Section
const HeroSection = () => {
    const handleScroll = () => {
        const target = document.getElementById("pricing");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <section id="home" className="flex overflow-hidden relative justify-center items-center pt-16 min-h-screen">
            {/* Animated shapes */}
            <div className="absolute top-0 left-0 z-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-white rounded-full opacity-20 animate-float"></div>
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white rounded-lg opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-white rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute right-1/3 bottom-1/2 w-20 h-20 bg-white rounded-lg opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-extrabold text-gray-900">
                    Welkom bij FastTrack Examen Alerts
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Mis nooit meer een examendatum. Krijg direct een melding zodra er een plek vrijkomt.
                </p>
                <a
                    onClick={handleScroll}
                    className="inline-block px-8 py-3 mt-8 font-bold text-white bg-indigo-600 rounded-lg transition duration-300 hover:bg-indigo-700"
                >
                    Begin Nu
                </a>
            </div>
        </section>
    );
};

interface PricingCardProps {
    plan: string;
    price: string;
    features: string[];
    primary?: boolean;
}

// Pricing Card Component
const PricingCard = ({ plan, price, features, primary = false }: PricingCardProps) => {
    const cardClasses = `border rounded-lg p-8 flex flex-col shadow-lg transform hover:scale-105 transition-transform duration-300 ${primary ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white' : 'bg-white'} h-[600px]`;
    const buttonClasses = `mt-8 py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${primary ? 'bg-white text-purple-600 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`;
    const featureTextColor = primary ? 'text-indigo-200' : 'text-gray-600';

    return (
        <div className={cardClasses}>
            <h3 className={`text-2xl font-bold ${primary ? '':'text-gray-900'}`}>{plan}</h3>
            <p className={`mt-4 text-4xl font-extrabold ${primary ? '':'text-gray-900'}`}>{price}<span className="text-lg font-medium">/mo</span></p>
            <ul className="flex-grow mt-6 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className={`flex items-center ${featureTextColor}`}>
                        <svg className="mr-2 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>
            <button className={buttonClasses}>
                Begin
            </button>
        </div>
    );
};

// Pricing Section
const PricingSection = () => {
    const plans: PricingCardProps[] = [
        {
            plan: 'Basic',
            price: '$10',
            features: ['1 User', '10GB Storage', 'Basic Support'],
        },
        {
            plan: 'Pro',
            price: '$25',
            features: ['5 Users', '50GB Storage', 'Priority Support', 'Advanced Analytics'],
            primary: true,
        },
        {
            plan: 'Enterprise',
            price: '$50',
            features: ['Unlimited Users', '200GB Storage', '24/7 Support', 'Custom Integrations'],
        },
    ];

    return (
        <section id="pricing" className="flex justify-center items-center py-20 min-h-screen">
            <div className="container px-6 py-12 mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900">Kies Jouw Plan</h2>
                    <p className="mt-4 text-lg text-gray-600">Kies een plan dat bij jouw behoort.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((p, i) => (
                        <PricingCard key={i} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
};


export default function Homepage() {
    return (
        <>
            <Head title="Homepage" />
            <div className="font-sans antialiased text-gray-900 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400">
                <Navbar />
                <main>
                    <HeroSection />
                    <PricingSection />
                </main>
            </div>
        </>
    );
}
