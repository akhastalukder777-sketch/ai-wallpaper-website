import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, ShieldAlert, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | AI Wallpapers Hub',
  description: 'Terms of Service for AI Wallpapers Hub. Read about wallpaper usage rights, AI content terms, and copyright guidelines.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Scale className="w-4 h-4 text-indigo-400" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> 1. Agreement to Terms
            </h2>
            <p>
              By accessing and downloading wallpapers from AI Wallpapers Hub, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" /> 2. License & Wallpaper Usage Rights
            </h2>
            <p>
              All wallpapers hosted on AI Wallpapers Hub are provided free of charge for personal desktop, laptop, tablet, and smartphone display customization.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>You MAY download and use wallpapers for personal background displays.</li>
              <li>You MAY share links to our website or wallpaper pages on social media.</li>
              <li>You MAY NOT resell, monetize, or repackage our wallpapers without explicit written permission.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" /> 3. Intellectual Property & AI Guidelines
            </h2>
            <p>
              We prioritize original AI-generated and royalty-free content. We strictly adhere to intellectual property laws. Copyrighted themes (such as trademarked anime characters, sports brands, or celebrities) are only generated through legally licensed AI models or public domain assets. If you believe any wallpaper infringes your copyright, please submit a notice to us for prompt removal.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
            <p>
              In no event shall AI Wallpapers Hub or its operators be liable for any damages arising out of the use or inability to use the materials on our website, even if notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with applicable copyright laws and regulations.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}