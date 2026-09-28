import re

with open('c:/Users/Hype AMD/Downloads/sci/frontend/src/pages/blogs/BlogSecure.tsx', 'r', encoding='utf-8') as f:
    blog_content = f.read()

# Add states and handlers if missing
if 'visibleUsernames' not in blog_content:
    hook_str = """
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
"""
    blog_content = blog_content.replace("const [isSaving, setIsSaving] = useState(false);", "const [isSaving, setIsSaving] = useState(false);" + hook_str)

# Replace the return block
new_return = """  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
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
                    <TableHead className="w-10 font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">No</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Holding</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2 max-w-[220px]">URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Admin URL</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Username</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Password</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2">Updated</TableHead>
                    <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2 w-16">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBlogs.map((blog, index) => {
                    const rowNum = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                    <TableRow key={blog.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 px-3 py-2">{rowNum}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        <span className="inline-block w-[140px] text-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 truncate">
                          {blog.holding}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[220px] px-3 py-2">
                        <a
                          href={blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-medium text-sm"
                          title={blog.url}
                        >
                          {blog.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2 text-sm">
                        {blog.blog_admin_url ? (
                          <a
                            href={blog.blog_admin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline truncate block font-medium text-sm"
                            title={blog.blog_admin_url}
                          >
                            Admin Link
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        <div className="flex items-center w-[160px]">
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
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2">
                        <div className="flex items-center w-[160px]">
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
                      <TableCell className="text-neutral-600 dark:text-neutral-400 px-3 py-2 text-xs">
                        {formatDate(blog.updated_at)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
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
              <Label htmlFor="edit-admin-url">Admin URL</Label>
              <Input
                id="edit-admin-url"
                value={editAdminUrl}
                onChange={(e) => setEditAdminUrl(e.target.value)}
                placeholder="Masukkan Admin URL"
                disabled={isSaving}
              />
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
"""

idx = blog_content.find('  if (!isAuthenticated) {')
blog_content = blog_content[:idx] + new_return

with open('c:/Users/Hype AMD/Downloads/sci/frontend/src/pages/blogs/BlogSecure.tsx', 'w', encoding='utf-8') as f:
    f.write(blog_content)
print("Updated BlogSecure.tsx")
