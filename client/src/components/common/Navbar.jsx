import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, ArrowRight, LogOut, User, Shield } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Jobs', path: '/jobs' },
    ...(isAuthenticated
      ? isAdmin
        ? [{ label: 'Admin Portal', path: '/admin/dashboard' }]
        : [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'My Applications', path: '/applications' },
            { label: 'Profile', path: '/profile' },
          ]
      : [
          { label: 'How It Works', path: '/#how-it-works' },
          { label: 'Why CareerBridge', path: '/#benefits' },
        ]),
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    showToast('You have been signed out successfully.', 'info');
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E4E8F0]'
          : 'bg-white border-b border-[#E4E8F0]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#14213D] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3157D5] rounded-md"
          >
            <div className="w-10 h-10 rounded-lg bg-[#3157D5] flex items-center justify-center text-white shadow-xs group-hover:bg-[#2444b0] transition-colors">
              <Briefcase className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#14213D]">
                Career<span className="text-[#3157D5]">Bridge</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#667085] -mt-1">
                Campus Placements
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive(link.path)
                    ? 'text-[#3157D5] bg-[#3157D5]/5 font-semibold'
                    : 'text-[#667085] hover:text-[#14213D] hover:bg-[#F6F8FC]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E4E8F0] bg-[#F6F8FC] hover:bg-slate-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#14213D] leading-tight max-w-[120px] truncate">
                      {user?.name || 'Account'}
                    </span>
                    <span className="text-[9px] font-medium text-[#667085] uppercase tracking-wider">
                      {user?.role === 'admin' ? 'Placement Admin' : 'Student'}
                    </span>
                  </div>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  className="text-[#667085] hover:text-[#C2414B] hover:border-[#C2414B]/30"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#667085] hover:text-[#14213D] hover:bg-[#F6F8FC] focus:outline-none focus:ring-2 focus:ring-[#3157D5]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E4E8F0] bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {isAuthenticated && (
            <div className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14213D]">{user?.name}</p>
                  <p className="text-[10px] text-[#667085] capitalize">{user?.role} candidate</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-medium text-[#C2414B] hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 py-2.5 text-base font-medium rounded-lg ${
                  isActive(link.path)
                    ? 'text-[#3157D5] bg-[#3157D5]/10 font-semibold'
                    : 'text-[#172033] hover:bg-[#F6F8FC]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-[#E4E8F0] flex flex-col gap-2">
              <Link to="/login" className="w-full">
                <Button variant="outline" size="md" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button variant="primary" size="md" className="w-full justify-center" icon={ArrowRight} iconPosition="right">
                  Create Free Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
