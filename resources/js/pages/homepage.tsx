import React from 'react';
import { Head } from '@inertiajs/react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs2';
import NumberFlow from '@number-flow/react';
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
import { Sparkles, ArrowRight, Check, Star, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'hobby',
    name: 'Hobby',
    icon: Star,
    price: {
      monthly: 'Free forever',
      yearly: 'Free forever',
    },
    description:
      'The perfect starting place for your web app or personal project.',
    features: [
      '50 API calls / month',
      '60 second checks',
      'Single-user account',
      '5 monitors',
      'Basic email support',
    ],
    cta: 'Get started for free',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    price: {
      monthly: 90,
      yearly: 75,
    },
    description: 'Everything you need to build and scale your business.',
    features: [
      'Unlimited API calls',
      '30 second checks',
      'Multi-user account',
      '10 monitors',
      'Priority email support',
    ],
    cta: 'Subscribe to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Shield,
    price: {
      monthly: 'Get in touch for pricing',
      yearly: 'Get in touch for pricing',
    },
    description: 'Critical security, performance, observability and support.',
    features: [
      'You can DDOS our API.',
      'Nano-second checks.',
      'Invite your extended family.',
      'Unlimited monitors.',
      "We'll sit on your desk.",
    ],
    cta: 'Contact us',
  },
];

// You can create a dedicated component for this
const Navbar = () => {
    const handleScroll = () => {
        const target = document.getElementById("pricing");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <nav className="fixed top-0 z-10 w-full bg-transparent shadow-lg backdrop-blur-lg">
            <div className="container flex justify-between items-center px-6 py-3 mx-auto">
                <a className="text-xl font-bold text-white" href="#">
                    FastTrack Examen Alerts
                </a>
                <div className="hidden items-center space-x-6 md:flex">
                    <a className="text-white hover:text-gray-200" href="#home">Home</a>
                    <a className="text-white hover:text-gray-200" onClick={handleScroll}>Pricing</a>
                    <a className="text-white hover:text-gray-200" href="#">About</a>
                    <a className="text-white hover:text-gray-200" href="#">Contact</a>
                </div>
                <div className="md:hidden">
                    <button className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

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
                <div className="absolute right-1/3 bottom-1/2 w-20 h-20 bg-purple-500 rounded-lg opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-extrabold text-white">
                    Welkom bij FastTrack Examen Alerts
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Mis nooit meer een examendatum. Krijg direct een melding zodra er een plek vrijkomt.
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
  const [frequency, setFrequency] = useState<string>('monthly');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="flex overflow-hidden relative flex-col gap-16 px-4 py-24 w-full text-center not-prose sm:px-8">
      <div className="overflow-hidden absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
      </div>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col items-center space-y-2">
          <Badge
            variant="outline"
            className="px-4 py-1 mb-4 text-sm font-medium rounded-full border-primary/20 bg-primary/5"
          >
            <Sparkles className="text-primary mr-1 h-3.5 w-3.5 animate-pulse" />
            Pricing Plans
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30 sm:text-5xl"
          >
            Pick the perfect plan for your needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pt-2 max-w-md text-lg text-muted-foreground"
          >
            Simple, transparent pricing that scales with your business. No
            hidden fees, no surprises.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs
            defaultValue={frequency}
            onValueChange={setFrequency}
            className="inline-block p-1 rounded-full shadow-sm bg-muted/30"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm"
              >
                Yearly
                <Badge
                  variant="secondary"
                  className="ml-2 bg-primary/10 text-primary hover:bg-primary/15"
                >
                  20% off
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
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
                      Popular
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
                      {typeof plan.price[
                        frequency as keyof typeof plan.price
                      ] === 'number' ? (
                        <div className="flex items-baseline">
                          <NumberFlow
                            className={cn(
                              'text-3xl font-bold',
                              plan.popular ? 'text-primary' : 'text-foreground',
                            )}
                            format={{
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            }}
                            value={
                              plan.price[
                                frequency as keyof typeof plan.price
                              ] as number
                            }
                          />
                          <span className="ml-1 text-sm text-muted-foreground">
                            /month, billed {frequency}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            'text-2xl font-bold',
                            plan.popular ? 'text-primary' : 'text-foreground',
                          )}
                        >
                          {plan.price[frequency as keyof typeof plan.price]}
                        </span>
                      )}
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
