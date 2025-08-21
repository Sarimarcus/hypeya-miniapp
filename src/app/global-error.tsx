'use client';

import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Error de aplicación
              </CardTitle>
              <CardDescription>
                Ocurrió un error crítico. Reinicia la aplicación.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={reset}
                  className="w-full"
                  variant="default"
                >
                  Reiniciar aplicación
                </Button>

                <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir al inicio
                </Button>
              </div>

              {error.digest && (
                <p className="text-xs text-gray-500 text-center">ID de error: {error.digest}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
