import { Card, CardContent } from "@/components/ui/card";
import { ojsAPI } from "@/services/api";
import { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import type { ApexOptions } from "apexcharts";

const OjsStatsCard = () => {
  const [holdingData, setHoldingData] = useState<{ name: string; count: number }[]>([]);
  const [keteranganData, setKeteranganData] = useState<{ name: string; count: number }[]>([]);
  const [totalOJS, setTotalOJS] = useState(0);

  useEffect(() => {
    fetchOJSStats();
  }, []);

  const fetchOJSStats = async () => {
    try {
      const response = await ojsAPI.getAll();
      const instances = response.data || [];

      setTotalOJS(instances.length);

      // Group by holding
      const holdingMap = new Map<string, number>();
      instances.forEach((i: any) => {
        const holding = i.holding || 'Unknown';
        holdingMap.set(holding, (holdingMap.get(holding) || 0) + 1);
      });
      setHoldingData(
        Array.from(holdingMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      );

      // Group by keterangan
      const ketMap = new Map<string, number>();
      instances.forEach((i: any) => {
        if (i.keterangan) {
          ketMap.set(i.keterangan, (ketMap.get(i.keterangan) || 0) + 1);
        }
      });
      setKeteranganData(
        Array.from(ketMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      );
    } catch (error) {
      console.error('Error fetching OJS stats:', error);
    }
  };

  // Bar Chart - OJS by Holding (DoubleBarChart style)
  const holdingChartOptions: ApexOptions = {
    series: [{
      name: 'OJS',
      data: holdingData.map(item => item.count),
    }],
    chart: {
      type: 'bar',
      height: 264,
      toolbar: { show: false },
    },
    colors: ['#487FFF'],
    legend: { show: false },
    grid: {
      show: true,
      borderColor: '#D1D5DB',
      strokeDashArray: 4,
      position: 'back',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: 10,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: holdingData.map(item => item.name),
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value).toString()
      }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (value) => `${value}`
      }
    }
  };

  // Bar Chart - OJS by Keterangan (DoubleBarChart style)
  const keteranganChartOptions: ApexOptions = {
    series: [{
      name: 'OJS',
      data: keteranganData.map(item => item.count),
    }],
    chart: {
      type: 'bar',
      height: 264,
      toolbar: { show: false },
    },
    colors: ['#FF9F29'],
    legend: { show: false },
    grid: {
      show: true,
      borderColor: '#D1D5DB',
      strokeDashArray: 4,
      position: 'back',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: 10,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: keteranganData.map(item => item.name),
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value).toString()
      }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (value) => `${value}`
      }
    }
  };

  return (
    <div id="ojs-holding-chart" className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Bar Chart - OJS by Holding */}
      <div className="col-span-12 md:col-span-6">
        <Card className="card">
          <CardContent className="px-0">
            <div className="flex flex-wrap items-center justify-between">
              <h6 className="text-lg mb-0">OJS by Holding</h6>
            </div>
            <ul className="flex flex-wrap items-center justify-center mt-4 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">Total:
                  <span className="text-neutral-600 dark:text-neutral-300 font-bold"> {totalOJS}</span>
                </span>
              </li>
            </ul>

            <div>
              {holdingData.length > 0 ? (
                <Chart
                  options={holdingChartOptions}
                  series={holdingChartOptions.series}
                  type="bar"
                  height={264}
                />
              ) : (
                <div className="flex items-center justify-center h-[264px] text-neutral-400">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - OJS by Keterangan */}
      <div className="col-span-12 md:col-span-6">
        <Card className="card">
          <CardContent className="px-0">
            <div className="flex flex-wrap items-center justify-between">
              <h6 className="text-lg mb-0">OJS by Keterangan</h6>
            </div>
            <ul className="flex flex-wrap items-center justify-center mt-4 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">Total:
                  <span className="text-neutral-600 dark:text-neutral-300 font-bold"> {keteranganData.reduce((sum, item) => sum + item.count, 0)}</span>
                </span>
              </li>
            </ul>

            <div>
              {keteranganData.length > 0 ? (
                <Chart
                  options={keteranganChartOptions}
                  series={keteranganChartOptions.series}
                  type="bar"
                  height={264}
                />
              ) : (
                <div className="flex items-center justify-center h-[264px] text-neutral-400">
                  No keterangan data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OjsStatsCard;
