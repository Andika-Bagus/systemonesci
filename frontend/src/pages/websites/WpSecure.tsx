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
import { Lock, Unlock, Shield, Eye, EyeOff, ExternalLink, LogOut, Timer, AlertCircle, Pencil, Search, X, Copy } from "lucide-react";
import api from "@/services/api";
import { websiteAPI } from "@/services/api";

interface WpWebsite {
  id: number;
  holding: string;
  jenis_website: string;
  url: string;
  wp_username: string | null;
  wp_password: string | null;
  wp_login_url: string | null;
  letak_server: string | null;
  cdn_provider: string | null;
  pic: string | null;
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

const WpSecure = () => {
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
  const [websites, setWebsites] = useState<WpWebsite[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Edit credential dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<WpWebsite | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editLoginUrl, setEditLoginUrl] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Per-row show/hide credentials
  const [visibleUsernames, setVisibleUsernames] = useState<Set<number>>(new Set());
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [showAllCredentials, setShowAllCredentials] = useState(false);

  const toggleShowAll = () => {
    setShowAllCredentials(prev => !prev);
    // Clear individual toggles when using show-all
    setVisibleUsernames(new Set());
    setVisiblePasswords(new Set());
  };

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

  const handleCopy = (text: string | null, type: string) => {
    if (!text) {
      toast.error(`${type} kosong`);
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success(`${type} disalin ke clipboard!`);
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!searchTerm.trim()) return websites;
    const term = searchTerm.toLowerCase().trim();
    return websites.filter(website => 
      website.holding?.toLowerCase().includes(term) ||
      website.url?.toLowerCase().includes(term) ||
      website.letak_server?.toLowerCase().includes(term) ||
      website.cdn_provider?.toLowerCase().includes(term) ||
      website.wp_username?.toLowerCase().includes(term) ||
      website.pic?.toLowerCase().includes(term)
    );
  }, [websites, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination states
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.max(1, Math.ceil(filteredWebsites.length / ITEMS_PER_PAGE));
  const paginatedWebsites = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWebsites.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWebsites, currentPage]);

  // Check existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('wp_secure_token');
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
    console.log('WP Secure: Checking session with token:', token.substring(0, 10) + '...');
    
