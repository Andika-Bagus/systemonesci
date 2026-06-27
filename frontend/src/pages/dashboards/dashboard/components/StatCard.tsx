import { BarChart3, TrendingUp, AlertCircle, Target } from "lucide-react";
import React from "react";

interface CardData {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
};

const cardsDatas: CardData[] = [
  {
    title: "Total Dianalisis",
    value: "59",
    icon: BarChart3,
    bgColor: "bg-blue-600",
  },
  {
    title: "Berpotensi Improve",
    value: "8",
    icon: TrendingUp,
    bgColor: "bg-orange-600",
  },
  {
    title: "Perlu Prioritas",
    value: "8",
    icon: AlertCircle,
    bgColor: "bg-red-600",
  },
  {
    title: "Potensi Peningkatan",
    value: "+1",
    icon: Target,
    bgColor: "bg-green-600",
  },
];

const StatCard = () => {
  return (
    cardsDatas.map((card, index) => {
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
    })
  );
};

export default StatCard;
