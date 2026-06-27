import { useEffect, useState } from 'react';
import { websiteAPI, ojsAPI } from '@/services/api';
import { Globe, Server, AlertTriangle, Database } from "lucide-react";
import React from "react";

interface CardData {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
}

const SystemStatCard = () => {
  const [cardsDatas, setCardsDatas] = useState<CardData[]>([
    {
      title: "Total Websites",
      value: "0",
      icon: Globe,
      bgColor: "bg-blue-600",
    },
    {
      title: "Total OJS",
      value: "0",
      icon: Database,
      bgColor: "bg-purple-600",
    },
    {
      title: "Total Holdings",
      value: "0",
      icon: Server,
      bgColor: "bg-green-600",
    },
    {
      title: "Total Servers",
      value: "0",
      icon: AlertTriangle,
      bgColor: "bg-orange-600",
    },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch websites
      const websitesResponse = await websiteAPI.getAll();
      const totalWebsites = websitesResponse.data.length;
      const uniqueHoldings = [...new Set(websitesResponse.data.map((w: any) => w.holding))].length;

      // Fetch OJS instances
      const ojsResponse = await ojsAPI.getAll();
      const totalOjs = ojsResponse.data.length;
      const uniqueServers = [...new Set(ojsResponse.data.map((o: any) => o.letak_server).filter(Boolean))].length;

      setCardsDatas([
        {
          title: "Total Websites",
          value: totalWebsites.toString(),
          icon: Globe,
          bgColor: "bg-blue-600",
        },
        {
          title: "Total OJS",
          value: totalOjs.toString(),
          icon: Database,
          bgColor: "bg-purple-600",
        },
        {
          title: "Total Holdings",
          value: uniqueHoldings.toString(),
          icon: Server,
          bgColor: "bg-green-600",
        },
        {
          title: "Total Servers",
          value: uniqueServers.toString(),
          icon: AlertTriangle,
          bgColor: "bg-orange-600",
        },
      ]);
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  return (
    <>
      {cardsDatas.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} rounded-xl p-6 flex items-center gap-4 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-white/80 text-sm font-medium">{card.title}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SystemStatCard;
