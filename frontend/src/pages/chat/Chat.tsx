import Breadcrumb from "@/layouts/Breadcrumb";
import WebsitesList from "@/pages/websites/WebsitesList";

const Chat = () => {
    return (
        <>
            <Breadcrumb title="Websites" text="Websites" />
            <WebsitesList />
        </>
    );
};

export default Chat;