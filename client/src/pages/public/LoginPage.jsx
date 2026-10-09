import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Mail, Lock, ShieldCheck, ArrowRight, User, Shield, Sparkles } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Please enter your registered email address';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await login({ email, password });
      showToast(res.message || 'Signed in successfully!', 'success');
      
      const destination =
        location.state?.from?.pathname ||
        (res.data?.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (err) {
      showToast(err.message || 'Invalid email or password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'admin') {
      setEmail('admin@careerbridge.edu');
      setPassword('Admin@123');
    } else {
      setEmail('alex.chen@university.edu');
      setPassword('Password123');
    }
    setErrors({});
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E4E8F0] shadow-xl overflow-hidden">
        {/* Left Visual Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#14213D] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#3157D5]/20 blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#3157D5] flex items-center justify-center text-white">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-lg text-white">
                Career<span className="text-[#6478F0]">Bridge</span>
              </span>
            </Link>

            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-semibold text-[#6478F0] uppercase tracking-wider">
                Single Sign-On Portal
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Accelerate Your Campus Career
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to track your recruitment progress, view shortlisted drives, and communicate with university placement coordinators.
              </p>
            </div>

            {/* Quick Demo Credentials Pill Box */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#6478F0]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo One-Click Credentials</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleFillDemo('student')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between text-[11px]"
                >
                  <span>Student: alex.chen@university.edu</span>
                  <span className="text-[10px] text-[#6478F0] underline">Autofill</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between text-[11px]"
                >
                  <span>Admin: admin@careerbridge.edu</span>
                  <span className="text-[10px] text-[#6478F0] underline">Autofill</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Identity Verification</span>
            </div>
            <p className="text-[11px]">
              Guaranteed data privacy & zero-trust security architecture.
            </p>
          </div>
        </div>

        {/* Right Form Column (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-[#667085]">
              Select your role and enter your institutional credentials.
            </p>
          </div>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0]">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-white text-[#3157D5] shadow-xs'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                role === 'admin'
                  ? 'bg-white text-[#3157D5] shadow-xs'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Placement Admin</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder={role === 'admin' ? 'admin@careerbridge.edu' : 'student@college.edu'}
              icon={Mail}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="••••••••••••"
              icon={Lock}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#667085] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#3157D5] focus:ring-[#3157D5]"
                />
                <span>Remember me on this device</span>
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Password recovery workflow is managed via placement office.', 'info');
                }}
                className="font-medium text-[#3157D5] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In as {role === 'admin' ? 'Administrator' : 'Student'}
            </Button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center pt-2 border-t border-[#F1F5F9] text-xs text-[#667085]">
            <span>Don’t have a student account yet? </span>
            <Link to="/register" className="font-semibold text-[#3157D5] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
