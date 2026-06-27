import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from "sonner";
import { Lock, Unlock, Shield, Eye, EyeOff, ExternalLink, LogOut, Timer, AlertCircle, Pencil } from "lucide-react";
import api from "@/services/api";
import { ojsAPI } from "@/services/api";

interface OjsInstance {
  id: number;
  name: string;
  url: string;
  version: string;
  ojs_username: string | null;
  ojs_password: string | null;
  server_location: string | null;
  cdn_location: string | null;
  created_at: string;
  updated_at: string;
}

interface SessionInfo {
  authenticated: boolean;
  expires_at?: string;
  expires_in_minutes?: number;
  user?: string;
  expired?: boolean;
}

const OjsSecure = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  
  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [instances, setInstances] = useState<OjsInstance[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Edit credential dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInstance, setEditingInstance] = useState<OjsInstance | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Per-row show/hide credentials
  const [visibleUsernames, setVisibleUsernames] = useState<Set<number>>(new Set());
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  const toggleUsernameVisibility = (id: number) => {
    setVisibleUsernames(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.max(1, Math.ceil(instances.length / ITEMS_PER_PAGE));
  const paginatedInstances = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return instances.slice(start, start + ITEMS_PER_PAGE);
  }, [instances, currentPage]);

  // Check existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ojs_secure_token');
    if (savedToken) {
      setSessionToken(savedToken);
      checkSession(savedToken);
    }
  }, []);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => { lastActivityRef.current = Date.now(); };
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, []);

  // Session timer effect
  useEffect(() => {
    let interval: number;
    
    if (isAuthenticated && sessionToken) {
      interval = setInterval(() => {
        checkSession(sessionToken);
      }, 60000); // Check every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, sessionToken]);

  const checkSession = async (token: string) => {
    const isUserActive = (Date.now() - lastActivityRef.current) < 65000; // active in last ~1m
    try {
      const response = await api.get('/ojs-secure/session', {
        headers: { 'X-OJS-Session': token },
        params: { extend: isUserActive },
        timeout: 10000
      });
      
      const info = response.data as SessionInfo;
      setSessionInfo(info);
      
      if (info.authenticated) {
        setIsAuthenticated(true);
        
        // Load data if not loaded yet
        if (instances.length === 0) {
          loadInstances(token);
        }
      } else {
        handleSessionExpired();
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSessionInfo(null);
      setIsAuthenticated(false);
    }
  };

  const handleSessionExpired = () => {
    setIsAuthenticated(false);
    setSessionToken(null);
    setSessionInfo(null);
    setInstances([]);
    localStorage.removeItem('ojs_secure_token');
    toast.error("Session expired. Please login again.");
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/ojs-secure/authenticate', {
        username: username.trim(),
        password: password.trim()
      });

      const { session_token } = response.data;
      
      if (!session_token) {
        throw new Error("No session token received");
      }
      
      setSessionToken(session_token);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('ojs_secure_token', session_token);
      
      // Clear form
      setUsername('');
      setPassword('');
      
      toast.success("OJS Secure access granted!");
      
      // Load data
      loadInstances(session_token);
      
    } catch (error: any) {
      console.error('OJS Secure login failed:', error);
      const message = error.response?.data?.message || 'Authentication failed';
      toast.error(`Login Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInstances = async (token: string) => {
    setIsLoadingData(true);
    
    try {
      const response = await api.get('/ojs-secure/instances', {
        headers: { 'X-OJS-Session': token }
      });
      
      setInstances(response.data.instances || []);
      toast.success(`Loaded ${response.data.total || 0} OJS instances`);
      
    } catch (error: any) {
      console.error('Failed to load instances:', error);
      
      if (error.response?.status === 401) {
        handleSessionExpired();
      } else {
        toast.error("Failed to load OJS instances");
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleEditCredential = (instance: OjsInstance) => {
    setEditingInstance(instance);
    setEditUsername(instance.ojs_username || '');
    setEditPassword(instance.ojs_password || '');
    setShowEditPassword(false);
    setEditDialogOpen(true);
  };

  const handleSaveCredential = async () => {
    if (!editingInstance) return;
    setIsSaving(true);
    try {
      await ojsAPI.update(editingInstance.id, {
        ojs_username: editUsername || null,
        ojs_password: editPassword || null,
      });
      // Update local state so table reflects change immediately
      setInstances(prev =>
        prev.map(inst =>
          inst.id === editingInstance.id
            ? { ...inst, ojs_username: editUsername || null, ojs_password: editPassword || null }
            : inst
        )
      );
      toast.success('Kredensial OJS berhasil disimpan!');
      setEditDialogOpen(false);
      setEditingInstance(null);
    } catch (error: any) {
      console.error('Failed to save credential:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan kredensial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await api.post('/ojs-secure/logout', {}, {
          headers: { 'X-OJS-Session': sessionToken }
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    setIsAuthenticated(false);
    setSessionToken(null);
    setSessionInfo(null);
    setInstances([]);
    localStorage.removeItem('ojs_secure_token');
    
    toast.success("Logged out from OJS Secure");
  };



  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('id-ID');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OJS Secure Access</h1>
            <p className="text-sm text-gray-500 mt-1">Masukkan kredensial untuk mengakses data OJS</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0 ring-1 ring-gray-200">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username-input" className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full h-11"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password-input" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pr-10 h-11"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !username.trim() || !password.trim()}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Access Secure Area
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 border-t pt-4">
                <Lock className="w-3 h-3 flex-shrink-0" />
                <p>Area ini berisi kredensial OJS sensitif. Akses dicatat dan dipantau.</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">OJS Secure</h1>
            <p className="text-xs text-gray-400 leading-tight">Manajemen kredensial OJS</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {sessionInfo && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Timer className="w-3.5 h-3.5" />
              <span>Sesi berakhir dalam {Math.round(sessionInfo.expires_in_minutes ?? 0)} menit</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-gray-600 hover:text-red-600 hover:border-red-300">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>


      {/* OJS Instances */}
      <Card>
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              OJS Instances (Secure)
            </CardTitle>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Total: {instances.length} instances</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Loading secure data...</span>
            </div>
          ) : instances.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No OJS instances found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-10 font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Holding</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2 max-w-[220px]">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Version</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Username</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Password</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Server</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">CDN</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Updated</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2 w-16">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInstances.map((instance, index) => {
                    const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                    <TableRow key={instance.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 px-3 py-2">{rowNum}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        <span className="inline-block w-[140px] text-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 truncate">
                          {instance.name}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[220px] px-3 py-2">
                        <a
                          href={instance.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium text-sm flex items-center gap-1"
                          title={instance.url}
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2 text-sm">
                        {instance.version ? (
                          <span className="inline-block w-[80px] text-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            {instance.version}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {visibleUsernames.has(instance.id) ? (
                            <code className="bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded text-xs font-mono text-blue-700 dark:text-blue-400">
                              {instance.ojs_username || '-'}
                            </code>
                          ) : (
                            <span className="tracking-widest text-neutral-600 text-xs">
                              {'•'.repeat(Math.min(instance.ojs_username?.length || 6, 10))}
                            </span>
                          )}
                          <button
                            onClick={() => toggleUsernameVisibility(instance.id)}
                            className="text-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
                            title={visibleUsernames.has(instance.id) ? 'Sembunyikan' : 'Tampilkan'}
                          >
                            {visibleUsernames.has(instance.id)
                              ? <EyeOff className="w-3.5 h-3.5" />
                              : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {visiblePasswords.has(instance.id) ? (
                            <code className="bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded text-xs font-mono text-rose-700 dark:text-rose-400">
                              {instance.ojs_password || '-'}
                            </code>
                          ) : (
                            <span className="tracking-widest text-neutral-600 text-xs">
                              {'•'.repeat(Math.min(instance.ojs_password?.length || 8, 10))}
                            </span>
                          )}
                          <button
                            onClick={() => togglePasswordVisibility(instance.id)}
                            className="text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0"
                            title={visiblePasswords.has(instance.id) ? 'Sembunyikan' : 'Tampilkan'}
                          >
                            {visiblePasswords.has(instance.id)
                              ? <EyeOff className="w-3.5 h-3.5" />
                              : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        {instance.server_location ? (
                          <span className="inline-block w-[120px] text-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 truncate">
                            {instance.server_location}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        {instance.cdn_location ? (
                          <span className="inline-block w-[120px] text-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 truncate">
                            {instance.cdn_location}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2 text-xs">
                        {formatDate(instance.updated_at)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditCredential(instance)}
                          title="Edit username & password"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination UI */}
          {!isLoadingData && instances.length > 0 && totalPages > 1 && (
            <div className="mt-4 px-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, instances.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, instances.length)} dari {instances.length} data
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;
                    return (
                      <Button key={`page-${page}`} variant={currentPage === page ? "default" : "outline"} size="sm"
                        className="h-8 w-8 p-0" onClick={() => setCurrentPage(page)}>
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
      {/* Edit Credential Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditingInstance(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4 text-blue-600" />
              Edit Kredensial OJS
            </DialogTitle>
          </DialogHeader>

          {editingInstance && (
            <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-800">{editingInstance.name}</p>
              <p className="text-blue-600 text-xs truncate">{editingInstance.url}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ojs-username">OJS Username</Label>
              <Input
                id="edit-ojs-username"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Masukkan username OJS"
                autoComplete="off"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-ojs-password">OJS Password</Label>
              <div className="relative">
                <Input
                  id="edit-ojs-password"
                  type={showEditPassword ? 'text' : 'password'}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Masukkan password OJS"
                  autoComplete="new-password"
                  className="pr-10"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  disabled={isSaving}
                >
                  {showEditPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveCredential}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Menyimpan...</>
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OjsSecure;