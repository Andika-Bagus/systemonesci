import jsPDF from 'jspdf';
import { pageSpeedAPI, websiteAPI } from './api';

export interface WebsitePageSpeedData {
  id: number;
  url: string;
  holding: string;
  jenis_website: string;
  has_ads: boolean;
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
}

export interface ReportSummary {
  totalWebsites: number;
  averageDesktopScore: number;
  averageMobileScore: number;
  excellentCount: number;
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
}

/**
 * Get performance status
 */
const getPerformanceStatus = (score: number | null): 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'no-data' => {
  if (!score && score !== 0) return 'no-data';
  if (score >= 90) return 'excellent';
  if (score >= 50) return 'good';
  if (score >= 25) return 'needs-improvement';
  return 'poor';
};

/**
 * Calculate report summary
 */
const calculateSummary = (websites: WebsitePageSpeedData[]): ReportSummary => {
  const validWebsites = websites.filter(w => w.desktop_performance_score !== null || w.mobile_performance_score !== null);
  
  const desktopScores = validWebsites
    .map(w => w.desktop_performance_score)
    .filter(s => s !== null) as number[];
  
  const mobileScores = validWebsites
    .map(w => w.mobile_performance_score)
    .filter(s => s !== null) as number[];

  const statusCounts = {
    excellent: 0,
    good: 0,
    'needs-improvement': 0,
    poor: 0,
  };

  validWebsites.forEach(w => {
    const desktopStatus = getPerformanceStatus(w.desktop_performance_score);
    const mobileStatus = getPerformanceStatus(w.mobile_performance_score);
    
    if (desktopStatus !== 'no-data') statusCounts[desktopStatus as keyof typeof statusCounts]++;
    if (mobileStatus !== 'no-data') statusCounts[mobileStatus as keyof typeof statusCounts]++;
  });

  return {
    totalWebsites: validWebsites.length,
    averageDesktopScore: desktopScores.length > 0 ? Math.round(desktopScores.reduce((a, b) => a + b, 0) / desktopScores.length) : 0,
    averageMobileScore: mobileScores.length > 0 ? Math.round(mobileScores.reduce((a, b) => a + b, 0) / mobileScores.length) : 0,
    excellentCount: statusCounts.excellent,
    goodCount: statusCounts.good,
    needsImprovementCount: statusCounts['needs-improvement'],
    poorCount: statusCounts.poor,
  };
};

/**
 * Generate comprehensive PDF report
 */
