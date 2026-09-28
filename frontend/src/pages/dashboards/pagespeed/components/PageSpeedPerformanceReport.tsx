import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, AlertCircle, Target, Building2, LayoutTemplate, Megaphone, ShieldCheck, ChevronDown } from 'lucide-react';

interface WebsiteInfo {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
  pic?: string;
}

interface PageSpeedRecord {
  id: number;
  website_id: number;
  desktop_lcp: number | null;
  mobile_lcp: number | null;
  desktop_performance_score: number | null;
  mobile_performance_score: number | null;
  checked_at: string;
  website?: WebsiteInfo;
}

interface PageSpeedPerformanceReportProps {
  records: PageSpeedRecord[];
}

const getScoreColor = (score: number | null) => {
  if (score === null) return 'text-slate-400';
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-500';
  if (score >= 50) return 'text-amber-500 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-500';
};

const getScoreBgColor = (score: number | null) => {
  if (score === null) return 'bg-slate-200 dark:bg-slate-700';
  if (score >= 90) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
  if (score >= 50) return 'bg-gradient-to-r from-amber-400 to-amber-500';
  return 'bg-gradient-to-r from-rose-400 to-rose-500';
};

const getScoreLabel = (score: number | null) => {
  if (score === null) return 'Tidak ada data';
  if (score >= 90) return 'Sangat Baik (Cepat)';
  if (score >= 50) return 'Perlu Peningkatan';
  return 'Buruk (Lambat)';
};

