import { Shield, Lock, Server, Key, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-emerald-200/50 shadow-sm backdrop-blur-md">
            <Shield className="w-4 h-4" />
            Platform Security
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Enterprise-Grade Security</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Your agricultural trading data is the lifeblood of your business. We protect it with the highest standards of security, encryption, and continuous monitoring.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Data Encryption</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              All data transmitted to and from ATMS is encrypted in transit using TLS 1.3. Sensitive data at rest is encrypted using industry-standard AES-256 encryption.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Infrastructure Security</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Our platform is hosted on secure, SOC 2 compliant data centers. We employ advanced firewalls, DDoS protection, and automated vulnerability scanning.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Access Control</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Strict Role-Based Access Control (RBAC) ensures your team members only see the data they need. We support Multi-Factor Authentication (MFA) for added security.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Continuous Monitoring</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Our dedicated security team monitors the platform 24/7/365. Automated alert systems instantly detect and isolate any suspicious activity.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Compliance & Certifications</h2>
          <div className="prose prose-slate max-w-none prose-a:text-emerald-600 text-slate-600">
            <p>ATMS operates in compliance with strict international data protection regulations. We conduct annual third-party penetration testing and regular internal security audits to ensure our defenses remain robust against evolving threats.</p>
            <p className="mt-4">If you need our SOC 2 Type II report or have specific security questions for your enterprise compliance team, please reach out to <a href="mailto:security@atms.com" className="font-medium">security@atms.com</a>.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
