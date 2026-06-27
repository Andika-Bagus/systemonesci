import { Lock } from 'lucide-react';

export function ViewerAlert() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md text-xs text-blue-700 dark:text-blue-300">
      <Lock size={14} className="flex-shrink-0" />
      <span>Read-only access</span>
    </div>
  );
}
