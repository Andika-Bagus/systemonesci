import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
import UpgradePlanCard from "./components/UpgradePlanCard";
import SystemCharts from "./components/SystemCharts";
const AverageDailySalesCard = lazy(() => import("./components/AverageDailySalesCard"))
const OjsStatsCard = lazy(() => import("../dashboard/components/OjsStatsCard"))

const Analytics = () => {
    return (
        <>
            <Breadcrumb title="Dashboard" text="Dashboard" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                <div className="col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <UpgradePlanCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <AverageDailySalesCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12">
                    <LazyWrapper>
                        <OjsStatsCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12">
                    <SystemCharts />
                </div>

            </div>
        </>
    );
};

export default Analytics;