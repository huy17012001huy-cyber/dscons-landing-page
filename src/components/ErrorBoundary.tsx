import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500">
          <h2 className="font-bold text-lg mb-2">Đã xảy ra lỗi hiển thị (Crash)!</h2>
          <p className="font-mono text-sm break-words mb-4">{this.state.error?.message}</p>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-bold"
            onClick={() => {
              // Delete cache and reload
              localStorage.removeItem("dscons_comparison_draft");
              window.location.reload();
            }}
          >
            Reset dữ liệu & Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
