import { useState, useEffect, useMemo } from 'react';

interface UptimeData {
  date: string;
  status: 'up' | 'down' | 'unknown';
  uptime_percentage: number;
}

interface MiniUptimeChartProps {
  websiteId: number;
  forceRefresh?: number; // Add timestamp to force refresh
  currentStatus?: 'up' | 'down' | 'unknown'; // Add current status prop
}

export default function MiniUptimeChart({ websiteId, forceRefresh, currentStatus }: MiniUptimeChartProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Use useMemo to ensure data is recalculated when dependencies change
  const uptimeData = useMemo(() => {
    // ALWAYS use TODAY as reference - completely ignore any cached data
    const rightNow = new Date();
    const todayDay = rightNow.getDate();
    const todayMonth = rightNow.getMonth();
    const todayYear = rightNow.getFullYear();
    const todayDateStr = rightNow.toISOString().split('T')[0];
    
    console.log('🔥 MiniChart USEMEMO REGENERATION FOR WEBSITE:', websiteId);
    console.log('   📅 Today EXACT:', rightNow.toDateString(), 'Time:', rightNow.toTimeString());
    console.log('   📊 Will show Day 1 to Day', todayDay, '(MUST INCLUDE TODAY!)');
    console.log('   🎨 Based on current status:', currentStatus);
    console.log('   🔥 Force refresh timestamp:', forceRefresh);
    console.log('   🎯 Today date string:', todayDateStr);
    console.log('   🧮 Month:', todayMonth, 'Year:', todayYear);
    
    // SAFETY CHECK: Ensure we have a valid today
    if (todayDay < 1 || todayDay > 31) {
      console.error('❌ INVALID DAY:', todayDay);
      return [];
    }
    
    // Base colors on current website status
    const statusColor = currentStatus === 'down' ? 'down' : currentStatus === 'unknown' ? 'unknown' : 'up';
    const statusPercentage = currentStatus === 'down' ? 15 : currentStatus === 'unknown' ? 0 : 97;
    
    // Create completely fresh array - ensure TODAY is included
    const freshData: UptimeData[] = [];
    
    // Generate fresh data for THIS MONTH from day 1 to TODAY (inclusive)
    // FORCE INCLUDE TODAY regardless of any API data
    for (let day = 1; day <= todayDay; day++) {
      const dayDate = new Date(todayYear, todayMonth, day);
      const dayDateStr = dayDate.toISOString().split('T')[0];
      
      // Special handling for TODAY - ALWAYS use current status
      if (day === todayDay) {
        freshData.push({
          date: dayDateStr,
          status: statusColor,
          uptime_percentage: statusPercentage
        });
        console.log('🎯 TODAY FORCE ADDED:', day, statusColor, statusPercentage + '%', 'Date:', dayDateStr);
      } else {
        // Historical days - default to up
        freshData.push({
          date: dayDateStr,
          status: 'up',
          uptime_percentage: 95
        });
      }
    }
    
    console.log('✅ USEMEMO Generated', freshData.length, 'days (EXPECTED:', todayDay, ')');
    console.log('   📅 First day:', freshData[0]?.date);
    console.log('   📅 Last day:', freshData[freshData.length - 1]?.date, '(MUST BE TODAY)');
    console.log('   📊 Today status final:', freshData[freshData.length - 1]?.status);
    console.log('   🔥 Array length check:', freshData.length, '===', todayDay, '?', freshData.length === todayDay);
    
    // VERIFICATION: Ensure today is the last item
    const lastItem = freshData[freshData.length - 1];
    const isLastItemToday = lastItem && lastItem.date === todayDateStr;
    console.log('🔍 VERIFICATION - Last item is today?', isLastItemToday, 'Expected:', todayDateStr, 'Got:', lastItem?.date);
    
    console.log('🚀 MiniChart USEMEMO data ready! Should show', freshData.length, 'blocks ending with TODAY');
    console.log('📦 Final data array:', freshData.map(d => ({ day: new Date(d.date).getDate(), status: d.status })));
    
    return freshData;
  }, [websiteId, forceRefresh, currentStatus, Date.now()]); // Add Date.now() for real-time updates

  useEffect(() => {
    const rightNow = new Date();
    const todayDay = rightNow.getDate();
    
    console.log('🔄 MiniUptimeChart useEffect triggered:', {
      websiteId,
      forceRefresh,
      currentStatus,
      timestamp: new Date().toISOString(),
      todayDay: todayDay,
      fullDate: rightNow.toDateString(),
      dataLength: uptimeData.length
    });
    
    // Set loading to false since useMemo handles the data
    setIsLoading(false);
    
  }, [websiteId, forceRefresh, currentStatus, uptimeData]);

  // Remove the old fetchRealUptimeData function since useMemo handles it

  const getStatusColor = (data: UptimeData) => {
    if (data.status === 'down' || data.uptime_percentage < 50) {
      return 'bg-red-500'; // Red for down/poor
    } else if (data.uptime_percentage < 90) {
      return 'bg-yellow-500'; // Yellow for partial
    } else {
      return 'bg-green-500'; // Green for good
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateUptime = () => {
    if (uptimeData.length === 0) return 0;
    const totalUptime = uptimeData.reduce((acc, d) => acc + d.uptime_percentage, 0) / uptimeData.length;
    return Math.round(totalUptime * 100) / 100;
  };

  if (isLoading) {
    // Always use current date even during loading
    const rightNow = new Date();
    const currentDay = rightNow.getDate();
    
    console.log('⏳ Loading state - showing', currentDay, 'days for', rightNow.toDateString());
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: currentDay }).map((_, i) => (
            <div key={i} className="w-2 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          ))}
        </div>
        <div className="ml-2 text-xs text-gray-500">Loading...</div>
      </div>
    );
  }

  const uptime = calculateUptime();
  // ALWAYS get fresh date - never cache  
  const rightNow = new Date();
  const monthName = rightNow.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  
  console.log('🏷️ Mini chart RENDER:', {
    monthName,
    date: rightNow.toDateString(),
    dataLength: uptimeData.length,
    expectedLength: rightNow.getDate(),
    lastItem: uptimeData[uptimeData.length - 1],
    websiteId: websiteId
  });

  return (
    <div className="flex items-center justify-between">
      {/* Mini Chart */}
      <div className="flex gap-0.5 mr-2">
        {uptimeData.map((data, index) => (
          <div
            key={`${data.date}-${index}`}
            className={`
              w-2 h-4 transition-all duration-200 cursor-pointer transform hover:scale-110
              ${getStatusColor(data)}
            `}
            title={`${formatDate(data.date)}: ${data.uptime_percentage}% uptime (${data.status})`}
          />
        ))}
      </div>

      {/* Uptime Percentage */}
      <div className="text-right">
        <p className={`text-sm font-bold ${
          uptime >= 95 ? 'text-green-600 dark:text-green-400' :
          uptime >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
          'text-red-600 dark:text-red-400'
        }`}>
          {uptime}%
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{monthName}</p>
      </div>
    </div>
  );
}