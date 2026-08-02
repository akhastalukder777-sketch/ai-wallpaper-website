import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Shield, FileText } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer | AI Wallpapers Hub',
  description: 'Disclaimer policy for AI Wallpapers Hub covering AI content rights, copyright notices, and advertisement disclosures.',
};

export default function Disclaimer() {
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
            <AlertCircle className="w-4 h-4 text-indigo-400" />
            Legal Notice
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Disclaimer
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 2026</p>
        </div>

        {/* Disclaimer Content */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> 1. General Disclaimer
            </h2>
            <p>
              The information provided by AI Wallpapers Hub on our website is for general informational and entertainment purposes only. All wallpapers, artwork, and images on the site are provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" /> 2. AI Content & Copyright Notice
            </h2>
            <p>
              AI Wallpapers Hub hosts wallpapers generated using artificial intelligence algorithms as well as royalty-free public domain digital artwork. We do not knowingly publish copyrighted wallpapers without authorization.
            </p>
            <p>
              If you are a copyright owner or an agent thereof and believe that any content on our site infringes upon your copyright, please contact us via our Contact Us page with detailed information for immediate content review and removal.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">3. Third-Party Advertisements (Google AdSense)</h2>
            <p>
              This site may contain third-party advertisements and links to external websites provided by advertising networks such as Google AdSense. We do not endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through our site or any advertisement banner.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">4. Personal Display Use Only</h2>
            <p>
              All downloaded wallpapers are intended solely for personal display customization on personal computers, laptops, tablets, and smartphones. Commercial redistribution or resale without authorization is strictly prohibited.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}