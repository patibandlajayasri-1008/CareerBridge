import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Mail,
  Lock,
  User,
  GraduationCap,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    degree: 'B.Tech / B.E.',
    graduationYear: '2026',
    password: '',
    confirmPassword: '',
    skills: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const degrees = [
    'B.Tech / B.E.',
    'M.Tech',
    'MCA',
    'BCA / B.Sc Computer Science',
    'MBA',
    'Other Engineering Program',
  ];

  const graduationYears = ['2024', '2025', '2026', '2027', '2028'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'College email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.college.trim()) newErrors.college = 'College/University name is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the placement portal guidelines';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        degree: formData.degree,
        graduationYear: Number(formData.graduationYear),
        skills: skillsArray,
      };

      const res = await register(payload);
      showToast(
        res.message || `Welcome to CareerBridge, ${formData.name}! Account registered successfully.`,
        'success'
      );
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E4E8F0] shadow-xl overflow-hidden">
        {/* Left Information Column (5 cols) */}
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
                Student Enrollment
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Join the 2026 Campus Placement Drive
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Build your verified academic profile, connect with participating employers, and track application shortlists all in one place.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free for University Students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Encrypted Resume Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Verification by Placement Cell</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
            <span>By signing up, you agree to fair placement conduct and authentic academic reporting.</span>
          </div>
        </div>

        {/* Right Form Column (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
              Create Student Profile
            </h1>
            <p className="text-xs text-[#667085]">
              Fill in your details to start discovering relevant campus opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <Input
              label="Full Legal Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              icon={User}
              error={errors.name}
              required
            />

            {/* Email */}
            <Input
              label="College Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. yourname@college.edu"
              icon={Mail}
              error={errors.email}
              helperText="Institutional or personal email for recruitment updates"
              required
            />

            {/* College Name */}
            <Input
              label="College / Institute Name"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. National Institute of Technology"
              icon={Building}
              error={errors.college}
              required
            />

            {/* Degree & Grad Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Degree Program"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                options={degrees}
                required
              />
              <Select
                label="Graduation Year"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                options={graduationYears}
                required
              />
            </div>

            {/* Skills */}
            <Input
              label="Key Technical Skills (Comma-separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React.js, Node.js, Python, SQL"
              helperText="Helps match your profile with relevant drives"
            />

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                icon={Lock}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                icon={Lock}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2.5 text-xs text-[#667085] cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="rounded border-[#CBD5E1] text-[#3157D5] focus:ring-[#3157D5] mt-0.5"
                />
                <span>
                  I confirm that all entered academic information is accurate and agree to the{' '}
                  <strong className="text-[#172033]">Placement Drive Guidelines</strong>.
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-xs text-[#C2414B] font-medium">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Complete Registration
            </Button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center pt-2 border-t border-[#F1F5F9] text-xs text-[#667085]">
            <span>Already registered? </span>
            <Link to="/login" className="font-semibold text-[#3157D5] hover:underline">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
