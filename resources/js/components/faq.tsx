interface FaqItem {
    question: string;
    answer: string;
}

const faqData: FaqItem[] = [
    {
        question: 'Welke examencentra kan ik kiezen?',
        answer: 'Je kunt kiezen uit de volgende examencentra: Autoveiligheid.ben, sbat.be (Deurne, Geel, Kontich, Alken, Bree, Haasrode, Sint-Denijs-Westrem, Brakel, Eeklo, Erembodegem, Sint-Niklaas) ',
    },
    {
        question: 'Hoe werkt de notificatie-abonnement?',
        answer: 'Na het aanmaken van de account kiest u voor welke examencentrum u een bericht wilt ontvangen en tussen welke datum en uur u nieuwe vrije datums wilt ontvangen(in de instellingen). Vervolgens als wij uw bundel activeren (stuur ons via e-mail of contact-formulier) gaat u telkens een e-mail bericht ontvangen met de nieuwe vrije datums.',
    },
    {
        question: 'Hoe activeer ik de notificatie-abonnement?',
        answer: 'Maak een account aan en vul je e-mail in. Kies de examencentra waarvoor u een notificatie wilt ontvangen, kies ook het uur en datum in de instellingen. Vervolgens neem met ons contact op via de contact-formulier of deze e-mail (info@rijbewijsboeker.be). Stuur ons een bericht met de bundel die je wilt kiezen en met je gegevens van de account.',
    },
    {
        question: 'Hoe werkt automatisch inschrijven?',
        answer: 'Maak een account aan en vul uw gegevens goed in. In de instellingen is er een tab voor het inschrijven voor sbat.be en autoveiligheid.be vul in deze tab alles in als u deze bundel wilt kiezen deze is nodig om automatisch in te loggen op de site wanneer er nieuwe datum vrij komt en deze is ook nodig om u automatisch in te schrijven. Na dat u alles heeft ingevuld en de steden heeft gekozen waar u zich automatisch wilt inschrijven contacteer ons via e-mail(info@rijbewijsboeker.be) of formulier.',
    },
    {
        question: 'Hoe snel kan ik een eerdere examendatum vinden?',
        answer: 'Dit hangt af van de beschikbaarheid bij het CBR. Sommige gebruikers vinden binnen enkele uren een nieuwe datum, terwijl het voor anderen enkele dagen kan duren. We garanderen dat je de eerste beschikbare datum die aan je criteria voldoet, niet zult missen.',
    },

    {
        question: 'Is dit legaal?',
        answer: 'Ja, onze service is volledig legaal. Wij maken gebruik van openbaar toegankelijke informatie en automatiseren alleen het proces van het controleren op beschikbaarheid, wat je anders handmatig zou moeten doen.',
    },

    {
        question: 'Wat gebeurt er nadat ik een melding heb ontvangen? (Enkel voor de notifcatie bundel)',
        answer: 'Wanneer je een melding ontvangt, moet je zelf zo snel mogelijk inloggen op de CBR-website om de voorgestelde datum te boeken. Vrijgekomen plekken worden vaak snel weer bezet, dus snelheid is essentieel.',
    },
    {
        question: 'Is het veilig om mijn gegevens te delen met deze site?',
        answer: 'Ja, onze site is veilig en betrouwbaar. We gebruiken moderne technieken om uw gegevens te beveiligen en wij gebruiken uw gegevens enkel om u in te schrijven. U kan ook uw account verwijderen via de instellingen.',
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
