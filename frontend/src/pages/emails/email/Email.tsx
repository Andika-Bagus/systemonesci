import Breadcrumb from "@/layouts/Breadcrumb";
import TicketsList from "@/pages/tickets/TicketsList";

const Email = () => {
    return (
        <>
            <Breadcrumb title="Support Tickets" text="Support Tickets" />
            <TicketsList />
        </>
    );
};

export default Email;