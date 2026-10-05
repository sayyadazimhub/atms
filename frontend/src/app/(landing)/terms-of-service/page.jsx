import { CheckSquare, LayoutDashboard, Users, ShieldAlert, Scale, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckSquare,
      color: "bg-blue-50 text-blue-600",
      content: (
        <p className="text-slate-600 font-medium leading-relaxed">
          By accessing or using the ATMS platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service. These terms constitute a legally binding agreement between you and ATMS.
        </p>
      )
    },
    {
      id: "description",
      title: "2. Description of Service",
      icon: LayoutDashboard,
      color: "bg-emerald-50 text-emerald-600",
      content: (
        <p className="text-slate-600 font-medium leading-relaxed">
          ATMS provides an advanced agricultural trading management system that helps farmers, commission agents, and traders manage inventory, track logistics, handle billing processes, and monitor trading metrics efficiently through our web application interface.
        </p>
      )
    },
    {
      id: "user-accounts",
      title: "3. User Accounts",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      content: (
        <>
          <p className="text-slate-600 font-medium mb-4 leading-relaxed">
            When you create an account with us, you must provide accurate, complete, and current information.
          </p>
          <ul className="space-y-3">
            {[
              "You are responsible for safeguarding the password that you use to access the platform.",
              "You agree not to disclose your password to any third party.",
              "You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
              "Failure to maintain accurate account information constitutes a breach of the Terms, which may result in immediate termination of your account."
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <p className="text-slate-600 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable Use",
      icon: ShieldAlert,
      color: "bg-amber-50 text-amber-600",
      content: (
        <p className="text-slate-600 font-medium leading-relaxed">
          You agree not to use the platform in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of ATMS. You must not use the platform in any way which is unlawful, illegal, fraudulent, or harmful. We reserve the right to suspend accounts that engage in suspicious or abusive API usage.
        </p>
      )
    },
    {
      id: "governing-law",
      title: "5. Governing Law",
      icon: Scale,
      color: "bg-rose-50 text-rose-600",
      content: (
        <p className="text-slate-600 font-medium leading-relaxed">
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
      )
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-emerald-200/50 shadow-sm backdrop-blur-md">
            <FileText className="w-4 h-4" />
            Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Terms of Service</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Please read these terms carefully. They outline your rights and responsibilities when using the ATMS platform for your trading operations.
          </p>
          <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mt-8">
            Last Updated: October 5, 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-8 mb-12">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex items-start gap-5 mb-6">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${section.color}`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="pt-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{section.title}</h2>
                </div>
              </div>
              <div className="pl-0 md:pl-17">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Block */}
        <div className="bg-emerald-600 rounded-3xl p-8 md:p-10 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Questions about our Terms?</h2>
          <p className="text-emerald-100 font-medium mb-6 relative z-10 max-w-lg mx-auto">
            If you have any questions or require clarification about any of the terms outlined above, our legal team is ready to assist.
          </p>
          <a 
            href="mailto:legal@atms.com" 
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition-colors shadow-sm relative z-10"
          >
            Contact Legal Team
          </a>
        </div>

      </div>
    </div>
  );
}
