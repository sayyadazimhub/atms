import { ShieldCheck, Database, Settings, Mail, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      title: "1. Information We Collect",
      icon: Database,
      color: "bg-blue-50 text-blue-600",
      content: (
        <>
          <p className="text-slate-600 font-medium mb-4 leading-relaxed">
            We may collect information about you in a variety of ways. The information we may collect includes:
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <p className="text-slate-600 leading-relaxed"><strong className="text-slate-900">Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number.</p>
            </li>
            <li className="flex gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <p className="text-slate-600 leading-relaxed"><strong className="text-slate-900">Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, browser type, and operating system.</p>
            </li>
            <li className="flex gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <p className="text-slate-600 leading-relaxed"><strong className="text-slate-900">Financial Data:</strong> Financial information related to your transactions, agricultural trading metrics, and business volume.</p>
            </li>
          </ul>
        </>
      )
    },
    {
      id: "how-we-use",
      title: "2. How We Use Your Information",
      icon: Settings,
      color: "bg-purple-50 text-purple-600",
      content: (
        <>
          <p className="text-slate-600 font-medium mb-4 leading-relaxed">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We use information collected via the platform to:
          </p>
          <ul className="space-y-3">
            {[
              "Create and manage your secure trading account.",
              "Process transactions and send related information, including confirmations and invoices.",
              "Improve platform performance and develop new trading features.",
              "Monitor and analyze usage and trends to improve your experience."
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
      id: "data-security",
      title: "3. Data Security",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600",
      content: (
        <p className="text-slate-600 font-medium leading-relaxed">
          We use enterprise-grade administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
        </p>
      )
    },
    {
      id: "contact-us",
      title: "4. Contact Us",
      icon: Mail,
      color: "bg-amber-50 text-amber-600",
      content: (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-slate-600 font-medium leading-relaxed mb-4">
            If you have questions or comments about this Privacy Policy, our Data Protection Officer is ready to assist you:
          </p>
          <div className="space-y-2">
            <p className="text-slate-900 font-bold">Email: <a href="mailto:privacy@atms.com" className="text-emerald-600 hover:text-emerald-700 transition-colors">privacy@atms.com</a></p>
            <p className="text-slate-900 font-bold">Phone: <span className="text-slate-600 font-medium">+91 907590-9896</span></p>
          </div>
        </div>
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
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            We believe in complete transparency. Learn exactly how we collect, protect, and use your data to power your agricultural trading business.
          </p>
          <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mt-8">
            Last Updated: October 5, 2026
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-8">
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

      </div>
    </div>
  );
}
