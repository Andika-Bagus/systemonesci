import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authAPI } from "@/services/api";
import { SessionProvider } from "@/context/SessionContext";

const ProtectedRoutes = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                // Create a timeout promise
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth check timeout')), 15000)
                );

                // Verify token with backend with timeout
                await Promise.race([authAPI.me(), timeoutPromise]);
                setIsAuthenticated(true);
            } catch (error) {
                // Token invalid, remove it
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
                <Loader2 className="h-11 w-11 animate-spin text-neutral-900" />
                <p className="mt-4 text-neutral-900 font-semibold animate-pulse text-xl">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <SessionProvider>
            <Outlet />
        </SessionProvider>
    );
};

export default ProtectedRoutes;