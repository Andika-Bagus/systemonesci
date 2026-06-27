import { useEffect, useState } from 'react';
import { pageSpeedAPI } from '@/services/api';
import { BarChart3, TrendingUp, AlertCircle, Target } from "lucide-react";
import React from "react";

interface CardData {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
}

const PageSpeedStatCard = () => {
  const [cardsDatas, setCardsDatas] = useState<CardData[]>([
    {
      title: "Total Dianalisis",
      value: "0",
      icon: BarChart3,
      bgColor: "bg-blue-600",
    },
    {
      title: "Berpotensi Improve",
      value: "0",
      icon: TrendingUp,
      bgColor: "bg-orange-600",
    },
    {
      title: "Perlu Prioritas",
      value: "0",
      icon: AlertCircle,
      bgColor: "bg-red-600",
    },
    {
      title: "Potensi Peningkatan",
      value: "0",
      icon: Target,
      bgColor: "bg-green-600",
    },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await pageSpeedAPI.getStatsByAds();
      const stats = response.data.stats.with_ads;
      
      setCardsDatas([
        {
          title: "Total Dianalisis",
          value: stats.total_websites.toString(),
          icon: BarChart3,
          bgColor: "bg-blue-600",
        },
        {
          title: "Berpotensi Improve",
          value: stats.needs_improvement.toString(),
          icon: TrendingUp,
          bgColor: "bg-orange-600",
        },
        {
          title: "Perlu Prioritas",
          value: stats.poor_performance.toString(),
          icon: AlertCircle,
          bgColor: "bg-red-600",
        },
        {
          title: "Potensi Peningkatan",
          value: stats.good_performance.toString(),
          icon: Target,
          bgColor: "bg-green-600",
        },
      ]);
    } catch (error) {
      console.error('Error fetching PageSpeed stats:', error);
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

export default PageSpeedStatCard;
