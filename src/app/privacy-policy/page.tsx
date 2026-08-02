import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | AI Wallpapers Hub',
  description: 'Privacy Policy for AI Wallpapers Hub. Read how we protect your data, handle cookies, and comply with Google AdSense policies.',
};

export default function PrivacyPolicy() {
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
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            AdSense & GDPR Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 2026</p>
        </div>

        {/* Policy Content */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" /> 1. Information We Collect
            </h2>
            <p>
              At AI Wallpapers Hub, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AI Wallpapers Hub and how we use it.
            </p>
            <p>
              We do not require users to create an account or provide personal identification information to download wallpapers. We may collect non-personal identification information whenever users interact with our site, such as browser name, computer type, and technical connection details.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" /> 2. Log Files & Analytics
            </h2>
            <p>
              AI Wallpapers Hub follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> 3. Google DoubleClick DART Cookie & AdSense
            </h2>
            <p>
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
            </p>
            <p>
              Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL –{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                https://policies.google.com/technologies/ads
              </a>
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">4. AI Image Rights & Content Policy</h2>
            <p>
              All AI-generated wallpapers available on AI Wallpapers Hub are created using legally licensed AI models or royalty-free public domain prompts. We strictly enforce copyright compliance and do not republish copyrighted themes or trademarked intellectual property without legal permission.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through our contact page.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}