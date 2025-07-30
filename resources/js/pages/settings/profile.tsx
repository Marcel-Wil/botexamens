import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    voornaam: string;
    achternaam: string;
    email: string;
    whatsapp: string;
    rrn: string;
    gbdatum: string;
    tel: string;
    adres: string;
    postcode: string;
    zeersteVRijbewijsDatum: string;
    zhuidigVRijbewijsDatum: string;
    zhuidigVRijbewijsGeldigTot: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        voornaam: auth.user.voornaam,
        achternaam: auth.user.achternaam,
        email: auth.user.email,
        whatsapp: String(auth.user.whatsapp ?? ''),
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

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="voornaam">Voornaam</Label>

                            <Input
                                id="voornaam"
                                className="mt-1 block w-full"
                                value={data.voornaam}
                                onChange={(e) => setData('voornaam', e.target.value)}
                                required
                                autoComplete="voornaam"
                                placeholder="Voornaam"
                            />

                            <InputError className="mt-2" message={errors.voornaam} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="achternaam">Achternaam</Label>

                            <Input
                                id="achternaam"
                                className="mt-1 block w-full"
                                value={data.achternaam}
                                onChange={(e) => setData('achternaam', e.target.value)}
                                required
                                autoComplete="achternaam"
                                placeholder="Achternaam"
                            />

                            <InputError className="mt-2" message={errors.achternaam} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address (Let op! Als u uw e-mail verandert, moet u dit nogmaals verifiëren)</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp">
                                Whatsapp Nummer (Let op! Controleer uw whatsapp nummer DUBBEL! Deze nummer wordt gebruikt voor de notificaties!)
                            </Label>

                            <Input
                                id="whatsapp"
                                className="mt-1 block w-full"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                                autoComplete="off"
                                placeholder="0000000000"
                            />

                            <InputError className="mt-2" message={errors.whatsapp} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rrn">Rijksregisternummer</Label>
                            <Input id="rrn" value={data.rrn} onChange={(e) => setData('rrn', e.target.value)} placeholder="Rijksregisternummer" />
                            <InputError className="mt-2" message={errors.rrn} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gbdatum">Geboortedatum</Label>
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
                            <Label htmlFor="zeersteVRijbewijsDatum">Datum eerste rijbewijs</Label>
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

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

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

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
