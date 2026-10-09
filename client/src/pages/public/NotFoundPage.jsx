import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3157D5]/10 text-[#3157D5] font-mono font-bold text-2xl border border-[#3157D5]/20">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-[#667085] leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a different URL.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="md">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
