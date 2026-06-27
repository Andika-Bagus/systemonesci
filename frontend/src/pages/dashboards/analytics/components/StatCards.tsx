import { ShoppingCart, SwitchCamera, Tag, Database, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { websiteAPI, ojsAPI } from "@/services/api";

interface StatCardData {
    id: number;
    title: string;
    value: string;
    icon: LucideIcon;
    bgColor: string;
    scrollTo?: string;
}

const StatCards = () => {
    const [stats, setStats] = useState({
        totalWebsites: 0,
        totalHoldings: 0,
        totalJenisWebsite: 0,
        totalServers: 0,
        totalOJS: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [websitesRes, ojsRes] = await Promise.all([
                    websiteAPI.getAll(),
                    ojsAPI.getAll(),
                ]);
                
                const websites = websitesRes.data;
                const ojsInstances = ojsRes.data;
                
                const totalWebsites = websites.length;
                const uniqueHoldings = new Set(websites.map((w: any) => w.holding)).size;
                const uniqueJenisWebsite = new Set(websites.map((w: any) => w.jenis_website)).size;
                const uniqueServers = new Set(websites.map((w: any) => w.letak_server)).size;
                const totalOJS = ojsInstances.length;
                
                setStats({
                    totalWebsites,
                    totalHoldings: uniqueHoldings,
                    totalJenisWebsite: uniqueJenisWebsite,
                    totalServers: uniqueServers,
                    totalOJS,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const handleScrollTo = (targetId?: string) => {
        if (!targetId) return;
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const cardsData: StatCardData[] = [
        {
            id: 1,
            title: "Total Website",
            value: stats.totalWebsites.toString(),
            icon: Tag,
            bgColor: "bg-indigo-600",
        },
        {
            id: 2,
            title: "Total Holding",
            value: stats.totalHoldings.toString(),
            icon: ShoppingCart,
            bgColor: "bg-emerald-600",
            scrollTo: "ojs-holding-chart",
        },
        {
            id: 3,
            title: "Total OJS",
            value: stats.totalOJS.toString(),
            icon: Database,
            bgColor: "bg-purple-600",
            scrollTo: "ojs-holding-chart",
        },
        {
            id: 4,
            title: "Total Server",
            value: stats.totalServers.toString(),
            icon: SwitchCamera,
            bgColor: "bg-orange-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            {cardsData.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.id} className="col-span-1">
                        <div
                            onClick={() => handleScrollTo(card.scrollTo)}
                            className={`${card.bgColor} rounded-3xl p-8 flex items-center gap-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden ${card.scrollTo ? 'cursor-pointer' : ''}`}
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon size={32} className="text-white" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                                <p className="text-white/80 text-sm font-medium">{card.title}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCards;
