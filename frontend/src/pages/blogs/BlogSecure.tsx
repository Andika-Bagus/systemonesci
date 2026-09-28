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
import { Lock, Unlock, Shield, Eye, EyeOff, LogOut, Timer, AlertCircle, Pencil, Search, X, Copy, RefreshCw } from "lucide-react";
import { blogSecureAPI } from "@/services/api";

interface Blog {
  id: number;
  holding: string;
  jenis_website: string;
  url: string;
  blog_username: string | null;
  blog_password: string | null;
  blog_admin_url: string | null;
  letak_server: string | null;
  cdn_provider: string | null;
  pic: string | null;
  created_at: string;
  updated_at: string;
}

interface SessionInfo {
  valid?: boolean;
  authenticated?: boolean;
  expires_at?: string;
  expires_in_minutes?: number;
  user?: string;
  expired?: boolean;
  message?: string;
}

const BlogSecure = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Blogs data - try to restore from sessionStorage on mount
  const [blogs, setBlogs] = useState<Blog[]>(() => {
    try {
      const cached = sessionStorage.getItem('blog_secure_data');
      if (cached) {
        console.log('[Blog Secure] Restored cached blogs from sessionStorage');
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('[Blog Secure] Failed to restore cached data:', e);
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Edit modal states
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editAdminUrl, setEditAdminUrl] = useState('');
  const [editShowPassword, setEditShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Per-row show/hide credentials
  const [visibleUsernames, setVisibleUsernames] = useState<Set<number>>(new Set());
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [showAllCredentials, setShowAllCredentials] = useState(false);

  const toggleShowAll = () => {
    setShowAllCredentials(prev => !prev);
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
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('id-ID');
  };


  // Save blogs to sessionStorage whenever they change
  useEffect(() => {
    if (blogs.length > 0) {
      try {
        sessionStorage.setItem('blog_secure_data', JSON.stringify(blogs));
        console.log('[Blog Secure] Cached', blogs.length, 'blogs to sessionStorage');
      } catch (e) {
        console.error('[Blog Secure] Failed to cache blogs:', e);
      }
    }
  }, [blogs]);

  // Handle page visibility change to refresh data when user comes back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && sessionToken) {
        console.log('[Blog Secure] Page became visible, refreshing session and data...');
        checkSessionAndLoadData(sessionToken);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, sessionToken]);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    return blogs.filter(blog =>
      blog.holding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.pic?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBlogs, currentPage]);

  // Check main system authentication and existing Blog Secure session on mount
  useEffect(() => {
    console.log('[Blog Secure] Component mounted, checking authentication...');
    
    // CRITICAL: Check if user is logged in to main system first
    const mainAuthToken = localStorage.getItem('auth_token');
    console.log('[Blog Secure] Main auth token:', mainAuthToken ? 'Found' : 'NOT FOUND');
    
    if (!mainAuthToken) {
      console.warn('[Blog Secure] No main authentication token found!');
      toast.error('Anda harus login terlebih dahulu untuk mengakses Blog Secure');
      
      // Redirect to login with return URL
      setTimeout(() => {
        window.location.href = '/login?redirect=/blog-secure';
      }, 2000);
      return;
    }
    
    console.log('[Blog Secure] Main auth OK, checking for Blog Secure token...');
    const savedToken = localStorage.getItem('blog_secure_token');
    
    if (savedToken) {
      console.log('[Blog Secure] Found saved Blog token:', savedToken.substring(0, 20) + '...');
      setSessionToken(savedToken);
      // Always verify session and load data
      checkSessionAndLoadData(savedToken);
    } else {
      console.log('[Blog Secure] No saved Blog token found');
      // Reset states if no token
      setIsAuthenticated(false);
      setBlogs([]);
    }
  }, []); // Empty dependency - only run on mount

  // Session timeout handler
  useEffect(() => {
    if (!isAuthenticated || !sessionToken) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivityRef.current;
      
      if (timeSinceActivity > 25 * 60 * 1000) { // 25 minutes
        console.log('[Blog Secure] Approaching session timeout, checking session...');
        checkSessionAndLoadData(sessionToken);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionToken]);

  const checkSessionAndLoadData = async (token: string) => {
    console.log('[Blog Secure] Checking session and loading data with token:', token.substring(0, 20) + '...');
    
    try {
      // Use the dedicated API service method
      const response = await blogSecureAPI.getSessionInfo(token);
      
      console.log('[Blog Secure] Session info response:', response.data);
      
      const info = response.data;
      
      if (info.authenticated) {
        console.log('[Blog Secure] Session valid, setting authenticated state');
        setIsAuthenticated(true);
        setSessionInfo(info);
        setSessionToken(token); // Ensure token is set in state
        
        // Only load data if we don't have cached data or if this is a forced refresh
        if (blogs.length === 0 || !isInitialLoad) {
          console.log('[Blog Secure] Loading fresh blogs data...');
          await loadBlogs(token);
        } else {
          console.log('[Blog Secure] Using cached blogs data, count:', blogs.length);
        }
        
        setIsInitialLoad(false);
        
      } else {
        console.warn('[Blog Secure] Session not authenticated');
        handleSessionExpired();
      }
    } catch (error: any) {
      console.error('[Blog Secure] Session check failed:', error);
      console.error('[Blog Secure] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Only handle session expired if it's actually an auth error
      if (error.response?.status === 401) {
        handleSessionExpired();
      } else {
        // For other errors, just log but don't logout
        console.warn('[Blog Secure] Non-auth error during session check, keeping session');
        toast.error('Error checking session: ' + (error.response?.data?.message || error.message));
        
        // If we have cached data and there's a network error, keep showing it
        if (blogs.length > 0) {
          setIsAuthenticated(true);
          console.log('[Blog Secure] Network error but using cached data');
        }
      }
    }
  };



  const forceRefresh = async () => {
    if (!sessionToken) {
      toast.error('No active session');
      return;
    }
    
    setIsRefreshing(true);
    console.log('[Blog Secure] Force refreshing data...');
    
    try {
      await loadBlogs(sessionToken);
      toast.success('Data refreshed successfully');
    } catch (error: any) {
      console.error('[Blog Secure] Force refresh failed:', error);
      toast.error('Failed to refresh: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSessionExpired = () => {
    console.log('[Blog Secure] Handling session expiration');
    setIsAuthenticated(false);
    setSessionToken(null);
    setBlogs([]);
    setSearchTerm('');
    setSessionInfo(null);
    localStorage.removeItem('blog_secure_token');
    sessionStorage.removeItem('blog_secure_data');
    toast.error("Session expired. Please login again.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    lastActivityRef.current = Date.now();
    
    try {
      console.log('[Blog Secure] Attempting login with username:', username.trim());
      
      // Use the dedicated API service method
      const response = await blogSecureAPI.authenticate(username.trim(), password.trim());
      
      console.log('[Blog Secure] Login response:', response.data);
      
      const { session_token, expires_at, expires_in_minutes } = response.data;
      
      setSessionToken(session_token);
      setIsAuthenticated(true);
      setSessionInfo({
        authenticated: true,
        expires_at,
        expires_in_minutes
      });
      
      // Save to localStorage
      localStorage.setItem('blog_secure_token', session_token);
      
      // Clear form
      setUsername('');
      setPassword('');
      
      toast.success("Blog Secure access granted!");
      
      // Load data immediately after successful login
      console.log('[Blog Secure] Loading blogs after successful login...');
      await loadBlogs(session_token);
      
    } catch (error: any) {
      console.error('[Blog Secure] Login failed:', error);
      console.error('[Blog Secure] Login error response:', error.response?.data);
      const message = error.response?.data?.message || 'Authentication failed';
      toast.error(`Login Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlogs = async (token: string) => {
    console.log('[Blog Secure] Loading blogs with token...');
    lastActivityRef.current = Date.now();
    
    try {
      // Use the dedicated API service method
      const response = await blogSecureAPI.getBlogs(token);
      
      console.log('[Blog Secure] API response received');
      console.log('[Blog Secure] Response status:', response.status);
      console.log('[Blog Secure] Response data keys:', Object.keys(response.data || {}));
      console.log('[Blog Secure] Full response data:', response.data);
      
      const blogData = response.data?.blogs || response.data || [];
      const totalBlogs = response.data?.total || blogData.length || 0;
      
      console.log('[Blog Secure] Extracted blog data:', {
        blogDataType: Array.isArray(blogData) ? 'array' : typeof blogData,
        blogDataLength: Array.isArray(blogData) ? blogData.length : 'not array',
        totalBlogs,
        sampleBlog: Array.isArray(blogData) && blogData.length > 0 ? blogData[0] : null
      });
      
      // Ensure we set blogs even if empty array
      const finalBlogData = Array.isArray(blogData) ? blogData : [];
      console.log('[Blog Secure] Setting blogs state with', finalBlogData.length, 'items');
      setBlogs(finalBlogData);
      
      // Reset to first page when data loads
      setCurrentPage(1);
      
      if (finalBlogData.length === 0) {
        console.warn('[Blog Secure] No blog data received or data is not in expected format');
        toast.info('No blog data found');
      } else {
        console.log('[Blog Secure] Successfully loaded blogs:', finalBlogData.length);
        toast.success(`Loaded ${finalBlogData.length} blogs successfully`);
      }
      
    } catch (error: any) {
      console.error('[Blog Secure] Failed to load blogs:', error);
      console.error('[Blog Secure] Error response data:', error.response?.data);
      console.error('[Blog Secure] Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        console.error('[Blog Secure] 401 during data load - session expired');
        handleSessionExpired();
      } else {
        console.error('[Blog Secure] Non-auth error loading blogs:', error.response?.data);
        toast.error('Failed to load blogs: ' + (error.response?.data?.message || error.message));
        
        // Don't reset authentication on non-auth errors
        // Just show error but keep user logged in
      }
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setEditUsername(blog.blog_username || '');
    setEditPassword(blog.blog_password || '');
    setEditAdminUrl(blog.blog_admin_url || '');
    setEditShowPassword(false);
  };

  const handleSaveCredentials = async () => {
    if (!editingBlog) return;
    
    console.log('[Blog Secure] Saving credential for blog:', editingBlog.id);
    console.log('[Blog Secure] New username:', editUsername);
    console.log('[Blog Secure] New password length:', editPassword?.length || 0);
    
    // CRITICAL: Verify main system authentication before updating
    const mainAuthToken = localStorage.getItem('auth_token');
    console.log('[Blog Secure] Main auth token:', mainAuthToken ? 'Found (' + mainAuthToken.substring(0, 20) + '...)' : 'NOT FOUND');
    
    if (!mainAuthToken) {
      console.error('[Blog Secure] No main auth token! Cannot update without main system login.');
      toast.error('Session expired. Please login again.');
      setTimeout(() => {
        window.location.href = '/login?redirect=/blog-secure';
      }, 1500);
      return;
    }

    if (!sessionToken) {
      console.error('[Blog Secure] No blog session token!');
      toast.error('Blog secure session expired. Please re-authenticate.');
      setIsAuthenticated(false);
      return;
    }

    setIsSaving(true);
    try {
      console.log('[Blog Secure] Calling API update...');
      
      // Use the dedicated API service method
      const response = await blogSecureAPI.updateCredentials(
        editingBlog.id, 
        {
          blog_username: editUsername || null,
          blog_password: editPassword || null,
          blog_admin_url: editAdminUrl || null,
        },
        sessionToken
      );
      
      console.log('[Blog Secure] Update response status:', response.status);
      console.log('[Blog Secure] Update response data:', response.data);
      
      // Update local state so table reflects change immediately
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog.id === editingBlog.id
            ? { ...blog, blog_username: editUsername || null, blog_password: editPassword || null, blog_admin_url: editAdminUrl || null }
            : blog
        )
      );
      
      toast.success('Blog credentials updated successfully');
      setEditingBlog(null);
    } catch (error: any) {
      console.error('[Blog Secure] Failed to save credential:', error);
      console.error('[Blog Secure] Error response:', error.response?.data);
      console.error('[Blog Secure] Error status:', error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error('[Blog Secure] 401 Unauthorized - main auth token invalid/expired');
        toast.error('Authentication expired. Redirecting to login...');
        localStorage.removeItem('auth_token');
        setTimeout(() => {
          window.location.href = '/login?redirect=/blog-secure';
        }, 1500);
      } else if (error.response?.status === 403) {
        console.error('[Blog Secure] 403 Forbidden - user lacks permission');
        toast.error('Anda tidak memiliki izin untuk mengupdate credentials');
      } else {
        toast.error('Failed to update credentials: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        // Use the dedicated API service method
        await blogSecureAPI.logout(sessionToken);
      } catch (error) {
        console.error('[Blog Secure] Logout error:', error);
      }
    }
    
    setIsAuthenticated(false);
    setSessionToken(null);
    setBlogs([]);
    setSearchTerm('');
    setSessionInfo(null);
    localStorage.removeItem('blog_secure_token');
    sessionStorage.removeItem('blog_secure_data');
    
    toast.success("Logged out from Blog Secure");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center mt-6 lg:mt-14 mb-4">
        <div className="w-full max-w-md">

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Secure Access</h1>
            <p className="text-sm text-gray-500 mt-1">Masukkan kredensial untuk mengakses data Blog</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0 ring-1 ring-gray-200">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleLogin} className="space-y-4">
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
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 mt-2"
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
                <p>Area ini berisi kredensial Blog sensitif. Akses dicatat dan dipantau.</p>
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
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Blog Secure</h1>
            <p className="text-xs text-gray-400 leading-tight">Manajemen kredensial Blog</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {sessionInfo && (
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
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

      {/* Blog Instances */}
      <Card>
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              Blog Instances (Secure)
            </CardTitle>
            <div className="flex items-center gap-3">
              {blogs.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Cari holding, URL, username, server..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                Total: {filteredBlogs.length !== blogs.length ? `${filteredBlogs.length} / ${blogs.length}` : blogs.length} blogs
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
              <Button
                variant="outline"
                size="sm"
                onClick={forceRefresh}
                disabled={isRefreshing || !sessionToken}
                className="flex items-center gap-1.5 h-9"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {blogs.length === 0 ? "No Blog instances found" : "Tidak ada data yang cocok dengan pencarian"}
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
                  {paginatedBlogs.map((blog, index) => {
                    const rowNum = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                    <TableRow key={blog.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 px-1 py-2 text-[11px] text-center">{rowNum}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-center">
                        <span className="inline-block w-[100px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 truncate" title={blog.holding}>
                          {blog.holding}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] px-1 py-2">
                        <a
                          href={blog.blog_admin_url || blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium text-[11px] flex items-center gap-1"
                          title={blog.blog_admin_url ? `Custom Login: ${blog.blog_admin_url}` : blog.url}
                        >
                          <span className="truncate">
                            {blog.blog_admin_url 
                              ? blog.blog_admin_url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                              : blog.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                        </a>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-center">
                        <div className="flex items-center justify-center w-full min-w-[120px] max-w-[140px] mx-auto">
                          <div className="flex-1 min-w-0">
                            {(showAllCredentials || visibleUsernames.has(blog.id)) ? (
                              <code className={`block truncate px-2 py-1 rounded text-xs font-mono ${
                                blog.blog_username
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : 'bg-red-50 dark:bg-red-900/30 text-red-500 italic'
                              }`} title={blog.blog_username || ''}>
                                {blog.blog_username || '— kosong —'}
                              </code>
                            ) : (
                              <span className="tracking-widest text-neutral-600 text-xs">
                                {'•'.repeat(8)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              onClick={() => copyToClipboard(blog.blog_username || '', 'Username')}
                              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                              title="Salin Username"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleUsernameVisibility(blog.id)}
                              className="text-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
                              title={visibleUsernames.has(blog.id) ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {(showAllCredentials || visibleUsernames.has(blog.id))
                                ? <EyeOff className="w-3.5 h-3.5" />
                                : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-center">
                        <div className="flex items-center justify-center w-full min-w-[120px] max-w-[140px] mx-auto">
                          <div className="flex-1 min-w-0">
                            {(showAllCredentials || visiblePasswords.has(blog.id)) ? (
                              <code className={`block truncate px-2 py-1 rounded text-xs font-mono ${
                                blog.blog_password
                                  ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                  : 'bg-red-50 dark:bg-red-900/30 text-red-500 italic'
                              }`} title={blog.blog_password || ''}>
                                {blog.blog_password || '— kosong —'}
                              </code>
                            ) : (
                              <span className="tracking-widest text-neutral-600 text-xs">
                                {'•'.repeat(8)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              onClick={() => copyToClipboard(blog.blog_password || '', 'Password')}
                              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                              title="Salin Password"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => togglePasswordVisibility(blog.id)}
                              className="text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0"
                              title={visiblePasswords.has(blog.id) ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {(showAllCredentials || visiblePasswords.has(blog.id))
                                ? <EyeOff className="w-3.5 h-3.5" />
                                : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-1 py-2 text-[10px] text-center">
                        {formatDate(blog.updated_at)}
                      </TableCell>
                      <TableCell className="px-1 py-2 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleEditBlog(blog)}
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
          {filteredBlogs.length > 0 && Math.ceil(filteredBlogs.length / itemsPerPage) > 1 && (
            <div className="mt-4 px-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBlogs.length)} - {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} dari {filteredBlogs.length} data
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(Math.ceil(filteredBlogs.length / itemsPerPage), 5) }, (_, i) => {
                    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
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
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredBlogs.length / itemsPerPage), p + 1))} disabled={currentPage === Math.ceil(filteredBlogs.length / itemsPerPage)}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>

      {/* Edit Credential Dialog */}
      <Dialog open={!!editingBlog} onOpenChange={(open) => { if (!open) setEditingBlog(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4 text-emerald-600" />
              Edit Kredensial Blog
            </DialogTitle>
          </DialogHeader>

          {editingBlog && (
            <div className="space-y-2 mb-4 p-3 bg-emerald-50 rounded-lg text-sm">
              <p className="font-medium text-emerald-800">{editingBlog.holding}</p>
              <p className="text-emerald-600 text-xs truncate">{editingBlog.url}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username Blog</Label>
              <Input
                id="edit-username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Masukkan username"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Password Blog</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={editShowPassword ? "text" : "password"}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Masukkan password"
                  disabled={isSaving}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setEditShowPassword(!editShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSaving}
                >
                  {editShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-admin-url">Custom Login URL (Opsional)</Label>
              <Input
                id="edit-admin-url"
                type="url"
                value={editAdminUrl}
                onChange={(e) => setEditAdminUrl(e.target.value)}
                placeholder="Contoh: https://domain.com/login-rahasia"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500">Isi jika website menggunakan custom login URL.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setEditingBlog(null)}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveCredentials}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogSecure;
