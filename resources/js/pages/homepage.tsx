import { Head } from '@inertiajs/react';

import { Faq } from '@/components/faq';
import { Navbar } from '@/components/navbar';

const HeroSection = () => {
    return (
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
            <div className="absolute top-0 left-0 z-0 h-full w-full">
                <div className="animate-float absolute top-1/4 left-1/4 h-24 w-24 rounded-full bg-purple-500 opacity-20"></div>
                <div
                    className="animate-float absolute top-1/2 right-1/4 h-32 w-32 rounded-lg bg-purple-500 opacity-20"
                    style={{ animationDelay: '1s' }}
                ></div>
                <div
                    className="animate-float absolute bottom-1/4 left-1/3 h-16 w-16 rounded-full bg-purple-500 opacity-20"
                    style={{ animationDelay: '2s' }}
                ></div>
            </div>

            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-extrabold text-white">Altijd Als Eerste Ingeschreven voor je Examen</h1>
                <p className="mt-4 text-lg text-gray-300">
                    Geen stress, geen wachtrijen. Wij regelen je inschrijving zodra er een plek beschikbaar is.
                </p>

                <a
                    href="#reviews"
                    className="mt-8 inline-block cursor-pointer rounded-lg bg-indigo-600 px-8 py-3 font-bold text-white transition duration-300 hover:bg-indigo-700"
                >
                    Begin Nu
                </a>
            </div>
        </section>
    );
};

const ReviewSection = () => {
    const reviews = [
        {
            name: 'Lisa V.',
            role: 'Rijstudent',
            content:
                'Binnen een dag na mijn inschrijving kreeg ik al een melding van een vrije plek! Super service en gebruiksvriendelijk. Dankzij deze dienst kon ik mijn examen veel eerder doen dan verwacht.',
            rating: 5,
            date: '15 juli 2025',
        },
        {
            name: 'Thomas J.',
            role: 'Rijinstructeur',
            content:
                'Ik raad al mijn leerlingen aan om deze service te gebruiken. Het scheelt ze veel tijd en gedoe met continu de CBR site te moeten verversen. De automatische inschrijving is een uitkomst!',
            rating: 5,
            date: '2 juni 2025',
        },
        {
            name: 'Sanne B.',
            role: 'Rijstudent',
            content:
                'Eindelijk een betrouwbare manier om een examen te vinden! De meldingen komen direct binnen en ik hoefde niet meer uren te spenderen aan het zoeken naar een plek. Binnen een week had ik al een examen kunnen plannen.',
            rating: 5,
            date: '21 juli 2025',
        },
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Wat onze gebruikers zeggen</h2>
                    <p className="mx-auto max-w-2xl text-gray-400">Meer dan 1.000 tevreden gebruikers hebben hun examen eerder kunnen doen</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 shadow-lg transition-all duration-300 hover:border-indigo-500/30"
                        >
                            <div className="mb-4 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="mb-6 text-gray-300">"{review.content}"</p>
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{review.name}</h4>
                                    <p className="text-sm text-gray-400">
                                        {review.role} • {review.date}
                                    </p>
                                </div>
                            </div>
                        </div>
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
            <meta name="description" content="Vind een vrije plek voor een examen en ontvang een melding wanneer er een vrije plek vrijkomt." />
            <div className="bg-gradient-to-br from-black via-gray-900 to-purple-900 font-sans text-gray-200 antialiased">
                <Navbar />
                <main>
                    <HeroSection />
                    <ReviewSection />
                    <Faq />
                </main>
            </div>
        </>
    );
}
