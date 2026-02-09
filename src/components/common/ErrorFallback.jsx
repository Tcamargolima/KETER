import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

/**
 * Error Fallback UI Component
 * Displayed when ErrorBoundary catches an error
 */
function ErrorFallback({ error, errorInfo, onReset }) {
  const isDevelopment = import.meta.env.DEV;

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          Algo deu errado...
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 text-lg">
          Desculpe, encontramos um problema inesperado. Por favor, tente recarregar a página.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <RefreshCcw className="w-5 h-5" />
            Recarregar Página
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para Início
          </button>
        </div>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <details className="mt-8 bg-gray-50 rounded-lg p-6">
            <summary className="cursor-pointer font-semibold text-gray-700 mb-4">
              Detalhes do Erro (apenas em desenvolvimento)
            </summary>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-600 mb-2">Mensagem:</h3>
                <pre className="bg-red-50 p-4 rounded text-sm overflow-auto text-red-800">
                  {error.toString()}
                </pre>
              </div>
              {errorInfo?.componentStack && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Component Stack:</h3>
                  <pre className="bg-red-50 p-4 rounded text-xs overflow-auto text-red-800 max-h-64">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Support Message */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Se o problema persistir, entre em contato com nosso suporte em{' '}
            <a 
              href="mailto:suporte@keter.center" 
              className="text-purple-600 hover:underline font-medium"
            >
              suporte@keter.center
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