    try {
      const response = await api.get('/wp-secure/session', {
        headers: { 'X-WP-Session': token },
        params: { extend: isUserActive },
        timeout: 60000
      });
      
      const info = response.data as SessionInfo;
      console.log('WP Secure: Session info received:', info);
      setSessionInfo(info);
      
      if (info.authenticated) {
        console.log('WP Secure: Session valid, setting authenticated');
        setIsAuthenticated(true);
        
        // Always load data when session is verified (not just when empty)
        console.log('WP Secure: Loading websites data...');
        await loadWebsites(token);
      } else {
        console.log('WP Secure: Session invalid or expired');
        handleSessionExpired();
      }
    } catch (error) {
      console.error('WP Secure: Session check failed:', error);
      setSessionInfo(null);
      setIsAuthenticated(false);
    }
  };

  const handleSessionExpired = () => {
    setIsAuthenticated(false);
    setSessionToken(null);
    setSessionInfo(null);
    setWebsites([]);
    setSearchTerm('');
    localStorage.removeItem('wp_secure_token');
    toast.error("Session expired. Please login again.");
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/wp-secure/authenticate', {
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
      localStorage.setItem('wp_secure_token', session_token);
      
      // Clear form
      setUsername('');
      setPassword('');
      
      toast.success("WP Secure access granted!");
      
      // Load data
      loadWebsites(session_token);
      
    } catch (error: any) {
      console.error('WP Secure login failed:', error);
      const message = error.response?.data?.message || 'Authentication failed';
      toast.error(`Login Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWebsites = async (token?: string) => {
    const activeToken = token || sessionToken;
    if (!activeToken) {
      console.log('WP Secure: No token available for loading websites');
      return;
    }

    // Prevent multiple simultaneous loads
    if (isLoadingData) {
      console.log('WP Secure: Already loading data, skipping...');
      return;
    }
    
    console.log('WP Secure: Loading websites with token:', activeToken.substring(0, 10) + '...');
    setIsLoadingData(true);
    
    try {
      const response = await api.get('/wp-secure/websites', {
        headers: { 'X-WP-Session': activeToken },
        timeout: 30000
      });
      
      console.log('WP Secure: Websites data received:', response.data);
      const websitesData = response.data.websites || [];
      setWebsites(websitesData);
      
      if (websitesData.length > 0) {
        console.log(`WP Secure: Successfully loaded ${websitesData.length} websites`);
        toast.success(`Loaded ${websitesData.length} WordPress websites`);
      } else {
        console.log('WP Secure: No websites found');
        toast.info('No WordPress websites found in database');
      }
      
    } catch (error: any) {
      console.error('WP Secure: Failed to load websites:', error);
      if (error.response?.status === 401) {
        console.log('WP Secure: 401 error - session expired');
        handleSessionExpired();
      } else {
        const message = error.response?.data?.message || 'Failed to load WordPress websites';
        toast.error(message);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleEditCredential = (website: WpWebsite) => {
    setEditingWebsite(website);
    setEditUsername(website.wp_username || '');
    setEditPassword(website.wp_password || '');
    setEditLoginUrl(website.wp_login_url || '');
    setShowEditPassword(false);
    setEditDialogOpen(true);
  };

  const handleSaveCredentials = async () => {
    if (!editingWebsite) return;
    
    setIsSaving(true);
    try {
      await websiteAPI.update(editingWebsite.id, {
        wp_username: editUsername,
        wp_password: editPassword,
        wp_login_url: editLoginUrl || null,
      });
      
      toast.success('Credentials updated successfully');
      setEditDialogOpen(false);
      
      // Update local state instead of full reload for better UX
      setWebsites(prev => prev.map(w => 
        w.id === editingWebsite.id 
          ? { ...w, wp_username: editUsername, wp_password: editPassword, wp_login_url: editLoginUrl || null }
          : w
      ));
      
    } catch (error: any) {
      console.error('Failed to update credentials:', error);
      toast.error(error.response?.data?.message || 'Failed to update credentials');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await api.post('/wp-secure/logout', {}, {
          headers: { 'X-WP-Session': sessionToken }
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    setIsAuthenticated(false);
    setSessionToken(null);
    setSessionInfo(null);
    setWebsites([]);
    setSearchTerm('');
    localStorage.removeItem('wp_secure_token');
    
    toast.success("Logged out from WP Secure");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('id-ID');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center mt-6 lg:mt-14 mb-4">
        <div className="w-full max-w-md">

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">WP Secure Access</h1>
            <p className="text-sm text-gray-500 mt-1">Masukkan kredensial untuk mengakses data WordPress</p>
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
                <p>Area ini berisi kredensial WordPress sensitif. Akses dicatat dan dipantau.</p>
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
            <h1 className="text-xl font-bold text-gray-900 leading-tight">WP Secure</h1>
            <p className="text-xs text-gray-400 leading-tight">Manajemen kredensial WordPress</p>
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


      {/* WordPress Websites */}
      <Card>
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              WordPress Websites (Secure)
            </CardTitle>
            <div className="flex items-center gap-3">
              {websites.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Cari holding, URL, username, server..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-9 pr-8 h-9 text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
                Total: {filteredWebsites.length !== websites.length ? `${filteredWebsites.length} / ${websites.length}` : websites.length} websites
              </span>
              <button
                onClick={toggleShowAll}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  showAllCredentials
                    ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                title={showAllCredentials ? 'Sembunyikan semua kredensial' : 'Tampilkan semua kredensial sekaligus'}
              >
                {showAllCredentials ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showAllCredentials ? 'Sembunyikan Semua' : 'Tampilkan Semua'}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Loading secure data...</span>
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {websites.length === 0 ? "No WordPress websites found" : "Tidak ada data yang cocok dengan pencarian"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <TableHead className="w-8 font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Holding</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Username</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Password</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Updated</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px] px-1 py-2 text-center">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedWebsites.map((website, index) => {
                    const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                    <TableRow key={website.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 px-1 py-2 text-[11px] text-center">{rowNum}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-center">
                        <span className="inline-block w-[100px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 truncate" title={website.holding}>
                          {website.holding}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] px-1 py-2">
                        <a
                          href={website.wp_login_url || website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium text-[11px] flex items-center gap-1"
                          title={website.wp_login_url ? `Custom Login: ${website.wp_login_url}` : website.url}
                        >
                          <span className="truncate">
                            {website.wp_login_url 
                              ? website.wp_login_url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                              : website.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-center">
                        <div className="flex items-center justify-center w-full min-w-[120px] max-w-[140px] mx-auto">
                          <div className="flex-1 min-w-0">
                            {(showAllCredentials || visibleUsernames.has(website.id)) ? (
                              <code className={`block truncate px-2 py-1 rounded text-xs font-mono ${
                                website.wp_username
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : 'bg-red-50 dark:bg-red-900/30 text-red-500 italic'
                              }`} title={website.wp_username || ''}>
                                {website.wp_username || '— kosong —'}
                              </code>
                            ) : (
                              <span className="tracking-widest text-neutral-600 text-xs">
                                {'•'.repeat(8)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              onClick={() => handleCopy(website.wp_username, 'Username')}
                              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                              title="Salin Username"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleUsernameVisibility(website.id)}
                              className="text-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
                              title={visibleUsernames.has(website.id) ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {(showAllCredentials || visibleUsernames.has(website.id))
                                ? <EyeOff className="w-3.5 h-3.5" />
                                : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-center">
                        <div className="flex items-center justify-center w-full min-w-[120px] max-w-[140px] mx-auto">
                          <div className="flex-1 min-w-0">
                            {(showAllCredentials || visiblePasswords.has(website.id)) ? (
                              <code className={`block truncate px-2 py-1 rounded text-xs font-mono ${
                                website.wp_password
                                  ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                  : 'bg-red-50 dark:bg-red-900/30 text-red-500 italic'
                              }`} title={website.wp_password || ''}>
                                {website.wp_password || '— kosong —'}
                              </code>
                            ) : (
                              <span className="tracking-widest text-neutral-600 text-xs">
                                {'•'.repeat(8)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              onClick={() => handleCopy(website.wp_password, 'Password')}
                              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                              title="Salin Password"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => togglePasswordVisibility(website.id)}
                              className="text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0"
                              title={visiblePasswords.has(website.id) ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {(showAllCredentials || visiblePasswords.has(website.id))
                                ? <EyeOff className="w-3.5 h-3.5" />
                                : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-[10px] text-center">
                        {formatDate(website.updated_at)}
                      </TableCell>
                      <TableCell className="px-1 py-2 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditCredential(website)}
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
          {!isLoadingData && filteredWebsites.length > 0 && totalPages > 1 && (
            <div className="mt-4 px-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredWebsites.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredWebsites.length)} dari {filteredWebsites.length} data
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
      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditingWebsite(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4 text-blue-600" />
              Edit Kredensial WordPress
            </DialogTitle>
          </DialogHeader>

          {editingWebsite && (
            <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-800">{editingWebsite.holding}</p>
              <p className="text-blue-600 text-xs truncate">{editingWebsite.url}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-wp-username">WordPress Username</Label>
              <Input
                id="edit-wp-username"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Masukkan username WordPress"
                autoComplete="off"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-wp-password">WordPress Password</Label>
              <div className="relative">
                <Input
                  id="edit-wp-password"
                  type={showEditPassword ? 'text' : 'password'}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Masukkan password WordPress"
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

            <div className="space-y-2">
              <Label htmlFor="edit-wp-login-url">Custom Login URL (Opsional)</Label>
              <Input
                id="edit-wp-login-url"
                type="url"
                value={editLoginUrl}
                onChange={(e) => setEditLoginUrl(e.target.value)}
                placeholder="Contoh: https://domain.com/login-rahasia"
                autoComplete="off"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500">Isi jika website menggunakan Hide Login.</p>
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
                onClick={handleSaveCredentials}
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

export default WpSecure;