import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";

const SystemStatCard = lazy(() => import("./components/SystemStatCard"));
const UptimeOverviewCard = lazy(() => import("./components/UptimeOverviewCard"));
const PageSpeedOverviewCard = lazy(() => import("./components/PageSpeedOverviewCard"));
const DownWebsitesListCard = lazy(() => import("./components/DownWebsitesListCard"));

const SystemDashboard = () => {
  return (
    <>
      <Breadcrumb title="Sistem Monitoring" text="Sistem Monitoring" />

      {/* Overview Stat Cards (Total Web, OJS, Holding, Server) */}
      <LazyWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SystemStatCard />
        </div>
      </LazyWrapper>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        {/* Uptime Overview */}
        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <UptimeOverviewCard />
          </LazyWrapper>
        </div>

        {/* PageSpeed Overview */}
        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <PageSpeedOverviewCard />
          </LazyWrapper>
        </div>

        {/* Down Websites List */}
        <div className="xl:col-span-12">
          <LazyWrapper>
            <DownWebsitesListCard />
          </LazyWrapper>
        </div>
      </div>
    </>
  );
};

export default SystemDashboard;
