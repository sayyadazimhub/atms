import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      desc: "Perfect for small trading businesses just starting out.",
      price: "Free",
      features: [
        "Up to 100 inventory items",
        "Basic sales & purchase tracking",
        "Standard reporting",
        "Single user access"
      ],
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      desc: "Everything you need to scale your trading operations.",
      price: "₹999",
      period: "/month",
      features: [
        "Unlimited inventory items",
        "Advanced analytics & profit tracking",
        "Customer & supplier management",
        "Payment due tracking",
        "Up to 5 team members",
        "Priority support"
      ],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      desc: "Custom solutions for large wholesale distributors.",
      price: "Custom",
      features: [
        "Everything in Professional",
        "Custom API integrations",
        "Unlimited team members",
        "Dedicated account manager",
        "Custom reporting capabilities"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl tracking-tight mb-4">
            Simple, <span className="text-emerald-600 dark:text-emerald-400">Transparent Pricing</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Choose the plan that fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-white dark:bg-slate-950 p-8 rounded-3xl border ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10' : 'border-slate-200 dark:border-slate-800 shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 h-10">{plan.desc}</p>
              </div>
              
              <div className="mb-8 flex items-end gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${
                  plan.popular 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
