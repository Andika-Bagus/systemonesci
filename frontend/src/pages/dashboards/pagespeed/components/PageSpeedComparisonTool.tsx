import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Trophy, AlertTriangle, ArrowRight, Zap, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WebsiteInfo {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
  pic?: string;
}

export interface PageSpeedRecordFull {
  id: number;
  website_id: number;
  desktop_performance_score: number | null;
  desktop_accessibility_score: number | null;
  desktop_best_practices_score: number | null;
  desktop_seo_score: number | null;
  desktop_lcp: number | null;
  desktop_fid: number | null;
  desktop_cls: number | null;
  mobile_performance_score: number | null;
  mobile_accessibility_score: number | null;
  mobile_best_practices_score: number | null;
  mobile_seo_score: number | null;
  mobile_lcp: number | null;
  mobile_fid: number | null;
  mobile_cls: number | null;
  checked_at: string;
  website?: WebsiteInfo;
}

interface PageSpeedComparisonToolProps {
  records: PageSpeedRecordFull[];
}

export default function PageSpeedComparisonTool({ records }: PageSpeedComparisonToolProps) {
  const [siteAId, setSiteAId] = useState<string>('');
  const [siteBId, setSiteBId] = useState<string>('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  const siteA = useMemo(() => records.find(r => r.website_id.toString() === siteAId), [records, siteAId]);
  const siteB = useMemo(() => records.find(r => r.website_id.toString() === siteBId), [records, siteBId]);

  const filteredRecordsA = useMemo(() => {
    if (!searchA) return records;
    return records.filter(r => r.website?.url.toLowerCase().includes(searchA.toLowerCase()));
  }, [records, searchA]);

  const filteredRecordsB = useMemo(() => {
    if (!searchB) return records;
    return records.filter(r => r.website?.url.toLowerCase().includes(searchB.toLowerCase()));
  }, [records, searchB]);

  // Comparison Helper
  const compare = (valA: number | null | undefined, valB: number | null | undefined, lowerIsBetter: boolean = false) => {
    if (valA == null && valB == null) return 'tie';
    if (valA == null) return 'b';
    if (valB == null) return 'a';
    
    if (valA === valB) return 'tie';
    
    if (lowerIsBetter) {
      return valA < valB ? 'a' : 'b';
    } else {
      return valA > valB ? 'a' : 'b';
    }
  };

  const getMetricData = (record: PageSpeedRecordFull | undefined, metricPrefix: string) => {
    if (!record) return null;
    const key = `${device}_${metricPrefix}` as keyof PageSpeedRecordFull;
    return record[key] as number | null;
  };

  const renderComparisonBar = (label: string, metricPrefix: string, lowerIsBetter: boolean = false, format: (v: number) => string = (v) => v.toString()) => {
    const valA = getMetricData(siteA, metricPrefix);
    const valB = getMetricData(siteB, metricPrefix);
    
    const winner = compare(valA, valB, lowerIsBetter);
    
    // Calculate percentage for progress bars
    let max = 100;
    if (lowerIsBetter) {
      max = Math.max((valA || 0), (valB || 0)) * 1.5 || 10;
    }
    
    const pctA = valA !== null ? (valA / max) * 100 : 0;
    const pctB = valB !== null ? (valB / max) * 100 : 0;

    return (
      <div className="mb-7 animate-fade-in">
        <div className="flex justify-between items-end mb-2.5">
          <div className={`text-sm font-bold w-24 text-left transition-colors duration-300 ${winner === 'a' ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
            {valA !== null ? format(valA) : '-'}
            {winner === 'a' && <Trophy className="w-3.5 h-3.5 inline ml-1.5 text-amber-500 animate-pulse-soft" />}
          </div>
          <div className="flex-1 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">{label}</div>
          <div className={`text-sm font-bold w-24 text-right transition-colors duration-300 ${winner === 'b' ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
            {winner === 'b' && <Trophy className="w-3.5 h-3.5 inline mr-1.5 text-amber-500 animate-pulse-soft" />}
            {valB !== null ? format(valB) : '-'}
          </div>
        </div>
        
        {/* Progress Bar Visual */}
        <div className="relative h-3.5 w-full bg-neutral-100/80 dark:bg-neutral-800/60 rounded-full overflow-hidden flex shadow-inner backdrop-blur-sm">
          {/* Left Side (A) */}
          <div className="w-1/2 flex justify-end bg-neutral-100/60 dark:bg-neutral-800/40 border-r border-neutral-200/60 dark:border-neutral-700/40">
            <div 
              className={`h-full rounded-r-full transition-all duration-1000 ease-out ${winner === 'a' ? (lowerIsBetter ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-gradient-to-r from-indigo-400 to-indigo-500 shadow-sm shadow-indigo-500/30') : 'bg-neutral-300/60 dark:bg-neutral-600/40'}`}
              style={{ width: `${Math.min(100, pctA)}%` }}
            />
          </div>
          {/* Right Side (B) */}
          <div className="w-1/2 flex justify-start bg-neutral-100/60 dark:bg-neutral-800/40 border-l border-neutral-200/60 dark:border-neutral-700/40">
            <div 
              className={`h-full rounded-l-full transition-all duration-1000 ease-out ${winner === 'b' ? (lowerIsBetter ? 'bg-gradient-to-l from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-gradient-to-l from-indigo-400 to-indigo-500 shadow-sm shadow-indigo-500/30') : 'bg-neutral-300/60 dark:bg-neutral-600/40'}`}
              style={{ width: `${Math.min(100, pctB)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const scoreA = getMetricData(siteA, 'performance_score');
  const scoreB = getMetricData(siteB, 'performance_score');
  const overallWinner = compare(scoreA, scoreB, false);

  return (
    <Card className="glass-card glow-border border border-neutral-200/40 dark:border-neutral-800/30 shadow-xl overflow-hidden animate-slide-up">
      <CardHeader className="border-b border-neutral-100/60 dark:border-neutral-800/40 pb-6 bg-neutral-50/40 dark:bg-neutral-900/20 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold text-neutral-800 dark:text-neutral-100">
              <span className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-md shadow-indigo-500/10 transition-transform duration-300 hover:scale-110">
                <ArrowRight className="w-5 h-5" />
              </span>
              Alat Perbandingan PageSpeed
            </CardTitle>
            <CardDescription className="mt-1.5 text-neutral-500">
              Bandingkan metrik performa secara head-to-head antara dua website
            </CardDescription>
          </div>
          
          <div className="flex bg-neutral-100/80 dark:bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-200/40 dark:border-neutral-800/30 shadow-sm z-10 backdrop-blur-sm">
            <button
              onClick={() => setDevice('mobile')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                device === 'mobile'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                device === 'desktop'
                  ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <Monitor className="w-4 h-4" /> Desktop
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 px-4 md:px-8">
        {/* Selection Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative z-10">
          
          {/* Website A Selector */}
          <div className="w-full md:w-[42%] glass-card p-6 rounded-2xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">Website A</div>
            <Select value={siteAId} onValueChange={setSiteAId}>
              <SelectTrigger className="h-12 bg-white/80 dark:bg-neutral-950/80 border-neutral-200/50 dark:border-neutral-700/40 rounded-xl font-medium shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700">
                <SelectValue placeholder="Pilih Website A..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-xl shadow-2xl backdrop-blur-xl border-neutral-200/40 dark:border-neutral-700/40">
                <div className="p-2 pb-1 sticky top-0 bg-white/95 dark:bg-neutral-950/95 z-10 border-b border-neutral-100/60 dark:border-neutral-800/40 mb-1 backdrop-blur-sm">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-neutral-400" />
                    <Input 
                      placeholder="Cari URL..." 
                      className="pl-9 h-9 text-sm border-none focus-visible:ring-0 shadow-none"
                      value={searchA}
                      onChange={(e) => setSearchA(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                {filteredRecordsA.map(r => (
                  <SelectItem key={`a-${r.website_id}`} value={r.website_id.toString()}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium truncate max-w-[200px] sm:max-w-[250px]">{r.website?.url}</span>
                      <span className="text-[10px] text-muted-foreground">{r.website?.holding}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {siteA && (
              <div className="mt-6 flex items-center justify-between animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <Badge variant="outline" className="w-fit text-[10px] py-0.5 bg-white/80 dark:bg-neutral-950/80 rounded-lg">{siteA.website?.holding}</Badge>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1 font-medium">
                    {siteA.website?.has_ads ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500"/> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>}
                    {siteA.website?.has_ads ? 'Ada Iklan' : 'Tanpa Iklan'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-neutral-400 font-bold tracking-[0.2em] mb-0.5">Skor Utama</div>
                  <div className={`text-5xl font-black tracking-tighter transition-colors duration-300 ${overallWinner === 'a' ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-sm' : 'text-neutral-700 dark:text-neutral-200'}`}>
                    {scoreA ?? '-'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VS Badge */}
          <div className="w-18 h-18 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-indigo-500/30 border-4 border-white dark:border-neutral-950 z-20 animate-glow transition-transform duration-300 hover:scale-110">
            VS
          </div>

          {/* Website B Selector */}
          <div className="w-full md:w-[42%] glass-card p-6 rounded-2xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3 text-right">Website B</div>
            <Select value={siteBId} onValueChange={setSiteBId}>
              <SelectTrigger className="h-12 bg-white/80 dark:bg-neutral-950/80 border-neutral-200/50 dark:border-neutral-700/40 rounded-xl font-medium shadow-sm text-right direction-rtl backdrop-blur-sm transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700">
                <SelectValue placeholder="...Pilih Website B" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-xl shadow-2xl backdrop-blur-xl border-neutral-200/40 dark:border-neutral-700/40">
                <div className="p-2 pb-1 sticky top-0 bg-white/95 dark:bg-neutral-950/95 z-10 border-b border-neutral-100/60 dark:border-neutral-800/40 mb-1 backdrop-blur-sm">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-neutral-400" />
                    <Input 
                      placeholder="Cari URL..." 
                      className="pl-9 h-9 text-sm border-none focus-visible:ring-0 shadow-none"
                      value={searchB}
                      onChange={(e) => setSearchB(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                {filteredRecordsB.map(r => (
                  <SelectItem key={`b-${r.website_id}`} value={r.website_id.toString()}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium truncate max-w-[200px] sm:max-w-[250px]">{r.website?.url}</span>
                      <span className="text-[10px] text-muted-foreground">{r.website?.holding}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {siteB && (
              <div className="mt-6 flex flex-row-reverse items-center justify-between animate-fade-in">
                <div className="flex flex-col gap-1.5 items-end">
                  <Badge variant="outline" className="w-fit text-[10px] py-0.5 bg-white/80 dark:bg-neutral-950/80 rounded-lg">{siteB.website?.holding}</Badge>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1 font-medium flex-row-reverse">
                    {siteB.website?.has_ads ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500"/> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>}
                    {siteB.website?.has_ads ? 'Ada Iklan' : 'Tanpa Iklan'}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase text-neutral-400 font-bold tracking-[0.2em] mb-0.5">Skor Utama</div>
                  <div className={`text-5xl font-black tracking-tighter transition-colors duration-300 ${overallWinner === 'b' ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-sm' : 'text-neutral-700 dark:text-neutral-200'}`}>
                    {scoreB ?? '-'}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Detailed Metrics Comparison */}
        {siteA && siteB && (
          <div className="mt-10 glass-card rounded-2xl p-6 md:p-10 border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg relative z-10 animate-slide-up">
            <h3 className="text-center font-bold text-sm text-neutral-600 dark:text-neutral-300 mb-10 flex items-center justify-center gap-2.5 uppercase tracking-[0.15em]">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              Rincian Metrik
            </h3>
            
            <div className="max-w-3xl mx-auto space-y-10">
              {/* Core Scores */}
              <div>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-6 flex items-center gap-2.5 border-b border-neutral-100/60 dark:border-neutral-800/40 pb-3">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> Kategori Utama 
                  <span className="text-neutral-400/60 text-[10px] lowercase font-medium ml-1">(Lebih Tinggi Lebih Baik)</span>
                </h4>
                {renderComparisonBar('Aksesibilitas', 'accessibility_score', false)}
                {renderComparisonBar('Best Practices', 'best_practices_score', false)}
                {renderComparisonBar('SEO', 'seo_score', false)}
              </div>
              
              {/* Web Vitals */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-6 flex items-center gap-2.5 border-b border-neutral-100/60 dark:border-neutral-800/40 pb-3">
                  <Monitor className="w-4 h-4 text-indigo-500" /> Core Web Vitals
                  <span className="text-neutral-400/60 text-[10px] lowercase font-medium ml-1">(Lebih Rendah Lebih Baik)</span>
                </h4>
                {renderComparisonBar('LCP (Detik)', 'lcp', true, (v) => `${v}s`)}
                {renderComparisonBar('FID (ms)', 'fid', true, (v) => `${v}ms`)}
                {renderComparisonBar('CLS', 'cls', true)}
              </div>
            </div>
          </div>
        )}
        
        {(!siteA || !siteB) && (
          <div className="mt-8 text-center text-sm text-neutral-500 pb-6 font-medium relative z-10 glass-card py-14 rounded-2xl border border-dashed border-neutral-300/60 dark:border-neutral-700/40 animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-neutral-400" />
            </div>
            Pilih Website A dan Website B untuk menampilkan rincian metrik yang lengkap.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
