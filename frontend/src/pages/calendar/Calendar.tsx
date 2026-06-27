import Breadcrumb from "@/layouts/Breadcrumb";
import PageSpeedMonitor from "@/pages/page-speed/PageSpeedMonitor";

const Calendar = () => {
    return (
        <>
            <Breadcrumb title="PageSpeed Monitor" text="PageSpeed Monitor" />
            <PageSpeedMonitor />
        </>
    );
};

export default Calendar;