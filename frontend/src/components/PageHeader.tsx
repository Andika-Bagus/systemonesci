import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconColor?: string;       // e.g. 'bg-green-600'
  iconShadow?: string;      // e.g. 'shadow-green-200'
  children?: React.ReactNode; // right-side actions
}

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  iconColor = 'bg-green-600',
  iconShadow = 'shadow-green-200',
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 ${iconColor} rounded-xl flex items-center justify-center shadow-md ${iconShadow}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: actions slot */}
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
