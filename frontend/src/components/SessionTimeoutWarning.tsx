import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionTimeoutWarningProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
  timeRemaining: number;
}

export const SessionTimeoutWarning = ({
  isOpen,
  onContinue,
  onLogout,
  timeRemaining,
}: SessionTimeoutWarningProps) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <AlertDialogTitle>Session Akan Berakhir</AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-2">
          <p>
            Sesi Anda akan berakhir dalam <span className="font-bold text-orange-600">{displayTime} detik</span>.
          </p>
          <p>Klik "Lanjutkan" untuk tetap login atau "Logout" untuk keluar sekarang.</p>
        </AlertDialogDescription>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel onClick={onLogout}>Logout</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>Lanjutkan</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
