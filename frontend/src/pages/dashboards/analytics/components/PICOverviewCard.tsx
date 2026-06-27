import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe } from 'lucide-react';
import api from '@/services/api';

interface PICData {
  pic: string;
  count: number;
  websites: Array<{
    id: number;
    url: string;
    holding: string;
  }>;
}

export default function PICOverviewCard() {
  const [picData, setPicData] = useState<PICData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPICData();
  }, []);

  const fetchPICData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/websites');
      const websites = response.data;

      // Group by PIC
      const grouped = websites.reduce((acc: Record<string, any>, website: any) => {
        const pic = website.pic || 'Unassigned';
        if (!acc[pic]) {
          acc[pic] = {
            pic,
            count: 0,
            websites: [],
          };
        }
        acc[pic].count++;
        acc[pic].websites.push({
          id: website.id,
          url: website.url,
          holding: website.holding,
        });
        return acc;
      }, {});

      const picArray = Object.values(grouped).sort((a: any, b: any) => b.count - a.count) as PICData[];
      setPicData(picArray);
    } catch (error) {
      console.error('Error fetching PIC data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          PIC Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : picData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No PIC data available</div>
        ) : (
          <div className="space-y-4">
            {picData.map((pic) => (
              <div key={pic.pic} className="border-b border-neutral-200 dark:border-neutral-700 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      {pic.pic}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Managing {pic.count} website{pic.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    {pic.count}
                  </Badge>
                </div>
                
                {/* Website list */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {pic.websites.slice(0, 3).map((website) => (
                    <Badge
                      key={website.id}
                      variant="outline"
                      className="text-xs bg-white dark:bg-neutral-800"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {website.url.replace('https://', '').replace('http://', '').split('/')[0]}
                    </Badge>
                  ))}
                  {pic.websites.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-white dark:bg-neutral-800">
                      +{pic.websites.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
