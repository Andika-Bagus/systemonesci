import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoutes = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
                <Loader2 className="h-11 w-11 animate-spin text-neutral-900" />
                <p className="mt-4 text-neutral-900 font-semibold animate-pulse text-xl">Loading...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Outlet />
    );
};

export default GuestRoutes;