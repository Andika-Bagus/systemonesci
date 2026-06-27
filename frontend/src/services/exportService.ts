import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { pageSpeedAPI } from './api';

export interface ExportData {
  websiteId: number;
  websiteUrl: string;
  desktopPerformanceScore: number | null;
  desktopAccessibilityScore: number | null;
  desktopBestPracticesScore: number | null;
  desktopSeoScore: number | null;
  desktopLcp: number | null;
  desktopFid: number | null;
  desktopCls: number | null;
  mobilePerformanceScore: number | null;
  mobileAccessibilityScore: number | null;
  mobileBestPracticesScore: number | null;
  mobileSeoScore: number | null;
  mobileLcp: number | null;
  mobileFid: number | null;
  mobileCls: number | null;
  checkedAt: string;
}

/**
 * Capture HTML element as image
 */
export const captureElementAsImage = async (element: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing element:', error);
    throw error;
  }
};

/**
 * Generate PDF report with charts
 */
export const generatePageSpeedPDF = async (
  data: ExportData,
  chartImage?: string
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

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(33, 150, 243);
    pdf.text('PageSpeed Report', margin, yPosition);
    yPosition += 12;

    // Website URL
    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Website: ${data.websiteUrl}`, margin, yPosition);
    yPosition += 8;

    // Report Date
    const reportDate = new Date(data.checkedAt).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    pdf.text(`Report Date: ${reportDate}`, margin, yPosition);
    yPosition += 12;

    // Divider
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Desktop Scores Section
    pdf.setFontSize(14);
    pdf.setTextColor(33, 150, 243);
    pdf.text('Desktop Performance', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const desktopScores = [
      { label: 'Performance', value: data.desktopPerformanceScore },
      { label: 'Accessibility', value: data.desktopAccessibilityScore },
      { label: 'Best Practices', value: data.desktopBestPracticesScore },
      { label: 'SEO', value: data.desktopSeoScore },
    ];

    desktopScores.forEach((score, index) => {
      const xPos = margin + (index % 2) * (contentWidth / 2);
      const yPos = yPosition + Math.floor(index / 2) * 8;
      pdf.text(`${score.label}: ${score.value !== null ? score.value : '-'}`, xPos, yPos);
    });

    yPosition += 20;

    // Core Web Vitals - Desktop
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Core Web Vitals:', margin, yPosition);
    yPosition += 6;

    const desktopVitals = [
      { label: 'LCP', value: data.desktopLcp, unit: 's' },
      { label: 'FID', value: data.desktopFid, unit: 'ms' },
      { label: 'CLS', value: data.desktopCls, unit: '' },
    ];

    desktopVitals.forEach((vital) => {
      pdf.text(
        `${vital.label}: ${vital.value !== null ? vital.value + vital.unit : '-'}`,
        margin + 5,
        yPosition
      );
      yPosition += 6;
    });

    yPosition += 6;

    // Mobile Scores Section
    pdf.setFontSize(14);
    pdf.setTextColor(33, 150, 243);
    pdf.text('Mobile Performance', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const mobileScores = [
      { label: 'Performance', value: data.mobilePerformanceScore },
      { label: 'Accessibility', value: data.mobileAccessibilityScore },
      { label: 'Best Practices', value: data.mobileBestPracticesScore },
      { label: 'SEO', value: data.mobileSeoScore },
    ];

    mobileScores.forEach((score, index) => {
      const xPos = margin + (index % 2) * (contentWidth / 2);
      const yPos = yPosition + Math.floor(index / 2) * 8;
      pdf.text(`${score.label}: ${score.value !== null ? score.value : '-'}`, xPos, yPos);
    });

    yPosition += 20;

    // Core Web Vitals - Mobile
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Core Web Vitals:', margin, yPosition);
    yPosition += 6;

    const mobileVitals = [
      { label: 'LCP', value: data.mobileLcp, unit: 's' },
      { label: 'FID', value: data.mobileFid, unit: 'ms' },
      { label: 'CLS', value: data.mobileCls, unit: '' },
    ];

    mobileVitals.forEach((vital) => {
      pdf.text(
        `${vital.label}: ${vital.value !== null ? vital.value + vital.unit : '-'}`,
        margin + 5,
        yPosition
      );
      yPosition += 6;
    });

    // Add chart image if provided
    if (chartImage) {
      yPosition += 10;

      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(33, 150, 243);
      pdf.text('Performance Chart', margin, yPosition);
      yPosition += 8;

      // Add image
      const imgWidth = contentWidth;
      const imgHeight = (imgWidth * 3) / 4; // 4:3 aspect ratio

      pdf.addImage(chartImage, 'PNG', margin, yPosition, imgWidth, imgHeight);
    }

    // Save PDF
    const filename = `PageSpeed-Report-${data.websiteUrl.replace(/[^a-z0-9]/gi, '-')}-${new Date().getTime()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Export page speed data as PDF
 */
export const exportPageSpeedReport = async (
  websiteId: number,
  websiteUrl: string,
  chartElementId?: string
): Promise<void> => {
  try {
    // Fetch latest page speed data
    const response = await pageSpeedAPI.get(websiteId);
    const data = response.data;

    // Capture chart if element ID provided
    let chartImage: string | undefined;
    if (chartElementId) {
      const chartElement = document.getElementById(chartElementId);
      if (chartElement) {
        chartImage = await captureElementAsImage(chartElement);
      }
    }

    // Prepare export data
    const exportData: ExportData = {
      websiteId: data.website_id,
      websiteUrl: websiteUrl,
      desktopPerformanceScore: data.desktop_performance_score,
      desktopAccessibilityScore: data.desktop_accessibility_score,
      desktopBestPracticesScore: data.desktop_best_practices_score,
      desktopSeoScore: data.desktop_seo_score,
      desktopLcp: data.desktop_lcp,
      desktopFid: data.desktop_fid,
      desktopCls: data.desktop_cls,
      mobilePerformanceScore: data.mobile_performance_score,
      mobileAccessibilityScore: data.mobile_accessibility_score,
      mobileBestPracticesScore: data.mobile_best_practices_score,
      mobileSeoScore: data.mobile_seo_score,
      mobileLcp: data.mobile_lcp,
      mobileFid: data.mobile_fid,
      mobileCls: data.mobile_cls,
      checkedAt: data.checked_at,
    };

    // Generate PDF
    await generatePageSpeedPDF(exportData, chartImage);
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
};
