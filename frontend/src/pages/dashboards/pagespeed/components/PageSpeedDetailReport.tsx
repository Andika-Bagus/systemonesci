import { useEffect, useState } from 'react';
import { pageSpeedAPI, websiteAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PageSpeedDetailReport = () => {
  const [lcpData, setLcpData] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [holdingFilter, setHoldingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pageSpeedRes, websitesRes] = await Promise.all([
        pageSpeedAPI.getAll(),
        websiteAPI.getAll(),
      ]);
      setLcpData(pageSpeedRes.data);
      setWebsites(websitesRes.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data PageSpeed');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = lcpData.filter((item: any) => {
    const website = websites.find(w => w.id === item.website_id);
    if (!website) return false;

    // Search filter
    if (searchTerm && !website.url.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Holding filter
    if (holdingFilter && website.holding !== holdingFilter) {
      return false;
    }

    // Status filter
    if (statusFilter) {
      const meetsStandard = item.desktop_lcp && item.mobile_lcp && item.desktop_lcp < 4 && item.mobile_lcp < 4;
      if (statusFilter === 'good' && !meetsStandard) return false;
      if (statusFilter === 'bad' && meetsStandard) return false;
    }

    return true;
  });

  const uniqueHoldings = [...new Set(websites.map(w => w.holding))].filter(Boolean);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, endIdx);

  const getLCPStatus = (desktop_lcp: number | null, mobile_lcp: number | null) => {
    if (!desktop_lcp && !mobile_lcp) {
      return { status: 'Belum Ada Data', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400', icon: '—' };
    }
    if (desktop_lcp && mobile_lcp && desktop_lcp < 4 && mobile_lcp < 4) {
      return { status: 'Memenuhi Standar', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', icon: '✓' };
    }
    return { status: 'Perlu Perbaikan', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', icon: '⚠' };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-neutral-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          Laporan Detail PageSpeed
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari website..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={holdingFilter} onValueChange={(value) => {
              setHoldingFilter(value === 'all' ? '' : value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 w-48">
                <SelectValue placeholder="Semua Holding" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Semua Holding</SelectItem>
                {uniqueHoldings.map(holding => (
                  <SelectItem key={holding} value={holding}>{holding}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value === 'all' ? '' : value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="good">Memenuhi Standar (&lt;4s)</SelectItem>
                <SelectItem value="bad">Perlu Perbaikan (≥4s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p className="text-sm">Tidak ada data website</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-800 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-12 font-bold text-neutral-700 dark:text-neutral-300">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Website</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Desktop LCP</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Mobile LCP</TableHead>
                    <TableHead className="text-center font-bold text-neutral-700 dark:text-neutral-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item: any, index: number) => {
                    const website = websites.find(w => w.id === item.website_id);
                    const statusInfo = getLCPStatus(item.desktop_lcp, item.mobile_lcp);

                    return (
                      <TableRow key={item.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">{startIdx + index + 1}</TableCell>
                        <TableCell className="font-medium text-neutral-700 dark:text-neutral-300">
                          <a href={website?.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs">
                            {website?.url || 'Unknown'}
                          </a>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.desktop_lcp ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.desktop_lcp < 4 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                              {item.desktop_lcp}s
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.mobile_lcp ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.mobile_lcp < 4 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                              {item.mobile_lcp}s
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                            {statusInfo.icon} {statusInfo.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Menampilkan {startIdx + 1} - {Math.min(endIdx, filteredData.length)} dari {filteredData.length} website
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Sebelumnya
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PageSpeedDetailReport;