const PageSpeedPerformanceReport: React.FC<PageSpeedPerformanceReportProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState('top-worst');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Kalkulasi statistik
  const stats = useMemo(() => {
    let totalAnalyzed = 0;
    let berpotensiImprove = 0;
    let perluPrioritas = 0;
    let totalScore = 0;

    records.forEach(r => {
      const desk = Number(r.desktop_performance_score);
      const mob = Number(r.mobile_performance_score);
      if (!isNaN(desk) || !isNaN(mob)) {
        totalAnalyzed++;
        const avg = ((isNaN(desk) ? 0 : desk) + (isNaN(mob) ? 0 : mob)) / ((isNaN(desk) ? 1 : 0) + (isNaN(mob) ? 1 : 0) || 1);
        
        if (avg >= 50 && avg < 90) berpotensiImprove++;
        if (avg < 50) perluPrioritas++;
        
        totalScore += avg;
      }
    });

    const avgScore = totalAnalyzed > 0 ? totalScore / totalAnalyzed : 0;
    const potensiPeningkatan = Math.round(100 - avgScore);

    return { totalAnalyzed, berpotensiImprove, perluPrioritas, potensiPeningkatan };
  }, [records]);

  // Ranking calculation
  const rankedRecords = useMemo(() => {
    return [...records]
      .filter(r => r.desktop_performance_score !== null || r.mobile_performance_score !== null)
      .map(r => {
        const desk = Number(r.desktop_performance_score) || 0;
        const mob = Number(r.mobile_performance_score) || 0;
        const count = (r.desktop_performance_score !== null ? 1 : 0) + (r.mobile_performance_score !== null ? 1 : 0) || 1;
        return {
          ...r,
          avgScore: (desk + mob) / count
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [records]);

  const top10 = rankedRecords.slice(0, 10);
  const worst10 = [...rankedRecords].reverse().slice(0, 10);

  // Holding Breakdown
  const holdingBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; deskTotal: number; deskCount: number; mobTotal: number; mobCount: number; websites: PageSpeedRecord[] }>();
    records.forEach(r => {
      const holding = r.website?.holding || 'Lainnya';
      if (!map.has(holding)) map.set(holding, { count: 0, deskTotal: 0, deskCount: 0, mobTotal: 0, mobCount: 0, websites: [] });
      const stat = map.get(holding)!;
      stat.count++;
      stat.websites.push(r);
      
      const desk = Number(r.desktop_performance_score);
      if (!isNaN(desk) && r.desktop_performance_score !== null) {
        stat.deskTotal += desk;
        stat.deskCount++;
      }
      const mob = Number(r.mobile_performance_score);
      if (!isNaN(mob) && r.mobile_performance_score !== null) {
        stat.mobTotal += mob;
        stat.mobCount++;
      }
    });

    return Array.from(map.entries()).map(([holding, stat]) => ({
      holding,
      count: stat.count,
      avgDesk: stat.deskCount > 0 ? stat.deskTotal / stat.deskCount : null,
      avgMob: stat.mobCount > 0 ? stat.mobTotal / stat.mobCount : null,
      websites: stat.websites,
    })).sort((a, b) => b.count - a.count);
  }, [records]);

  // Jenis Breakdown
  const jenisBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; deskTotal: number; deskCount: number; mobTotal: number; mobCount: number; websites: PageSpeedRecord[] }>();
    records.forEach(r => {
      const jenis = r.website?.jenis_website || 'Lainnya';
      if (!map.has(jenis)) map.set(jenis, { count: 0, deskTotal: 0, deskCount: 0, mobTotal: 0, mobCount: 0, websites: [] });
      const stat = map.get(jenis)!;
      stat.count++;
      stat.websites.push(r);
      
      const desk = Number(r.desktop_performance_score);
      if (!isNaN(desk) && r.desktop_performance_score !== null) {
        stat.deskTotal += desk;
        stat.deskCount++;
      }
      const mob = Number(r.mobile_performance_score);
      if (!isNaN(mob) && r.mobile_performance_score !== null) {
        stat.mobTotal += mob;
        stat.mobCount++;
      }
    });

    return Array.from(map.entries()).map(([jenis, stat]) => ({
      jenis,
      count: stat.count,
      avgDesk: stat.deskCount > 0 ? stat.deskTotal / stat.deskCount : null,
      avgMob: stat.mobCount > 0 ? stat.mobTotal / stat.mobCount : null,
      websites: stat.websites,
    })).sort((a, b) => b.count - a.count);
  }, [records]);

  // Impact Breakdown (Ads vs No Ads)
  const impactBreakdown = useMemo(() => {
    const stat = {
      withAds: { count: 0, deskTotal: 0, deskCount: 0, mobTotal: 0, mobCount: 0, websites: [] as PageSpeedRecord[] },
      noAds: { count: 0, deskTotal: 0, deskCount: 0, mobTotal: 0, mobCount: 0, websites: [] as PageSpeedRecord[] },
    };

    records.forEach(r => {
      const target = r.website?.has_ads ? stat.withAds : stat.noAds;
      target.count++;
      target.websites.push(r);
      
      const desk = Number(r.desktop_performance_score);
      if (!isNaN(desk) && r.desktop_performance_score !== null) {
        target.deskTotal += desk;
        target.deskCount++;
      }
      const mob = Number(r.mobile_performance_score);
      if (!isNaN(mob) && r.mobile_performance_score !== null) {
        target.mobTotal += mob;
        target.mobCount++;
      }
    });

    return {
      withAds: {
        count: stat.withAds.count,
        avgDesk: stat.withAds.deskCount > 0 ? stat.withAds.deskTotal / stat.withAds.deskCount : null,
        avgMob: stat.withAds.mobCount > 0 ? stat.withAds.mobTotal / stat.withAds.mobCount : null,
        websites: stat.withAds.websites,
      },
      noAds: {
        count: stat.noAds.count,
        avgDesk: stat.noAds.deskCount > 0 ? stat.noAds.deskTotal / stat.noAds.deskCount : null,
        avgMob: stat.noAds.mobCount > 0 ? stat.noAds.mobTotal / stat.noAds.mobCount : null,
        websites: stat.noAds.websites,
      }
    };
  }, [records]);

  const ListItem = ({ record, rank }: { record: any; rank: number }) => (
    <div
      className="flex items-center gap-4 p-4 border-b border-neutral-100/60 dark:border-neutral-800/40 last:border-0 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.04] transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${rank * 40}ms` }}
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 text-neutral-500 dark:text-neutral-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
        #{rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a href={record.website?.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-800 dark:text-neutral-200 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            {record.website?.url || 'Unknown URL'}
          </a>
          {record.website?.has_ads && (
            <span className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200/50 dark:border-rose-800/40">
              Iklan
            </span>
          )}
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {record.website?.holding || '-'} • {record.website?.jenis_website || '-'}
        </div>
      </div>
      <div className="flex items-center gap-5 text-center shrink-0">
        <div>
          <div className={`font-black text-lg leading-none ${getScoreColor(record.desktop_performance_score)}`}>
            {record.desktop_performance_score !== null ? Math.round(Number(record.desktop_performance_score)) : '-'}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1.5 uppercase font-semibold tracking-wide">Desktop</div>
        </div>
        <div className="w-px h-8 bg-neutral-200/60 dark:bg-neutral-700/40" />
        <div>
          <div className={`font-black text-lg leading-none ${getScoreColor(record.mobile_performance_score)}`}>
            {record.mobile_performance_score !== null ? Math.round(Number(record.mobile_performance_score)) : '-'}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1.5 uppercase font-semibold tracking-wide">Mobile</div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="glass-card glow-border shadow-xl border border-neutral-200/40 dark:border-neutral-800/30 overflow-hidden mt-8 rounded-2xl animate-slide-up">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 shadow-md">
            <BarChart3 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 tracking-tight">Laporan Detail PageSpeed</h2>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '3s' }} />
            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="text-4xl font-black tracking-tight">{stats.totalAnalyzed}</div>
              </div>
              <div className="text-blue-100 text-sm font-medium">Total Dianalisis</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 animate-slide-up" style={{ animationDelay: '80ms' }}>
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '4s' }} />
            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-4xl font-black tracking-tight">{stats.berpotensiImprove}</div>
              </div>
              <div className="text-orange-100 text-sm font-medium">Berpotensi Improve</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 animate-slide-up" style={{ animationDelay: '160ms' }}>
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '5s' }} />
            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-4xl font-black tracking-tight">{stats.perluPrioritas}</div>
              </div>
              <div className="text-rose-100 text-sm font-medium">Perlu Prioritas</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl smooth-hover bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 animate-slide-up" style={{ animationDelay: '240ms' }}>
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.07] rounded-full animate-float" style={{ animationDelay: '3.5s' }} />
            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-4xl font-black tracking-tight">+-{stats.potensiPeningkatan}</div>
              </div>
              <div className="text-emerald-100 text-sm font-medium">Potensi Peningkatan</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between bg-neutral-100/80 dark:bg-neutral-800/60 rounded-2xl p-1.5 mb-8 backdrop-blur-sm border border-neutral-200/30 dark:border-neutral-700/30 shadow-inner">
          <button
            onClick={() => setActiveTab('top-worst')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'top-worst' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" /> Top & Worst
            </div>
          </button>
          <button
            onClick={() => setActiveTab('holding')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'holding' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Holding
          </button>
          <button
            onClick={() => setActiveTab('jenis')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'jenis' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Jenis
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'impact' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Impact
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'top-worst' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Top 10 */}
            <div className="glass-card rounded-2xl overflow-hidden border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg">
              <div className="bg-neutral-50/60 dark:bg-neutral-900/40 px-6 py-4 border-b border-neutral-200/40 dark:border-neutral-800/30 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30" />
                  Top 10 Performa Terbaik
                </h3>
              </div>
              <div className="divide-y divide-neutral-100/60 dark:divide-neutral-800/40">
                {top10.length > 0 ? (
                  top10.map((record, index) => (
                    <ListItem key={record.id} record={record} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-10 text-center text-neutral-500 font-medium animate-fade-in">Belum ada data</div>
                )}
              </div>
            </div>

            {/* Worst 10 */}
            <div className="glass-card rounded-2xl overflow-hidden border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg">
              <div className="bg-neutral-50/60 dark:bg-neutral-900/40 px-6 py-4 border-b border-neutral-200/40 dark:border-neutral-800/30 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 shadow-sm shadow-rose-500/30" />
                  Top 10 Performa Terburuk
                </h3>
              </div>
              <div className="divide-y divide-neutral-100/60 dark:divide-neutral-800/40">
                {worst10.length > 0 ? (
                  worst10.map((record, index) => (
                    <ListItem key={record.id} record={record} rank={index + 1} />
                  ))
                ) : (
                  <div className="p-10 text-center text-neutral-500 font-medium animate-fade-in">Belum ada data</div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'holding' && (
          <div className="space-y-4 animate-fade-in">
            {holdingBreakdown.map((h, idx) => {
              const isExpanded = expandedGroup === `holding-${h.holding}`;
              return (
                <div
                  key={h.holding}
                  className="glass-card glow-border rounded-2xl border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg hover:shadow-xl transition-all duration-400 group overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div 
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 sm:px-8 cursor-pointer select-none"
                    onClick={() => setExpandedGroup(isExpanded ? null : `holding-${h.holding}`)}
                  >
                    <div className="flex items-center gap-5 min-w-[150px] flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-400 shadow-md shadow-blue-500/10">
                        <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xl text-neutral-800 dark:text-neutral-100 truncate tracking-tight">{h.holding}</h4>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1 truncate">{h.count} Website Dianalisis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto lg:shrink-0">
                      <div className="flex flex-col sm:flex-row w-full gap-4 glass-card px-5 sm:px-6 py-4 rounded-2xl flex-1 lg:flex-none lg:min-w-[320px] bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-700/30">
                        {/* Desktop Score Bar */}
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Desktop</span>
                            <span className={`text-lg font-black ${getScoreColor(h.avgDesk)}`}>{h.avgDesk !== null ? Math.round(h.avgDesk) : '-'} <span className="text-xs text-neutral-400 font-medium">/ 100</span></span>
                          </div>
                          <div className="w-full h-2.5 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1.5 shadow-inner">
                            <div className={`h-full rounded-full ${getScoreBgColor(h.avgDesk)} transition-all duration-1000 ease-out`} style={{ width: `${h.avgDesk !== null ? Math.round(h.avgDesk) : 0}%` }}></div>
                          </div>
                          <span className="text-[10px] font-semibold text-neutral-500 truncate">{getScoreLabel(h.avgDesk)}</span>
                        </div>

                        <div className="w-px bg-neutral-200/40 dark:bg-neutral-700/30 hidden sm:block"></div>
                        <div className="h-px w-full bg-neutral-200/40 dark:bg-neutral-700/30 sm:hidden block my-1"></div>

                        {/* Mobile Score Bar */}
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Mobile</span>
                            <span className={`text-lg font-black ${getScoreColor(h.avgMob)}`}>{h.avgMob !== null ? Math.round(h.avgMob) : '-'} <span className="text-xs text-neutral-400 font-medium">/ 100</span></span>
                          </div>
                          <div className="w-full h-2.5 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1.5 shadow-inner">
                            <div className={`h-full rounded-full ${getScoreBgColor(h.avgMob)} transition-all duration-1000 ease-out`} style={{ width: `${h.avgMob !== null ? Math.round(h.avgMob) : 0}%` }}></div>
                          </div>
                          <span className="text-[10px] font-semibold text-neutral-500 truncate">{getScoreLabel(h.avgMob)}</span>
                        </div>
                      </div>
                      
                      {/* Chevron */}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 shrink-0 text-neutral-400 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100/60 dark:border-neutral-800/40 p-5 bg-neutral-50/30 dark:bg-neutral-900/30 backdrop-blur-sm animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {h.websites.sort((a, b) => ((b.mobile_performance_score || 0) + (b.desktop_performance_score || 0)) - ((a.mobile_performance_score || 0) + (a.desktop_performance_score || 0))).map(web => (
                          <div key={web.id} className="flex flex-col p-4 glass-card rounded-xl border border-neutral-200/30 dark:border-neutral-700/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <div className="truncate text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3" title={web.website?.url}>
                              {web.website?.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase text-neutral-400 w-12">Desktop</span>
                                <span className={`text-sm font-black ${getScoreColor(web.desktop_performance_score)}`}>{web.desktop_performance_score !== null ? Math.round(web.desktop_performance_score) : '-'}</span>
                              </div>
                              <div className="w-px h-4 bg-neutral-200/40 dark:bg-neutral-700/30"></div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase text-neutral-400 w-12">Mobile</span>
                                <span className={`text-sm font-black ${getScoreColor(web.mobile_performance_score)}`}>{web.mobile_performance_score !== null ? Math.round(web.mobile_performance_score) : '-'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {holdingBreakdown.length === 0 && (
              <div className="p-12 text-center text-neutral-500 font-medium animate-fade-in">Belum ada data</div>
            )}
          </div>
        )}

        {activeTab === 'jenis' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 animate-fade-in">
            {jenisBreakdown.map((j, idx) => {
              const isExpanded = expandedGroup === `jenis-${j.jenis}`;
              return (
                <div
                  key={j.jenis}
                  className={`glass-card glow-border rounded-2xl border border-neutral-200/40 dark:border-neutral-800/30 shadow-lg hover:shadow-xl transition-all duration-400 group overflow-hidden animate-slide-up ${isExpanded ? 'xl:col-span-2' : ''}`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div 
                    className="p-5 sm:p-6 cursor-pointer select-none flex flex-col xl:flex-row xl:items-center justify-between gap-4 xl:gap-6"
                    onClick={() => setExpandedGroup(isExpanded ? null : `jenis-${j.jenis}`)}
                  >
                    <div className="flex items-center gap-4 min-w-[120px] flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-400 shadow-md shadow-indigo-500/10">
                        <LayoutTemplate className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 truncate tracking-tight">{j.jenis}</h4>
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 truncate">{j.count} Website Dianalisis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full xl:w-auto xl:shrink-0">
                      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 glass-card rounded-2xl border border-neutral-200/30 dark:border-neutral-700/30 bg-neutral-50/60 dark:bg-neutral-900/40 flex-1 xl:flex-none xl:min-w-[260px]">
                        {/* Desktop Score Bar */}
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Avg Desktop</span>
                            <span className={`text-base font-black ${getScoreColor(j.avgDesk)}`}>{j.avgDesk !== null ? Math.round(j.avgDesk) : '-'}</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1 shadow-inner">
                            <div className={`h-full rounded-full ${getScoreBgColor(j.avgDesk)} transition-all duration-1000 ease-out`} style={{ width: `${j.avgDesk !== null ? Math.round(j.avgDesk) : 0}%` }}></div>
                          </div>
                          <span className="text-[9px] font-semibold text-neutral-500 truncate">{getScoreLabel(j.avgDesk)}</span>
                        </div>

                        <div className="w-full sm:w-px h-px sm:h-auto bg-neutral-200/40 dark:bg-neutral-700/30 shrink-0"></div>

                        {/* Mobile Score Bar */}
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Avg Mobile</span>
                            <span className={`text-base font-black ${getScoreColor(j.avgMob)}`}>{j.avgMob !== null ? Math.round(j.avgMob) : '-'}</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1 shadow-inner">
                            <div className={`h-full rounded-full ${getScoreBgColor(j.avgMob)} transition-all duration-1000 ease-out`} style={{ width: `${j.avgMob !== null ? Math.round(j.avgMob) : 0}%` }}></div>
                          </div>
                          <span className="text-[9px] font-semibold text-neutral-500 truncate">{getScoreLabel(j.avgMob)}</span>
                        </div>
                      </div>
                      
                      {/* Chevron */}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 shrink-0 text-neutral-400 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100/60 dark:border-neutral-800/40 p-6 bg-neutral-50/30 dark:bg-neutral-900/30 backdrop-blur-sm animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {j.websites.sort((a, b) => ((b.mobile_performance_score || 0) + (b.desktop_performance_score || 0)) - ((a.mobile_performance_score || 0) + (a.desktop_performance_score || 0))).map(web => (
                          <div key={web.id} className="flex flex-col p-4 glass-card rounded-xl border border-neutral-200/30 dark:border-neutral-700/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <div className="truncate text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3" title={web.website?.url}>
                              {web.website?.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-semibold uppercase text-neutral-400">Desktop</span>
                                <span className={`text-base font-black ${getScoreColor(web.desktop_performance_score)}`}>{web.desktop_performance_score !== null ? Math.round(web.desktop_performance_score) : '-'}</span>
                              </div>
                              <div className="w-px h-8 bg-neutral-200/40 dark:bg-neutral-700/30"></div>
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-semibold uppercase text-neutral-400">Mobile</span>
                                <span className={`text-base font-black ${getScoreColor(web.mobile_performance_score)}`}>{web.mobile_performance_score !== null ? Math.round(web.mobile_performance_score) : '-'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {jenisBreakdown.length === 0 && (
              <div className="col-span-full p-12 text-center text-neutral-500 font-medium animate-fade-in">Belum ada data</div>
            )}
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-800/30 p-5 flex items-start gap-4 animate-slide-up">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md shadow-blue-500/10 shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Bagaimana Iklan Mempengaruhi Performa?</h4>
                <p className="text-blue-700/80 dark:text-blue-400/80 text-xs mt-1 leading-relaxed">
                  Data di bawah membandingkan rata-rata skor performa antara website yang <strong>memasang iklan</strong> dengan website yang <strong>bersih dari iklan</strong>. Anda dapat melihat secara jelas dampak penurunan skor (jika ada) yang diakibatkan oleh *script* pihak ketiga atau iklan yang memblokir rendering halaman.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dengan Iklan */}
              <div className="glass-card rounded-[2rem] border border-rose-200/40 dark:border-rose-800/30 p-8 bg-gradient-to-b from-white/80 to-rose-50/30 dark:from-neutral-900/60 dark:to-rose-950/20 hover:shadow-2xl hover:shadow-rose-200/30 dark:hover:shadow-rose-900/20 transition-all duration-400 relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0ms' }}>
                <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] dark:opacity-10 group-hover:opacity-[0.05] dark:group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                  <Megaphone className="w-48 h-48 text-rose-600" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/40 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/15 group-hover:-rotate-6 transition-transform duration-400">
                    <Megaphone className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 mb-2 tracking-tight">Dengan Iklan</h3>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-8">{impactBreakdown.withAds.count} Website Dianalisis</p>
                  
                  <div className="flex flex-col gap-6 p-6 glass-card rounded-[1.5rem] border border-neutral-200/30 dark:border-neutral-700/30">
                    {/* Desktop */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Rata-rata Desktop</span>
                        <span className={`text-2xl font-black ${getScoreColor(impactBreakdown.withAds.avgDesk)}`}>{impactBreakdown.withAds.avgDesk !== null ? Math.round(impactBreakdown.withAds.avgDesk) : '-'} <span className="text-xs text-neutral-400 font-medium">/ 100</span></span>
                      </div>
                      <div className="w-full h-3 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1.5 shadow-inner">
                        <div className={`h-full rounded-full ${getScoreBgColor(impactBreakdown.withAds.avgDesk)} transition-all duration-1000 ease-out`} style={{ width: `${impactBreakdown.withAds.avgDesk !== null ? Math.round(impactBreakdown.withAds.avgDesk) : 0}%` }}></div>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500">{getScoreLabel(impactBreakdown.withAds.avgDesk)}</span>
                    </div>

                    <div className="w-full h-px bg-neutral-200/40 dark:bg-neutral-700/30"></div>
                    
                    {/* Mobile */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Rata-rata Mobile</span>
                        <span className={`text-2xl font-black ${getScoreColor(impactBreakdown.withAds.avgMob)}`}>{impactBreakdown.withAds.avgMob !== null ? Math.round(impactBreakdown.withAds.avgMob) : '-'} <span className="text-xs text-neutral-400 font-medium">/ 100</span></span>
                      </div>
                      <div className="w-full h-3 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1.5 shadow-inner">
                        <div className={`h-full rounded-full ${getScoreBgColor(impactBreakdown.withAds.avgMob)} transition-all duration-1000 ease-out`} style={{ width: `${impactBreakdown.withAds.avgMob !== null ? Math.round(impactBreakdown.withAds.avgMob) : 0}%` }}></div>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500">{getScoreLabel(impactBreakdown.withAds.avgMob)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tanpa Iklan */}
              <div className="glass-card rounded-[2rem] border border-emerald-200/40 dark:border-emerald-800/30 p-8 bg-gradient-to-b from-white/80 to-emerald-50/30 dark:from-neutral-900/60 dark:to-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-200/30 dark:hover:shadow-emerald-900/20 transition-all duration-400 relative overflow-hidden group animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] dark:opacity-10 group-hover:opacity-[0.05] dark:group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                  <ShieldCheck className="w-48 h-48 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/15 group-hover:rotate-6 transition-transform duration-400">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 mb-2 tracking-tight">Tanpa Iklan</h3>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-8">{impactBreakdown.noAds.count} Website Dianalisis</p>
                  
                  <div className="flex flex-col gap-6 p-6 glass-card rounded-[1.5rem] border border-neutral-200/30 dark:border-neutral-700/30">
                    {/* Desktop */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Rata-rata Desktop</span>
                        <span className={`text-2xl font-black ${getScoreColor(impactBreakdown.noAds.avgDesk)}`}>{impactBreakdown.noAds.avgDesk !== null ? Math.round(impactBreakdown.noAds.avgDesk) : '-'} <span className="text-xs text-neutral-400 font-medium">/ 100</span></span>
                      </div>
                      <div className="w-full h-3 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1.5 shadow-inner">
                        <div className={`h-full rounded-full ${getScoreBgColor(impactBreakdown.noAds.avgDesk)} transition-all duration-1000 ease-out`} style={{ width: `${impactBreakdown.noAds.avgDesk !== null ? Math.round(impactBreakdown.noAds.avgDesk) : 0}%` }}></div>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500">{getScoreLabel(impactBreakdown.noAds.avgDesk)}</span>
                    </div>

                    <div className="w-full h-px bg-neutral-200/40 dark:bg-neutral-700/30"></div>
                    
                    {/* Mobile */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Rata-rata Mobile</span>
                        <span className={`text-2xl font-black ${getScoreColor(impactBreakdown.noAds.avgMob)}`}>{impactBreakdown.noAds.avgMob !== null ? Math.round(impactBreakdown.noAds.avgMob) : '-'} <span className="text-xs text-neutral-400 font-medium">/ 100</span></span>
                      </div>
                      <div className="w-full h-3 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden mb-1.5 shadow-inner">
                        <div className={`h-full rounded-full ${getScoreBgColor(impactBreakdown.noAds.avgMob)} transition-all duration-1000 ease-out`} style={{ width: `${impactBreakdown.noAds.avgMob !== null ? Math.round(impactBreakdown.noAds.avgMob) : 0}%` }}></div>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500">{getScoreLabel(impactBreakdown.noAds.avgMob)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PageSpeedPerformanceReport;
