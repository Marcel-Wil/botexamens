import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Abonnament',
        href: '/settings/abonnament',
    },
];

export default function Abonnament() {
    const { auth } = usePage<SharedData>().props;
    console.log(auth.user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Abonnament" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Abonnament" description="Hier kunt u uw active abonnementen beheren." />

                    {Boolean(auth.user.notification) && (
                        <div className="flex flex-col space-y-2">
                            <p>
                                U heeft momenteel <span className="font-bold">Notificaties</span> bundel
                            </p>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
