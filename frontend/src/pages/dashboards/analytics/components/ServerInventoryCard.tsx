import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Globe } from 'lucide-react';
import api from '@/services/api';

interface ServerData {
  server: string;
  count: number;
  websites: Array<{
    id: number;
    url: string;
    holding: string;
  }>;
}

export default function ServerInventoryCard() {
  const [serverData, setServerData] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServerData();
  }, []);

  const fetchServerData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/websites');
      const websites = response.data;

      // Group by letak_server
      const grouped = websites.reduce((acc: Record<string, any>, website: any) => {
        const server = website.letak_server || 'Unassigned';
        if (!acc[server]) {
          acc[server] = {
            server,
            count: 0,
            websites: [],
          };
        }
        acc[server].count++;
        acc[server].websites.push({
          id: website.id,
          url: website.url,
          holding: website.holding,
        });
        return acc;
      }, {});

      const serverArray = Object.values(grouped).sort((a: any, b: any) => b.count - a.count) as ServerData[];
      setServerData(serverArray);
    } catch (error) {
      console.error('Error fetching server data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Server Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : serverData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No server data available</div>
        ) : (
          <div className="space-y-4">
            {serverData.map((server) => (
              <div key={server.server} className="border-b border-neutral-200 dark:border-neutral-700 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      {server.server}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Hosting {server.count} website{server.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {server.count}
                  </Badge>
                </div>
                
                {/* Website list */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {server.websites.slice(0, 3).map((website) => (
                    <Badge
                      key={website.id}
                      variant="outline"
                      className="text-xs bg-white dark:bg-neutral-800"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {website.url.replace('https://', '').replace('http://', '').split('/')[0]}
                    </Badge>
                  ))}
                  {server.websites.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-white dark:bg-neutral-800">
                      +{server.websites.length - 3} more
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
