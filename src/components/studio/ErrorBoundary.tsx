import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Studio Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="max-w-md w-full mx-4">
            <div className="bg-[#1a1a1a] border border-red-900/20 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>

              <h1 className="text-2xl font-semibold text-white mb-2">
                Something went wrong
              </h1>
              
              <p className="text-zinc-400 mb-6">
                The Studio encountered an unexpected error. Don't worry, your work is saved automatically.
              </p>

              {this.state.error && (
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 mb-6 text-left">
                  <p className="text-red-400 text-sm font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-white text-black hover:bg-zinc-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Studio
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 bg-transparent border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <p className="text-zinc-600 text-xs mt-6">
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