export const generateComprehensiveReport = async (
  websites: WebsitePageSpeedData[],
  holding?: string
): Promise<void> => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Helper function to add new page
    const addNewPage = () => {
      pdf.addPage();
      yPosition = margin;
    };

    // Helper function to check if we need new page
    const checkPageBreak = (spaceNeeded: number) => {
      if (yPosition + spaceNeeded > pageHeight - margin) {
        addNewPage();
      }
    };

    // ===== PAGE 1: COVER & SUMMARY =====
    
    // Header
    pdf.setFontSize(28);
    pdf.setTextColor(33, 150, 243);
    pdf.text('PageSpeed Report', margin, yPosition);
    yPosition += 15;

    // Subtitle
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    if (holding) {
      pdf.text(`Holding: ${holding}`, margin, yPosition);
    } else {
      pdf.text('Comprehensive Report - All Holdings', margin, yPosition);
    }
    yPosition += 10;

    // Report Date
    pdf.setFontSize(11);
    const reportDate = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    pdf.text(`Generated: ${reportDate}`, margin, yPosition);
    yPosition += 15;

    // Divider
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Summary Section
    const summary = calculateSummary(websites);

    pdf.setFontSize(14);
    pdf.setTextColor(33, 150, 243);
    pdf.text('Executive Summary', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const summaryData = [
      { label: 'Total Websites', value: summary.totalWebsites },
      { label: 'Average Desktop Score', value: summary.averageDesktopScore },
      { label: 'Average Mobile Score', value: summary.averageMobileScore },
      { label: 'Excellent (90+)', value: summary.excellentCount, color: [34, 197, 94] },
      { label: 'Good (50-89)', value: summary.goodCount, color: [234, 179, 8] },
      { label: 'Needs Improvement (25-49)', value: summary.needsImprovementCount, color: [249, 115, 22] },
      { label: 'Poor (<25)', value: summary.poorCount, color: [239, 68, 68] },
    ];

    summaryData.forEach((item) => {
      if (item.color) {
        pdf.setTextColor(item.color[0], item.color[1], item.color[2]);
      } else {
        pdf.setTextColor(0, 0, 0);
      }
      pdf.text(`${item.label}: ${item.value}`, margin + 5, yPosition);
      yPosition += 7;
    });

    yPosition += 10;

    // Performance Distribution Chart (text-based)
    pdf.setTextColor(33, 150, 243);
    pdf.setFontSize(12);
    pdf.text('Performance Distribution', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    const totalScores = summary.excellentCount + summary.goodCount + summary.needsImprovementCount + summary.poorCount;
    if (totalScores > 0) {
      const excellentPct = Math.round((summary.excellentCount / totalScores) * 100);
      const goodPct = Math.round((summary.goodCount / totalScores) * 100);
      const needsImprovementPct = Math.round((summary.needsImprovementCount / totalScores) * 100);
      const poorPct = Math.round((summary.poorCount / totalScores) * 100);

      pdf.setTextColor(34, 197, 94);
      pdf.text(`■ Excellent: ${excellentPct}% (${summary.excellentCount})`, margin + 5, yPosition);
      yPosition += 6;

      pdf.setTextColor(234, 179, 8);
      pdf.text(`■ Good: ${goodPct}% (${summary.goodCount})`, margin + 5, yPosition);
      yPosition += 6;

      pdf.setTextColor(249, 115, 22);
      pdf.text(`■ Needs Improvement: ${needsImprovementPct}% (${summary.needsImprovementCount})`, margin + 5, yPosition);
      yPosition += 6;

      pdf.setTextColor(239, 68, 68);
      pdf.text(`■ Poor: ${poorPct}% (${summary.poorCount})`, margin + 5, yPosition);
      yPosition += 6;
    }

    // ===== PAGE 2+: DETAILED WEBSITE DATA =====
    addNewPage();

    pdf.setFontSize(14);
    pdf.setTextColor(33, 150, 243);
    pdf.text('Detailed Website Performance', margin, yPosition);
    yPosition += 10;

    // Table header
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(33, 150, 243);

    const tableTop = yPosition;
    const colWidths = {
      no: 8,
      url: 50,
      desktop: 20,
      mobile: 20,
      lcp: 15,
    };

    pdf.rect(margin, tableTop, contentWidth, 7, 'F');
    pdf.text('No', margin + 2, tableTop + 5);
    pdf.text('Website URL', margin + colWidths.no + 2, tableTop + 5);
    pdf.text('Desktop', margin + colWidths.no + colWidths.url + 2, tableTop + 5);
    pdf.text('Mobile', margin + colWidths.no + colWidths.url + colWidths.desktop + 2, tableTop + 5);
    pdf.text('LCP', margin + colWidths.no + colWidths.url + colWidths.desktop + colWidths.mobile + 2, tableTop + 5);

    yPosition += 10;

    // Table rows
    pdf.setTextColor(0, 0, 0);
    websites.forEach((website, index) => {
      checkPageBreak(8);

      const rowY = yPosition;
      const bgColor = index % 2 === 0 ? [245, 245, 245] : [255, 255, 255];
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      pdf.rect(margin, rowY - 5, contentWidth, 7, 'F');

      // Row number
      pdf.text((index + 1).toString(), margin + 2, rowY);

      // URL (truncated)
      const urlText = website.url.length > 35 ? website.url.substring(0, 32) + '...' : website.url;
      pdf.text(urlText, margin + colWidths.no + 2, rowY);

      // Desktop score
      const desktopScore = website.desktop_performance_score !== null ? website.desktop_performance_score.toString() : '-';
      pdf.text(desktopScore, margin + colWidths.no + colWidths.url + 2, rowY);

      // Mobile score
      const mobileScore = website.mobile_performance_score !== null ? website.mobile_performance_score.toString() : '-';
      pdf.text(mobileScore, margin + colWidths.no + colWidths.url + colWidths.desktop + 2, rowY);

      // LCP
      const lcpValue = website.desktop_lcp !== null ? website.desktop_lcp.toString() + 's' : '-';
      pdf.text(lcpValue, margin + colWidths.no + colWidths.url + colWidths.desktop + colWidths.mobile + 2, rowY);

      yPosition += 8;
    });

    // Save PDF
    const filename = holding 
      ? `PageSpeed-Report-${holding}-${new Date().getTime()}.pdf`
      : `PageSpeed-Report-Comprehensive-${new Date().getTime()}.pdf`;
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    throw error;
  }
};

/**
 * Export comprehensive report
 */
export const exportComprehensiveReport = async (holding?: string): Promise<void> => {
  try {
    // Fetch all websites
    const websitesResponse = await websiteAPI.getAll();
    let websites = websitesResponse.data;

    // Filter by holding if provided
    if (holding) {
      websites = websites.filter((w: any) => w.holding === holding);
    }

    // Fetch all page speed data
    const pageSpeedResponse = await pageSpeedAPI.getAll();
    const pageSpeedMap: { [key: number]: any } = {};
    pageSpeedResponse.data.forEach((ps: any) => {
      pageSpeedMap[ps.website_id] = ps;
    });

    // Merge data
    const websitesWithPageSpeed: WebsitePageSpeedData[] = websites.map((w: any) => {
      const ps = pageSpeedMap[w.id];
      return {
        id: w.id,
        url: w.url,
        holding: w.holding,
        jenis_website: w.jenis_website,
        has_ads: w.has_ads,
        desktop_performance_score: ps?.desktop_performance_score || null,
        desktop_accessibility_score: ps?.desktop_accessibility_score || null,
        desktop_best_practices_score: ps?.desktop_best_practices_score || null,
        desktop_seo_score: ps?.desktop_seo_score || null,
        desktop_lcp: ps?.desktop_lcp || null,
        desktop_fid: ps?.desktop_fid || null,
        desktop_cls: ps?.desktop_cls || null,
        mobile_performance_score: ps?.mobile_performance_score || null,
        mobile_accessibility_score: ps?.mobile_accessibility_score || null,
        mobile_best_practices_score: ps?.mobile_best_practices_score || null,
        mobile_seo_score: ps?.mobile_seo_score || null,
        mobile_lcp: ps?.mobile_lcp || null,
        mobile_fid: ps?.mobile_fid || null,
        mobile_cls: ps?.mobile_cls || null,
        checked_at: ps?.checked_at || new Date().toISOString(),
      };
    });

    // Generate PDF
    await generateComprehensiveReport(websitesWithPageSpeed, holding);
  } catch (error) {
    console.error('Error exporting comprehensive report:', error);
    throw error;
  }
};
