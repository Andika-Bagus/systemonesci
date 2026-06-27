import { Card, CardContent } from "@/components/ui/card";
import { websiteAPI } from "@/services/api";
import { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import type { ApexOptions } from "apexcharts";

interface HoldingData {
  name: string;
  shortName: string;
  count: number;
}

const AverageDailySalesCard = () => {
  const [holdingData, setHoldingData] = useState<HoldingData[]>([]);
  const [totalWebsites, setTotalWebsites] = useState(0);

  const getShortName = (name: string): string => {
    if (name.length <= 10) return name;
    
    // Try to abbreviate by taking first letters of words
    const words = name.split(' ');
    if (words.length > 1) {
      return words.map(w => w[0]).join('').toUpperCase();
    }
    
    // If single word, take first 3 letters + last letter
    return name.substring(0, 3) + name.substring(name.length - 1);
  };

  useEffect(() => {
    fetchWebsiteStats();
  }, []);

  const fetchWebsiteStats = async () => {
    try {
      const response = await websiteAPI.getAll();
      const websites = response.data || [];
      
      setTotalWebsites(websites.length);

      // Group websites by holding
      const holdingMap = new Map<string, number>();
      websites.forEach((website: any) => {
        const holding = website.holding || 'Unknown';
        holdingMap.set(holding, (holdingMap.get(holding) || 0) + 1);
      });

      // Convert to array and sort by count descending
      const data = Array.from(holdingMap.entries())
        .map(([name, count]) => ({ 
          name, 
          shortName: getShortName(name),
          count 
        }))
        .sort((a, b) => b.count - a.count);

      setHoldingData(data);
    } catch (error) {
      console.error('Error fetching website stats:', error);
      setTotalWebsites(0);
      setHoldingData([]);
    }
  };

  const chartSeries = [{
    name: "Websites",
    data: holdingData.map(item => item.count)
  }];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 235,
      width: "100%",
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: '60%',
        dataLabels: {
          position: 'top',
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#3B82F6']
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.2,
        gradientToColors: ['#3B82F6'],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    grid: {
      show: false,
      borderColor: '#D1D5DB',
      strokeDashArray: 4,
      position: 'back',
      padding: {
        top: -10,
        right: -10,
        bottom: -10,
        left: -10
      }
    },
    xaxis: {
      type: 'category',
      categories: holdingData.map(item => item.shortName),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val} websites`
      },
      x: {
        formatter: (val: string | number) => {
          const index = holdingData.findIndex(item => item.shortName === val);
          return index >= 0 ? holdingData[index].name : String(val);
        }
      }
    }
  };

  return (
    <Card className="card h-full rounded-lg border-0 !p-0 block">
      <CardContent className="card-body p-6 h-full flex flex-col justify-between">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <h6 className="font-bold text-lg mb-0">Website by Holding</h6>
        </div>

        <h6 className="text-center my-4 text-3xl font-bold text-blue-600">{totalWebsites}</h6>
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-200 mb-4">Total Websites</p>
        
        {holdingData.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={235}
            width="100%"
          />
        ) : (
          <div className="flex items-center justify-center h-[235px] text-neutral-400">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AverageDailySalesCard;