'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-slate-100 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">Ops! Algo deu errado.</h1>
            <p className="mb-6 text-sm text-slate-500">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página ou contate o suporte.
            </p>
            <div className="mb-6 rounded bg-slate-100 p-4 text-left text-xs text-slate-700 overflow-auto max-h-32">
              <code>{this.state.error?.message}</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
