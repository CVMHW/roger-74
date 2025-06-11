
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.componentName || 'Unknown Component'
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">
            Component Error in {this.props.componentName || 'Unknown Component'}
          </h3>
          <p className="text-red-600 text-sm">
            This component failed to render. Please refresh the page.
          </p>
          {this.state.error && (
            <details className="mt-2">
              <summary className="text-red-700 cursor-pointer">Technical Details</summary>
              <pre className="text-xs mt-1 text-red-600 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
