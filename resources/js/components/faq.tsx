interface FaqItem {
    question: string;
    answer: string;
}

const faqData: FaqItem[] = [
    {
        question: 'Welke examencentra kan ik kiezen?',
        answer: 'Je kunt kiezen uit de volgende examencentra: Autoveiligheid.be (Deurne, Geel, Kontich, Alken, Bree, Haasrode) ',
    },
    {
        question: 'Hoe snel kan ik een eerdere examendatum vinden?',
        answer: 'Dit hangt af van de beschikbaarheid bij het CBR. Sommige gebruikers vinden binnen enkele uren een nieuwe datum, terwijl het voor anderen enkele dagen kan duren. We garanderen dat je de eerste beschikbare datum die aan je criteria voldoet, niet zult missen.',
    },
    {
        question: 'Hoe werkt de service?',
        answer: 'Na het aanmaken van het account moet u naar de instellingen gaan en uw e-mail + whatsapp nummer invullen. (Deze zijn noodzakelijk om de meldingen te kunnen ontvangen) vervolgens neem met ons contact op om de bundel te kiezen, wij zullen uw account activeren en u kunt direct beginnen met ontvangen van meldingen.',
    },
    {
        question: 'Is dit legaal?',
        answer: 'Ja, onze service is volledig legaal. Wij maken gebruik van openbaar toegankelijke informatie en automatiseren alleen het proces van het controleren op beschikbaarheid, wat je anders handmatig zou moeten doen.',
    },

    {
        question: 'Wat gebeurt er nadat ik een melding heb ontvangen? (Enkel voor de notifcatie bundel)',
        answer: 'Wanneer je een melding ontvangt, moet je zelf zo snel mogelijk inloggen op de CBR-website om de voorgestelde datum te boeken. Vrijgekomen plekken worden vaak snel weer bezet, dus snelheid is essentieel.',
    },
];

export function Faq() {
    return (
        <div id="faq" className="mx-auto max-w-2xl py-16">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Veelgestelde Vragen</h2>
            <div className="divide-y divide-gray-600">
                {faqData.map((faq, index) => (
                    <div key={faq.question} className={index > 0 ? 'pt-8' : ''}>
                        <dt className="text-2xl leading-7 font-semibold text-white">{faq.question}</dt>
                        <dd className="mt-2 text-base leading-7 text-white">{faq.answer}</dd>
                    </div>
                ))}
            </div>
        </div>
    );
}
