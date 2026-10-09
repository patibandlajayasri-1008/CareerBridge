import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E4E8F0] p-8 shadow-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#C2414B] flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#14213D] tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs text-[#667085] leading-relaxed">
                An unexpected interface error occurred. Our placement engineering system has logged the event.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={RefreshCw}
                onClick={this.handleReload}
                className="w-full sm:w-auto justify-center"
              >
                Reload Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Home}
                onClick={this.handleReset}
                className="w-full sm:w-auto justify-center"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
