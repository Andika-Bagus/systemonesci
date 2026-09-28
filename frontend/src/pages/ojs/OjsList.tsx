import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, ArrowRight, Home, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

export default function OjsList() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Layers}
        title="OJS Instances"
        subtitle="Kelola semua instance OJS Anda"
        iconColor="bg-blue-600"
        iconShadow="shadow-blue-200"
      />

      {/* Coming Soon Card */}
      <Card className="border-2 border-dashed">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-full border border-blue-200">
                <Zap className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">
                Fitur manajemen OJS Instances sedang dalam pengembangan. Kami akan segera meluncurkan fitur lengkap untuk memudahkan Anda mengelola semua instance OJS.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-2">📊</div>
                <p className="text-sm font-medium text-foreground">Monitor Status</p>
                <p className="text-xs text-muted-foreground mt-1">Pantau status semua instance OJS</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">⚙️</div>
                <p className="text-sm font-medium text-foreground">Kelola Konfigurasi</p>
                <p className="text-xs text-muted-foreground mt-1">Atur konfigurasi dengan mudah</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                <div className="text-2xl font-bold text-pink-600 mb-2">📈</div>
                <p className="text-sm font-medium text-foreground">Analytics</p>
                <p className="text-xs text-muted-foreground mt-1">Lihat performa instance</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex gap-3 justify-center mt-8">
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2">
                  <Home size={16} />
                  Kembali ke Dashboard
                </Button>
              </Link>
              <Button className="gap-2">
                Notifikasi Saya
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
