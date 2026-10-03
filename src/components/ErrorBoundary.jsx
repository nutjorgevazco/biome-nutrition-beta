import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm m-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Se detectó una discrepancia al mostrar este expediente</h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">
            {this.state.error?.message || "Ocurrió un error inesperado al renderizar los datos del paciente."}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
            {this.props.fallbackAction && (
              <button
                onClick={this.props.fallbackAction}
                className="btn-primary py-2.5 px-4 text-xs flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a la lista
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
