import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import type { UserRole } from "@/utils/roleUtils"
// import AIAssistant from "@/components/AIAssistant" // Hidden temporarily

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserRole(user.role as UserRole);
            } catch {
                setUserRole(null);
            }
        }
    }, []);

    const isViewer = userRole === 'viewer';

    return (
        <SidebarProvider>
            {!isViewer && <AppSidebar />}
            <main className="grow">
                {children}
            </main>
            {/* <AIAssistant /> */} {/* Hidden temporarily - uncomment to enable */}
        </SidebarProvider>
    )
}