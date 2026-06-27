import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning";
import { authAPI } from "@/services/api";

interface SessionContextType {
  isWarningOpen: boolean;
  timeRemaining: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  
  const timeoutsRef = useRef<{
    session: ReturnType<typeof setTimeout> | null;
    warning: ReturnType<typeof setTimeout> | null;
    countdown: ReturnType<typeof setTimeout> | null;
  }>({
    session: null,
    warning: null,
    countdown: null,
  });

  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

  const handleLogout = useCallback(async () => {
    // Clear local storage and redirect immediately
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/auth/login");
    
    // Call backend logout in background (fire and forget)
    authAPI.logout().catch(err => console.log('Logout API call error:', err));
  }, [navigate]);

  const clearAllTimeouts = useCallback(() => {
    if (timeoutsRef.current.session) clearTimeout(timeoutsRef.current.session);
    if (timeoutsRef.current.warning) clearTimeout(timeoutsRef.current.warning);
    if (timeoutsRef.current.countdown) clearInterval(timeoutsRef.current.countdown);
  }, []);

  const startSessionTimer = useCallback(() => {
    clearAllTimeouts();

    // Show warning 5 minutes before timeout
    timeoutsRef.current.warning = setTimeout(() => {
      setIsWarningOpen(true);
      setTimeRemaining(300);

      // Start countdown
      timeoutsRef.current.countdown = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timeoutsRef.current.countdown) clearInterval(timeoutsRef.current.countdown);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Auto logout after 30 minutes
    timeoutsRef.current.session = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  }, [SESSION_TIMEOUT, WARNING_TIME, handleLogout]);

  const handleContinueSession = useCallback(() => {
    setIsWarningOpen(false);
    setTimeRemaining(300);
    startSessionTimer();
  }, [startSessionTimer]);

  useEffect(() => {
    // Don't start session timer on login page
    if (location.pathname === "/login" || location.pathname === "/auth/login") {
      return;
    }

    startSessionTimer();

    // Reset timer on user activity (debounced)
    let activityTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleActivity = () => {
      if (!isWarningOpen) {
        if (activityTimeout) clearTimeout(activityTimeout);
        activityTimeout = setTimeout(() => {
          startSessionTimer();
        }, 1000); // Debounce activity detection
      }
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (activityTimeout) clearTimeout(activityTimeout);
    };
  }, [location.pathname, isWarningOpen, startSessionTimer]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return (
    <SessionContext.Provider value={{ isWarningOpen, timeRemaining }}>
      <SessionTimeoutWarning
        isOpen={isWarningOpen}
        onContinue={handleContinueSession}
        onLogout={handleLogout}
        timeRemaining={timeRemaining}
      />
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
