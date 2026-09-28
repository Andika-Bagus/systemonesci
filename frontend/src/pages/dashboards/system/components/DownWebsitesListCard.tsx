import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Clock, ExternalLink } from 'lucide-react';
import api from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function DownWebsitesListCard() {
  const [downWebsites, setDownWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownWebsites = async () => {
      try {
        const response = await api.get('/uptime/all-status');
        const data = response.data;
        const offline = data.filter((s: any) => s.status === 'down');
        
        // Sort by check time (newest first)
        offline.sort((a: any, b: any) => {
          if (!a.last_checked) return 1;
          if (!b.last_checked) return -1;
          return new Date(b.last_checked).getTime() - new Date(a.last_checked).getTime();
        });
        
        setDownWebsites(offline.slice(0, 10)); // Take top 10
      } catch (error) {
        console.error('Error fetching down websites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownWebsites();
    const interval = setInterval(fetchDownWebsites, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLastChecked = (dateString: string | null) => {
    if (!dateString) return 'Belum dicek';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    return `${Math.floor(diffMins / 60)} jam lalu`;
  };

  return (
    <Card className="h-full border-rose-100 dark:border-rose-900/30">
      <CardHeader className="border-b border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-5 h-5" />
            Website Down Saat Ini ({downWebsites.length})
          </CardTitle>
          <Link to="/uptime-monitor" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Lihat Semua <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-40">Loading...</div>
        ) : downWebsites.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-emerald-600 dark:text-emerald-500">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="font-semibold">Semua Website Online!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                  <TableHead>URL</TableHead>
                  <TableHead className="text-center">HTTP Code</TableHead>
                  <TableHead className="text-right">Waktu Check</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downWebsites.map((site, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-rose-600 dark:text-rose-400">
                      <a href={site.url.startsWith('http') ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {site.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                        {site.http_code || 'Timeout/Error'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm flex justify-end items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatLastChecked(site.last_checked)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Need to import CheckCircle here since I used it inside
import { CheckCircle } from 'lucide-react';
