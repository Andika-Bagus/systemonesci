import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";

const SystemStatCard = lazy(() => import("./components/SystemStatCard"));
const SalesStatisticCard = lazy(() => import("../dashboard/components/SalesStatisticCard"));
const TotalSubscriberCard = lazy(() => import("../dashboard/components/TotalSubscriberCard"));
const UserOverviewCard = lazy(() => import("../dashboard/components/UserOverviewCard"));
const TabsWithTableCard = lazy(() => import("../dashboard/components/TabsWithTableCard"));
const TopPerformerCard = lazy(() => import("../dashboard/components/TopPerformerCard"));
const TopCountriesCard = lazy(() => import("../dashboard/components/TopCountriesCard"));
const GenerateContentCard = lazy(() => import("../dashboard/components/GenerateContentCard"));

const SystemDashboard = () => {
  return (
    <>
      <Breadcrumb title="Sistem Monitoring" text="Sistem Monitoring" />

      <LazyWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          <SystemStatCard />
        </div>
      </LazyWrapper>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <SalesStatisticCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-6 2xl:col-span-3">
          <LazyWrapper>
            <TotalSubscriberCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-6 2xl:col-span-3">
          <LazyWrapper>
            <UserOverviewCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-9">
          <LazyWrapper>
            <TabsWithTableCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-3">
          <LazyWrapper>
            <TopPerformerCard listClasses="space-y-6 max-h-[408px] overflow-y-auto scrollbar-thin scrollbar-invisible hover:scrollbar-visible" />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <TopCountriesCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <GenerateContentCard />
          </LazyWrapper>
        </div>
      </div>
    </>
  );
};

export default SystemDashboard;
