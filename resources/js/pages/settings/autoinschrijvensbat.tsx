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
        title: 'Auto Inschrijven Sbat Settings',
        href: '/settings/autoinschrijvensbat',
    },
];

type AutoInschrijvenSbatForm = {
    email: string;
    password: string;
};

export default function AutoInschrijvenSbat() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<AutoInschrijvenSbatForm>>({
        email: String(auth.user.email ?? ''),
        password: String(auth.user.password ?? ''),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('autoinschrijvensbat.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Auto Inschrijven Sbat Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                        <HeadingSmall
                            title="Automatisch Inschrijven"
                            description="Deze instellingen worden gebruikt voor het automatisch inschrijven voor de examen."
                        />
                        <p className="text-sm text-red-600"> (Deze instellingen zijn verplicht in te vullen als u deze functie wilt gebruiken)</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email" />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Password" />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        <div className="flex gap-4 items-center">
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
