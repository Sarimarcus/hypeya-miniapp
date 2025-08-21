'use client';

// Offline page for when user has no internet connection
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Estás sin conexión
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Parece que no estás conectado a internet. No te preocupes, aún puedes ver artículos previamente cargados.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Mientras estás sin conexión:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ver artículos en caché</li>
              <li>• Ver contenido guardado</li>
              <li>• Usar la búsqueda</li>
            </ul>
          </div>
          
          <div className="text-xs text-gray-500">Tus datos se sincronizarán automáticamente cuando vuelvas a estar en línea.</div>
        </CardContent>
      </Card>
    </div>
  );
}
