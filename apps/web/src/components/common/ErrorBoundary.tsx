import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Coffee, RotateCcw } from 'lucide-react';
import { BrandButton } from '@/components/ui/BrandButton';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Sharon Tea ErrorBoundary] Uncaught rendering error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-brand-cream text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-brand-burgundy/10 shadow-warm-lg flex flex-col items-center">
            {/* Branded Cup Icon with pulse */}
            <div className="w-16 h-16 rounded-2xl bg-brand-burgundy/10 text-brand-burgundy flex items-center justify-center mb-6 border border-brand-burgundy/15">
              <Coffee className="w-8 h-8 text-brand-burgundy animate-pulse" />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-3">
              {this.props.fallbackTitle || 'Brewing momentarily delayed'}
            </h2>

            <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
              {this.props.fallbackMessage ||
                "We encountered a slight hiccup while pouring this page. Don't worry, your tea will be ready shortly."}
            </p>

            <BrandButton
              variant="primary"
              size="md"
              onClick={this.handleReload}
              icon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-warm"
            >
              Reload Page
            </BrandButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
