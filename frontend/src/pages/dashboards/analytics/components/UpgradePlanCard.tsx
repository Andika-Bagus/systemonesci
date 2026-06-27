import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import StatCards from "./StatCards";
import { Zap, CheckCircle2, Radio } from "lucide-react";

const UpgradePlanCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-6 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                    <div className="col-span-1">
                        <div className="h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 flex flex-col justify-between text-white shadow-lg">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Radio size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="text-2xl font-bold text-white mb-1">Monitoring Hub</h6>
                                        <p className="text-blue-100 text-sm">Kelola semua website dan tiket Anda</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 pt-4 border-t border-white/20">
                                    <div className="flex items-center gap-3 text-white text-sm">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                        <span>Real-time PageSpeed Monitoring</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white text-sm">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                        <span>Support Ticket Management</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white text-sm">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                        <span>Website Performance Tracking</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/page-speed"
                                className="w-full py-3 px-6 rounded-xl bg-white text-blue-600 text-sm font-semibold transform transition-transform duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 mt-6"
                            >
                                <Zap className="h-4 w-4" />
                                Mulai Monitoring
                            </Link>
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2 h-full">
                        <StatCards />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UpgradePlanCard;