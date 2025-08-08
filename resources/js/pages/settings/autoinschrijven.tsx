import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Auto Inschrijven Settings',
        href: '/settings/autoinschrijven',
    },
];

type AutoInschrijvenForm = {
    rrn: string;
    gbdatum: string;
    tel: string;
    adres: string;
    postcode: string;
    zeersteVRijbewijsDatum: string;
    zhuidigVRijbewijsDatum: string;
    zhuidigVRijbewijsGeldigTot: string;
};

export default function AutoInschrijven() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<AutoInschrijvenForm>>({
        rrn: String(auth.user.rrn ?? ''),
        gbdatum: String(auth.user.gbdatum ?? ''),
        tel: String(auth.user.tel ?? ''),
        adres: String(auth.user.adres ?? ''),
        postcode: String(auth.user.postcode ?? ''),
        zeersteVRijbewijsDatum: String(auth.user.zeersteVRijbewijsDatum ?? ''),
        zhuidigVRijbewijsDatum: String(auth.user.zhuidigVRijbewijsDatum ?? ''),
        zhuidigVRijbewijsGeldigTot: String(auth.user.zhuidigVRijbewijsGeldigTot ?? ''),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('autoinschrijven.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Auto Inschrijven Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                        <HeadingSmall
                            title="Automatisch Inschrijven voor praktijkexamen B Autoveiligheid"
                            description="Deze instellingen worden gebruikt voor het automatisch inschrijven voor de examen."
                        />
                        <p className="text-sm text-red-600"> (Deze instellingen zijn verplicht in te vullen als u deze functie wilt gebruiken)</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="rrn">Rijksregisternummer (11 cijfers aan elkaar vb. 00000000000)</Label>
                            <Input
                                id="rrn"
                                value={data.rrn}
                                onChange={(e) => {
                                    if (e.target.value.length <= 11) {
                                        setData('rrn', e.target.value);
                                    }
                                }}
                                placeholder="00.00.00-000.00"
                                maxLength={11}
                            />
                            <InputError className="mt-2" message={errors.rrn} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gbdatum">Geboortedatum (dd/mm/yyyy vb. 01/01/1990)</Label>
                            <Input id="gbdatum" value={data.gbdatum} onChange={(e) => setData('gbdatum', e.target.value)} placeholder="DD/MM/YYYY" />
                            <InputError className="mt-2" message={errors.gbdatum} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tel">Telefoonnummer</Label>
                            <Input id="tel" value={data.tel} onChange={(e) => setData('tel', e.target.value)} placeholder="Telefoonnummer" />
                            <InputError className="mt-2" message={errors.tel} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="adres">Adres</Label>
                            <Input id="adres" value={data.adres} onChange={(e) => setData('adres', e.target.value)} placeholder="Adres" />
                            <InputError className="mt-2" message={errors.adres} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postcode">Postcode</Label>
                            <Input id="postcode" value={data.postcode} onChange={(e) => setData('postcode', e.target.value)} placeholder="Postcode" />
                            <InputError className="mt-2" message={errors.postcode} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="zeersteVRijbewijsDatum">Datum eerste rijbewijs (dd/mm/yyyy vb. 01/01/1990)</Label>
                            <Input
                                id="zeersteVRijbewijsDatum"
                                value={data.zeersteVRijbewijsDatum}
                                onChange={(e) => setData('zeersteVRijbewijsDatum', e.target.value)}
                                placeholder="DD/MM/YYYY"
                            />
                            <InputError className="mt-2" message={errors.zeersteVRijbewijsDatum} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="zhuidigVRijbewijsDatum">Datum huidig rijbewijs</Label>
                            <Input
                                id="zhuidigVRijbewijsDatum"
                                value={data.zhuidigVRijbewijsDatum}
                                onChange={(e) => setData('zhuidigVRijbewijsDatum', e.target.value)}
                                placeholder="DD/MM/YYYY"
                            />
                            <InputError className="mt-2" message={errors.zhuidigVRijbewijsDatum} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="zhuidigVRijbewijsGeldigTot">Vervaldatum huidig rijbewijs</Label>
                            <Input
                                id="zhuidigVRijbewijsGeldigTot"
                                value={data.zhuidigVRijbewijsGeldigTot}
                                onChange={(e) => setData('zhuidigVRijbewijsGeldigTot', e.target.value)}
                                placeholder="DD/MM/YYYY"
                            />
                            <InputError className="mt-2" message={errors.zhuidigVRijbewijsGeldigTot} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
