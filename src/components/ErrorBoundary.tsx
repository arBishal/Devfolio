import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { FOCUS_CARET } from "@/utils/focusStyles";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback; defaults to the themed error screen below. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render/lifecycle errors in its subtree so a single throwing renderer
 * degrades to a recoverable message instead of unmounting the whole app to a
 * blank screen. Must be a class component — React has no hook equivalent.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for diagnostics; the UI still degrades gracefully via render().
    console.error("Uncaught error in view:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="bg-t-bg text-t-text font-mono min-h-dvh flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-t-error text-lg">Something went wrong.</p>
          <p className="text-t-muted text-sm">
            This view hit an unexpected error. Reloading usually fixes it; your
            theme and preferences are saved.
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 bg-t-accent text-t-btn-text rounded hover:opacity-80 transition-colors cursor-pointer ${FOCUS_CARET}`}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
