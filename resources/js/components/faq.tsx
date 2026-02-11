import { useTrans } from '@/hooks/use-trans';

export function Faq() {
    const { t } = useTrans();

    const faqData = [
        {
            question: t('Zijn jullie verbonden aan SBAT, Autoveiligheid of een examencentrum?'),
            answer: t('Nee, Rijbewijsboeker is op geen enkele manier verbonden aan, geassocieerd met of onderdeel van SBAT nv, Autoveiligheid of enig ander examencentrum. Wij zijn een onafhankelijke dienst die u helpt bij het vinden en boeken van beschikbare examendata.'),
        },
        {
            question: t('Welke gegevens bewaren jullie en waarom?'),
            answer: t('Wij bewaren enkel de gegevens die noodzakelijk zijn om u in te schrijven voor een rijexamen, zoals uw naam, e-mailadres en eventueel de gegevens die vereist zijn door het examencentrum (bv. rijksregisternummer, geboortedatum, adres). Deze gegevens worden uitsluitend gebruikt om uw boeking uit te voeren en worden niet verkocht of gedeeld met derden.'),
        },
        {
            question: t('Hoe lang worden mijn gegevens bewaard?'),
            answer: t('Uw gegevens worden bewaard zolang uw account actief is. U kunt op elk moment uw account en alle bijbehorende gegevens laten verwijderen via de instellingen of door contact op te nemen via info@rijbewijsboeker.be.'),
        },
        {
            question: t('Wat zijn mijn rechten met betrekking tot mijn gegevens?'),
            answer: t('Conform de GDPR heeft u recht op inzage, wijziging, verwijdering en overdracht van uw persoonsgegevens. Ook heeft u het recht om bezwaar te maken tegen de verwerking of een beperking van de verwerking te vragen. U kunt deze rechten uitoefenen door contact op te nemen via info@rijbewijsboeker.be.'),
        },
        {
            question: t('Is dit legaal?'),
            answer: t('Ja, onze service is volledig legaal. Wij maken gebruik van openbaar toegankelijke informatie op de websites van examencentra en automatiseren het proces van het controleren op beschikbaarheid, wat u anders handmatig zou moeten doen. Wij handelen hierbij in opdracht en met toestemming van de gebruiker.'),
        },
    ];

    return (
        <div id="faq" className="mx-auto max-w-2xl py-16">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('Veelgestelde Vragen')}</h2>
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
