import { Link } from '@inertiajs/react';

export default function AppLogo() {
    return (
        <Link href="/" className="block">
            <div className="grid flex-1 ml-1 text-sm text-left">
                <span className="mb-0.5 truncate leading-tight font-semibold">RijexamenMeldingen</span>
            </div>
        </Link>
    );
}
