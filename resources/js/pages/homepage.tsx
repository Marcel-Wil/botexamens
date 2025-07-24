import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs2';

import { Badge } from '@/components/ui/badge2';
import { Button } from '@/components/ui/button2';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card2';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Check, Bell, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';

const plans = [
  {
    id: 'notificatie',
    name: 'Notificatie',
    icon: Bell,
    price: {
      monthly: '€59,99',
    },
    description: 'Word direct gewaarschuwd wanneer er nieuwe examendata beschikbaar komen.',
    features: [
      'Directe e-mailmelding bij nieuwe data',
      'WhatsApp bericht bij beschikbaarheid',
      '24/7 monitoring van het CBR systeem',
      'Eenvoudig zelf in te stellen',
      'Geen abonnement, eenmalige betaling',
    ],
    cta: 'Kies Notificatie',
    popular: false,
  },
  {
    id: 'automatisch',
    name: 'Automatische Inschrijving',
    icon: Zap,
    price: {
      monthly: '€139,99',
    },
    description: 'Wij schrijven je direct in zodra er een plek vrijkomt.',
    features: [
      'Automatische inschrijving bij beschikbaarheid',
      'E-mail- en WhatsApp bevestiging',
      '24/7 monitoring van het CBR systeem',
      'Geen gedoe, wij regelen alles',
    ],
    cta: 'Kies Automatisch',
    popular: true,
  },
  {
    id: 'per-notificatie',
    name: 'Per Notificatie',
    icon: Bell,
    price: {
      monthly: '€2,99 per melding',
    },
    description: 'Betaal alleen voor de meldingen die je ontvangt.',
    features: [
      'Betaal per ontvangen melding',
      'Geen abonnementskosten',
      'E-mail- en WhatsApp meldingen',
      '24/7 monitoring van het CBR systeem',
      'Eerste melding is gratis',
    ],
    cta: 'Kies Per Melding',
    popular: false,
  },
];

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
                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-20 animate-float"></div>
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-500 rounded-lg opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-extrabold text-white">
                    Mis Nooit Meer Een Examendatum
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Krijg direct een melding zodra er een plek vrijkomt.
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

function SimplePricing() {
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div id="pricing" className="flex overflow-hidden relative flex-col gap-16 px-4 py-24 w-full text-center not-prose sm:px-8">
      <div className="overflow-hidden absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
      </div>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col items-center space-y-2">
          <Badge
            variant="outline"
            className="px-4 py-1 rounded-full shadow-sm bg-background text-foreground"
          >
            Prijsplannen
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-center text-foreground sm:text-4xl md:text-5xl">
            Vind het perfecte plan voor jou
          </h2>
          <p className="max-w-2xl text-lg text-center text-muted-foreground">
            Kies het plan dat bij je past. Alle plannen komen met onze 24/7 ondersteuning.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 w-full max-w-6xl md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex"
            >
              <Card
                className={cn(
                  'bg-secondary/20 relative h-full w-full text-left transition-all duration-300 hover:shadow-lg',
                  plan.popular
                    ? 'ring-primary/50 dark:shadow-primary/10 shadow-md ring-2'
                    : 'hover:border-primary/30',
                  plan.popular &&
                    'from-primary/[0.03] bg-gradient-to-b to-transparent',
                )}
              >
                {plan.popular && (
                  <div className="absolute right-0 left-0 -top-3 mx-auto w-fit">
                    <Badge className="px-4 py-1 rounded-full shadow-sm bg-primary text-primary-foreground">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      Populair
                    </Badge>
                  </div>
                )}
                <CardHeader className={cn('pb-4', plan.popular && 'pt-8')}>
                  <div className="flex gap-2 items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        plan.popular
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary text-foreground',
                      )}
                    >
                      <plan.icon className="w-4 h-4" />
                    </div>
                    <CardTitle
                      className={cn(
                        'text-xl font-bold',
                        plan.popular && 'text-primary',
                      )}
                    >
                      {plan.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-3 space-y-2">
                    <p className="text-sm">{plan.description}</p>
                    <div className="pt-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={frequency}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span
                            className={cn(
                              'text-2xl font-bold',
                              plan.popular ? 'text-primary' : 'text-foreground',
                            )}
                          >
                            {plan.price[frequency as keyof typeof plan.price]}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 pb-6">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="flex gap-2 items-center text-sm"
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full',
                          plan.popular
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary text-secondary-foreground',
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span
                        className={
                          plan.popular
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className={cn(
                      'w-full font-medium transition-all duration-300',
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md'
                        : 'hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
                {/* Subtle gradient effects */}
                {plan.popular ? (
                  <>
                    <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-gradient-to-t to-transparent" />
                    <div className="absolute inset-0 rounded-lg border pointer-events-none border-primary/20" />
                  </>
                ) : (
                  <div className="absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 pointer-events-none hover:border-primary/10 hover:opacity-100" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function Homepage() {
    return (
        <>
            <Head title="Homepage" />
            <div className="font-sans antialiased text-gray-200 bg-gradient-to-br from-black via-gray-900 to-purple-900">
                <Navbar />
                <main>
                    <HeroSection />
                    <SimplePricing />
                </main>
            </div>
        </>
    );
}
