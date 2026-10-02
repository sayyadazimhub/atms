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
    <section id="pricing" className="py-12 lg:py-16 relative overflow-hidden bg-slate-50 border-b border-slate-200 flex flex-col justify-center min-h-[auto] xl:min-h-screen">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        
        {/* Premium Header */}
        <div className="mb-10 lg:mb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-slate-200/50 shadow-sm backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Flexible Plans
          </div>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tighter leading-[1.1] mb-4">
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700">Transparent Pricing</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto">
            Choose the plan that fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-white/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border transition-all duration-500 ${
                plan.popular 
                  ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 md:scale-105 z-10 hover:border-emerald-500 hover:shadow-emerald-500/20' 
                  : 'border-slate-200 shadow-lg hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 h-10">{plan.desc}</p>
              </div>
              
              <div className="mb-8 flex items-end gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-medium mb-1 text-sm">{plan.period}</span>}
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${plan.popular ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-slate-700 text-xs sm:text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full h-11 sm:h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 border-0' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
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
