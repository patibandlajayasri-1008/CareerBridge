import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Mail, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] text-white border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#3157D5] flex items-center justify-center text-white">
                <Briefcase className="w-4.5 h-4.5" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Career<span className="text-[#6478F0]">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier campus recruitment and placement platform designed to connect ambitious college talent with industry-leading corporate hiring partners.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Institutional Placement & Privacy Compliant</span>
            </div>
          </div>

          {/* Column 1: For Students */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              For Students
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-white transition-colors">
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Build Student Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Resume Score Check (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Placement Cell / Admin */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Placement Cell
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Recruiter Console
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Post New Opportunity
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Application Review
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Placement Reports
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-slate-400 hover:text-white transition-colors">
                  Security & Zero-Trust
                </a>
              </li>
              <li>
                <span className="text-slate-400">REST API v1.0</span>
              </li>
              <li>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-400 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  System Operational
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CareerBridge. Developed with MERN Stack Architecture.</p>
          <div className="flex items-center gap-6">
            <span>Enterprise Placement System</span>
            <span>•</span>
            <span>Accessibility (WCAG 2.1 AA)</span>
            <span>•</span>
            <span>Zero-Trust RBAC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
