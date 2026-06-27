import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, ArrowRight, Home, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

export default function SopWebsList() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="SOP Web/LP"
        subtitle="Kelola semua SOP Web/LP Anda"
        iconColor="bg-cyan-600"
        iconShadow="shadow-cyan-200"
      />

      {/* Coming Soon Card */}
      <Card className="border-2 border-dashed">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-full border border-emerald-200">
                <Zap className="h-12 w-12 text-emerald-600" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">
                Fitur manajemen SOP Web/LP sedang dalam pengembangan. Kami akan segera meluncurkan fitur lengkap untuk memudahkan Anda mengelola semua SOP Web dan Landing Page.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600 mb-2">📋</div>
                <p className="text-sm font-medium text-foreground">Kelola SOP</p>
                <p className="text-xs text-muted-foreground mt-1">Atur SOP untuk setiap website</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                <div className="text-2xl font-bold text-teal-600 mb-2">🔄</div>
                <p className="text-sm font-medium text-foreground">Track Updates</p>
                <p className="text-xs text-muted-foreground mt-1">Pantau update terakhir</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                <div className="text-2xl font-bold text-cyan-600 mb-2">👥</div>
                <p className="text-sm font-medium text-foreground">Assign PIC</p>
                <p className="text-xs text-muted-foreground mt-1">Tetapkan PIC untuk setiap SOP</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex gap-3 justify-center mt-8">
              <Link to="/analytics">
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
