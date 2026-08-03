import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Upload, 
  Image, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Plus, 
  LogOut, 
  Settings,
  Save,
  X,
  FileImage,
  Video,
  MapPin,
  Clock,
  Users,
  Star,
  Layout,
  ExternalLink,
  Building,
  Menu,
  Palmtree,
  Waves,
  FileText
} from 'lucide-react';
import { MediaField } from '@/components/admin/MediaPicker';

interface Experience {
  id: number;
  title: string;
  category: string;
  pricePerPerson: string;
  priceFor2?: string | null;
  priceFor3?: string | null;
  priceFor4?: string | null;
  priceFor5?: string | null;
  priceFor6?: string | null;
  priceFor7?: string | null;
  priceFor8?: string | null;
  duration: string;
  maxGuests: number;
  minAge: number;
  difficulty: string;
  summary: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType: string;
  eco: boolean;
  luxury: boolean;
  wellness: boolean;
  isActive: boolean;
  updatedAt: Date;
}

interface Hotel {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  blurb: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  category: string;
  pricePerNight?: string;
  amenities: string[];
  destination: string;
  eco: boolean;
  luxury: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UploadedImage {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  category: string;
  pageId?: string;
  sectionId?: string;
  description?: string;
  uploadedAt: Date;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Page Builder Management Component
function PageBuilderManagement() {
  const [location, setLocation] = useLocation();
  const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageMeta, setNewPageMeta] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pages
  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey: ['/api/admin/pages'],
    retry: false,
  });

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (pageData: { title: string; slug: string; metaDescription?: string }) => {
      const response = await apiRequest('POST', '/api/admin/pages', pageData);
      return response.json();
    },
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Page created",
        description: `Page "${newPage.title}" has been created successfully.`,
      });
      setNewPageDialogOpen(false);
      setNewPageTitle('');
      setNewPageSlug('');
      setNewPageMeta('');
    },
    onError: (error) => {
      toast({
        title: "Error creating page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (pageId: number) => {
      await apiRequest('DELETE', `/api/admin/pages/${pageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Page deleted",
        description: "Page has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ pageId, isPublished }: { pageId: number; isPublished: boolean }) => {
      const response = await apiRequest('PUT', `/api/admin/pages/${pageId}`, { isPublished });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Page updated",
        description: "Page publish status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) return;
    
    const slug = newPageSlug.trim() || newPageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    createPageMutation.mutate({
      title: newPageTitle.trim(),
      slug,
      metaDescription: newPageMeta.trim() || undefined,
    });
  };

  const handleEditPage = (pageId: number) => {
    setLocation(`/admin/page-builder/${pageId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Page Builder</h2>
          <p className="text-gray-600">Create and manage dynamic pages with drag-and-drop content blocks</p>
        </div>
        <Dialog open={newPageDialogOpen} onOpenChange={setNewPageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <Label htmlFor="page-slug">Page Slug</Label>
                <Input
                  id="page-slug"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="page-slug (auto-generated if empty)"
                />
              </div>
              <div>
                <Label htmlFor="page-meta">Meta Description</Label>
                <Textarea
                  id="page-meta"
                  value={newPageMeta}
                  onChange={(e) => setNewPageMeta(e.target.value)}
                  placeholder="Enter meta description for SEO"
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleCreatePage}
                disabled={!newPageTitle.trim() || createPageMutation.isPending}
                className="w-full"
              >
                {createPageMutation.isPending ? 'Creating...' : 'Create Page'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pages.map((page: Page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    {page.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    /{page.slug}
                  </p>
                  {page.metaDescription && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {page.metaDescription}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPage(page.id)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant={page.isPublished ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePublishMutation.mutate({ 
                      pageId: page.id, 
                      isPublished: !page.isPublished 
                    })}
                  >
                    {page.isPublished ? 'Published' : 'Draft'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePageMutation.mutate(page.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Created: {new Date(page.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Updated: {new Date(page.updatedAt).toLocaleDateString()}
                </span>
                {page.isPublished && (
                  <a 
                    href={`/pages/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Live
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {pages.length === 0 && (
          <div className="text-center py-12">
            <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first page to get started with the page builder
            </p>
            <Button onClick={() => setNewPageDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [newHotelDialogOpen, setNewHotelDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadPageId, setUploadPageId] = useState('');
  const [uploadSectionId, setUploadSectionId] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPageId, setFilterPageId] = useState('all');
  type AdminView =
    | "siwa-hotels"
    | "nc-hotels"
    | "siwa-tours"
    | "nc-tours"
    | "experiences"
    | "blog"
    | "pages-editor"
    | "images"
    | "pages"
    | "ai-knowledge";
  const [activeView, setActiveView] = useState<AdminView>("siwa-hotels");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [listPage, setListPage] = useState(1);
  useEffect(() => { setListPage(1); }, [activeView]);
  const PAGE_SIZE = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  // Fetch experiences
  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ['/api/admin/experiences'],
    retry: false,
  });

  // Fetch hotels
  const { data: hotels = [], isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: ['/api/admin/hotels'],
    retry: false,
  });

  // Fetch blog posts (admin — drafts included)
  const { data: blogPostsList = [] } = useQuery({
    queryKey: ['/api/admin/blog'],
    retry: false,
  });

  // Fetch images
  const { data: images = [], isLoading: imagesLoading } = useQuery({
    queryKey: ['/api/admin/images', filterCategory, filterPageId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterCategory && filterCategory !== 'all') params.append('category', filterCategory);
      if (filterPageId && filterPageId !== 'all') params.append('pageId', filterPageId);
      
      const url = `/api/admin/images?${params.toString()}`;
      const token = localStorage.getItem('adminToken');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      return response.json();
    },
    retry: false,
  });

  // Update experience mutation
  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Experience> }) => {
      const response = await apiRequest('PUT', `/api/admin/experiences/${id}`, data);
      if (!response.ok) throw new Error('Failed to update experience');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/experiences'] });
      // Public overlays + tour detail page
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          typeof q.queryKey[0] === 'string' &&
          (q.queryKey[0] as string).startsWith('/api/experiences/by-slug'),
      });
      setEditingExperience(null);
      toast({
        title: "Experience Updated",
        description: "Experience has been successfully updated",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update experience",
        variant: "destructive"
      });
    }
  });

  // Upload images mutation
  const uploadImagesMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      setUploadDialogOpen(false);
      setSelectedFiles(null);
      setUploadDescription('');
      toast({
        title: "Upload Successful",
        description: "Images have been uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images",
        variant: "destructive"
      });
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/images/${id}`);
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Image Deleted",
        description: "Image has been successfully deleted",
      });
    },
  });

  // === HOTEL CRUD MUTATIONS ===
  
  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (data: Partial<Hotel>) => {
      const response = await apiRequest('POST', '/api/admin/hotels', data);
      if (!response.ok) throw new Error('Failed to create hotel');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hotels'] });
      setNewHotelDialogOpen(false);
      toast({
        title: "Hotel Created",
        description: "Hotel has been successfully created",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create hotel",
        variant: "destructive"
      });
    }
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Hotel> }) => {
      const response = await apiRequest('PUT', `/api/admin/hotels/${id}`, data);
      if (!response.ok) throw new Error('Failed to update hotel');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hotels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hotels'] });
      setEditingHotel(null);
      toast({
        title: "Hotel Updated",
        description: "Hotel has been successfully updated",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update hotel",
        variant: "destructive"
      });
    }
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/hotels/${id}`);
      if (!response.ok) throw new Error('Failed to delete hotel');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hotels'] });
      toast({
        title: "Hotel Deleted",
        description: "Hotel has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete hotel",
        variant: "destructive"
      });
    }
  });

  // ── Blog posts admin ────────────────────────────────────
  type BlogPostRecord = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    category: string;
    author: string;
    readTime: number;
    featured: boolean;
    isPublished: boolean;
    destination: string | null;
    articleType: string | null;
    linkedExperience: string | null;
    tags: string[];
    content: string[];
    publishedAt?: string;
  };
  const [editingPost, setEditingPost] = useState<BlogPostRecord | null>(null);
  const [creatingPost, setCreatingPost] = useState(false);

  const createBlogMutation = useMutation({
    mutationFn: async (data: Partial<BlogPostRecord>) => {
      const response = await apiRequest('POST', '/api/admin/blog', data);
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({ title: 'Post created', description: 'New post saved successfully' });
      setCreatingPost(false);
    },
    onError: () => {
      toast({ title: 'Create failed', description: 'Could not create the post', variant: 'destructive' });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BlogPostRecord> }) => {
      const response = await apiRequest('PUT', `/api/admin/blog/${id}`, data);
      if (!response.ok) throw new Error('Failed to update post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({ title: 'Post updated', description: 'Changes saved successfully' });
      setEditingPost(null);
    },
    onError: () => {
      toast({ title: 'Update failed', description: 'Could not save the post', variant: 'destructive' });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/blog/${id}`);
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({ title: 'Post deleted', description: 'The post has been removed' });
    },
    onError: () => {
      toast({ title: 'Delete failed', description: 'Could not delete the post', variant: 'destructive' });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setLocation('/admin/login');
  };

  const handleUpdateExperience = (data: Partial<Experience>) => {
    if (!editingExperience) return;
    updateExperienceMutation.mutate({
      id: editingExperience.id,
      data
    });
  };

  const handleFileUpload = () => {
    if (!selectedFiles) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('images', file);
    });
    formData.append('category', uploadCategory);
    formData.append('pageId', uploadPageId);
    formData.append('sectionId', uploadSectionId === 'none' ? '' : uploadSectionId);
    formData.append('description', uploadDescription);

    uploadImagesMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (experiencesLoading || hotelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream font-body">
        <div className="text-center">
          <div className="font-display text-[1.4rem] text-navy mb-2 tracking-[0.18em]">SOLÉI</div>
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-ink-soft/60">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  // Sidebar nav model — grouped Shopify-style
  type NavItem = { id: AdminView; label: string; icon: any };
  type NavGroup = { label: string; items: NavItem[] };
  const navGroups: NavGroup[] = [
    {
      label: "Properties",
      items: [
        { id: "siwa-hotels", label: "Siwa hotels", icon: Palmtree },
        { id: "nc-hotels", label: "North Coast hotels", icon: Waves },
      ],
    },
    {
      label: "Experiences",
      items: [
        { id: "siwa-tours", label: "Siwa tours", icon: Palmtree },
        { id: "nc-tours", label: "North Coast tours", icon: Waves },
        { id: "experiences", label: "Legacy pricing", icon: DollarSign },
      ],
    },
    {
      label: "Editorial",
      items: [
        { id: "blog", label: "Blog posts", icon: FileImage },
      ],
    },
    {
      label: "Content",
      items: [
        { id: "pages-editor", label: "Site content", icon: Layout },
        { id: "pages", label: "Custom pages", icon: FileText },
        { id: "images", label: "Image library", icon: Image },
      ],
    },
    {
      label: "AI",
      items: [
        { id: "ai-knowledge", label: "AI Knowledge", icon: FileText },
      ],
    },
  ];

  const activeMeta = navGroups
    .flatMap((g) => g.items)
    .find((n) => n.id === activeView) ?? navGroups[0].items[0];

  const Sidebar = (
    <aside className="bg-navy text-white/85 w-full md:w-64 md:flex-shrink-0 md:h-screen md:sticky md:top-0 flex flex-col">
      <div className="px-6 pt-7 pb-6 border-b border-white/8 flex items-center justify-between">
        <a
          href="/"
          className="font-display text-[1.2rem] text-gold tracking-[0.22em]"
          style={{ letterSpacing: "0.22em" }}
        >
          SOLÉI
        </a>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden text-white/60"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-6 mb-2 text-[0.52rem] tracking-[0.3em] uppercase text-white/35">
              {group.label}
            </p>
            <div className="flex flex-col">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`group flex items-center gap-3 px-6 py-2.5 text-[0.78rem] font-body transition-colors text-left ${
                      active
                        ? "bg-white/5 text-gold border-l-2 border-gold pl-[22px]"
                        : "text-white/70 hover:text-white hover:bg-white/3 border-l-2 border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/8 flex flex-col gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase text-white/55 hover:text-gold transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View live site
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-[0.6rem] tracking-[0.18em] uppercase text-white/55 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-cream font-body text-ink flex flex-col md:flex-row">
      {/* Sidebar — desktop */}
      <div className="hidden md:block">{Sidebar}</div>

      {/* Sidebar — mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-72">{Sidebar}</div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-sand sticky top-0 z-10">
          <div className="px-6 md:px-10 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden text-navy"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <p className="text-[0.52rem] tracking-[0.3em] uppercase text-ink-soft/55">
                  Admin · {navGroups.find((g) => g.items.some((i) => i.id === activeView))?.label}
                </p>
                <h1 className="font-display text-[1.05rem] text-navy leading-tight">
                  {activeMeta.label}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">

          {/* Experience / Tour Management — split by destination */}
          {(activeView === "experiences" ||
            activeView === "siwa-tours" ||
            activeView === "nc-tours") && (<div className="space-y-6">
            {(() => {
              const all = experiences as Experience[];
              const expFilter =
                activeView === "siwa-tours"
                  ? (e: Experience) => (e as any).destination === "siwa"
                  : activeView === "nc-tours"
                  ? (e: Experience) => (e as any).destination === "north-coast"
                  : (e: Experience) => !(e as any).destination;
              const filtered = all.filter(expFilter);
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const pageNum = Math.min(listPage, totalPages);
              const paged = filtered.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);
              const heading =
                activeView === "siwa-tours"
                  ? "Siwa tours"
                  : activeView === "nc-tours"
                  ? "North Coast tours"
                  : "Legacy pricing records";
              const eyebrow =
                activeView === "siwa-tours"
                  ? `Siwa Oasis · ${filtered.length} tours`
                  : activeView === "nc-tours"
                  ? `North Coast · ${filtered.length} tours`
                  : `Legacy · ${filtered.length} records`;
              return (
                <>
                  <div className="flex justify-between items-end pb-2">
                    <div>
                      <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">
                        {eyebrow}
                      </p>
                      <h2 className="font-display text-[1.4rem] text-navy">{heading}</h2>
                    </div>
                    {(activeView === "siwa-tours" || activeView === "nc-tours") && (
                      <Button
                        onClick={() => setLocation("/admin/tours/new")}
                        className="bg-gold hover:bg-gold-light text-navy rounded-none h-10 px-5 text-[0.6rem] tracking-[0.2em] uppercase font-body shadow-none"
                      >
                        <Plus className="w-3.5 h-3.5 mr-2" />
                        Add Tour
                      </Button>
                    )}
                  </div>
                  {filtered.length === 0 && (
                    <div className="text-center py-16 text-ink-soft/55 border border-dashed border-sand">
                      <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-40" />
                      <p className="text-[0.78rem]">No records in this view yet.</p>
                    </div>
                  )}
                  <div className="grid gap-6">
                    {paged.map((experience: Experience) => (
                <Card key={experience.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {experience.mediaType === 'video' ? 
                            <Video className="w-5 h-5 text-teal-600" /> : 
                            <FileImage className="w-5 h-5 text-teal-600" />
                          }
                          {experience.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {experience.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {experience.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Max {experience.maxGuests}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-600">
                            ${experience.pricePerPerson}
                          </div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                        <PublishDraftButtons
                          isLive={experience.isActive !== false}
                          itemLabel={experience.title}
                          onPublish={() =>
                            updateExperienceMutation.mutate({
                              id: experience.id,
                              data: { isActive: true },
                            })
                          }
                          onDraft={() =>
                            updateExperienceMutation.mutate({
                              id: experience.id,
                              data: { isActive: false },
                            })
                          }
                        />
                        <Button
                          onClick={() => {
                            // Bundled tours (have a slug) open the new wizard;
                            // legacy pricing-only records keep the inline dialog.
                            if ((experience as any).slug) {
                              setLocation(`/admin/tours/${experience.id}/edit`);
                            } else {
                              setEditingExperience(experience);
                            }
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{experience.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {experience.eco && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Eco-Friendly
                        </span>
                      )}
                      {experience.luxury && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          Luxury
                        </span>
                      )}
                      {experience.wellness && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Wellness
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {experience.difficulty}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      page={pageNum}
                      totalPages={totalPages}
                      onChange={setListPage}
                    />
                  )}
                </>
              );
            })()}
          </div>)}

          {/* Hotels Management — split by destination */}
          {(activeView === "siwa-hotels" || activeView === "nc-hotels") && (<div className="space-y-6">
            {(() => {
              const dest = activeView === "siwa-hotels" ? "siwa" : "north-coast";
              const filtered = hotels.filter((h: Hotel) => h.destination === dest);
              const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
              const pageNum = Math.min(listPage, totalPages);
              const paged = filtered.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);
              const destLabel = activeView === "siwa-hotels" ? "Siwa Oasis" : "North Coast";
              return (
                <>
                  <div className="flex justify-between items-end pb-2">
                    <div>
                      <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">
                        {destLabel} · {filtered.length} properties
                      </p>
                      <h2 className="font-display text-[1.4rem] text-navy">
                        {destLabel} hotels
                      </h2>
                    </div>
                    <Button
                      onClick={() => setLocation("/admin/hotels/new")}
                      className="bg-gold hover:bg-gold-light text-navy rounded-none h-10 px-5 text-[0.6rem] tracking-[0.2em] uppercase font-body shadow-none"
                    >
                      <Plus className="w-3.5 h-3.5 mr-2" />
                      Add Hotel
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {filtered.length === 0 && (
                      <div className="text-center py-16 text-ink-soft/55 border border-dashed border-sand rounded-none">
                        <Building className="w-8 h-8 mx-auto mb-3 opacity-40" />
                        <p className="text-[0.78rem]">
                          No {destLabel} hotels yet. Click "Add Hotel" to create one.
                        </p>
                      </div>
                    )}
                    {paged.map((hotel: Hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white border border-sand hover:border-gold transition-colors duration-300 flex flex-col md:flex-row"
                >
                  <div className="md:w-40 h-32 md:h-auto bg-cream flex-shrink-0 overflow-hidden">
                    {hotel.imageUrl ? (
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-soft/30">
                        <Building className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gold mb-1">
                        {hotel.destination === "siwa" ? "Siwa Oasis" : "North Coast"} · {hotel.category}
                      </p>
                      <h3 className="font-display text-[1.05rem] text-navy mb-1 leading-snug truncate">
                        {hotel.name}
                      </h3>
                      <p className="text-[0.78rem] text-ink-soft leading-[1.7] line-clamp-2">
                        {hotel.blurb}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-[0.6rem] text-ink-soft/65">
                        {hotel.pricePerNight && (
                          <span className="font-display text-navy text-[0.85rem]">
                            {hotel.pricePerNight}
                          </span>
                        )}
                        {hotel.eco && (
                          <span className="text-[0.52rem] tracking-[0.18em] uppercase text-[#5a8a6a] border border-sand-light px-2 py-0.5">
                            Eco
                          </span>
                        )}
                        {hotel.luxury && (
                          <span className="text-[0.52rem] tracking-[0.18em] uppercase text-gold border border-sand-light px-2 py-0.5">
                            Luxury
                          </span>
                        )}
                        {!hotel.isActive && (
                          <span className="text-[0.52rem] tracking-[0.18em] uppercase text-rose-600 border border-rose-200 px-2 py-0.5">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-2">
                      <PublishDraftButtons
                        isLive={hotel.isActive}
                        itemLabel={hotel.name}
                        onPublish={() =>
                          updateHotelMutation.mutate({
                            id: hotel.id,
                            data: { isActive: true },
                          })
                        }
                        onDraft={() =>
                          updateHotelMutation.mutate({
                            id: hotel.id,
                            data: { isActive: false },
                          })
                        }
                      />
                      <Button
                        onClick={() => setLocation(`/admin/hotels/${hotel.id}/edit`)}
                        variant="outline"
                        size="sm"
                        className="rounded-none border-sand text-[0.58rem] tracking-[0.18em] uppercase hover:border-gold hover:text-navy text-ink-soft px-3"
                      >
                        <Edit3 className="w-3 h-3 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm(`Delete ${hotel.name}?`)) {
                            deleteHotelMutation.mutate(hotel.id);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-none border-sand text-rose-600 hover:bg-rose-50 hover:border-rose-300 px-3"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      page={pageNum}
                      totalPages={totalPages}
                      onChange={setListPage}
                    />
                  )}
                </>
              );
            })()}
          </div>)}

          {/* Blog Management */}
          {activeView === "blog" && (<div className="space-y-6">
            <div className="flex justify-between items-end pb-2">
              <div>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">
                  Journal · {(blogPostsList as BlogPostRecord[]).length} posts
                </p>
                <h2 className="font-display text-[1.4rem] text-navy">Blog posts</h2>
              </div>
              <Button
                onClick={() => setLocation("/admin/blog/new")}
                className="rounded-none bg-gold hover:bg-gold-light text-navy text-[0.62rem] tracking-[0.2em] uppercase px-5 py-2"
              >
                <Plus className="w-3.5 h-3.5 mr-2" />
                New post
              </Button>
            </div>
            <div className="grid gap-3">
              {(blogPostsList as BlogPostRecord[]).length === 0 && (
                <div className="text-center py-16 text-ink-soft/55 border border-dashed border-sand">
                  <FileImage className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-[0.78rem]">No blog posts yet.</p>
                </div>
              )}
              {((blogPostsList as BlogPostRecord[])
                .slice((Math.min(listPage, Math.max(1, Math.ceil((blogPostsList as BlogPostRecord[]).length / PAGE_SIZE))) - 1) * PAGE_SIZE,
                       Math.min(listPage, Math.max(1, Math.ceil((blogPostsList as BlogPostRecord[]).length / PAGE_SIZE))) * PAGE_SIZE)
              ).map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-sand hover:border-gold transition-colors duration-300 flex flex-col md:flex-row"
                >
                  <div className="md:w-40 h-32 md:h-auto bg-cream flex-shrink-0 overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-soft/30">
                        <FileImage className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gold mb-1">
                        {post.category} · {post.readTime} min read
                      </p>
                      <h3 className="font-display text-[1.05rem] text-navy mb-1 leading-snug truncate">
                        {post.title}
                      </h3>
                      <p className="text-[0.78rem] text-ink-soft leading-[1.7] line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-[0.55rem] tracking-[0.18em] uppercase">
                        {post.featured && (
                          <span className="text-gold border border-sand-light px-2 py-0.5">
                            Featured
                          </span>
                        )}
                        {!post.isPublished && (
                          <span className="text-rose-600 border border-rose-200 px-2 py-0.5">
                            Draft
                          </span>
                        )}
                        {post.destination && (
                          <span className="text-ink-soft/65 border border-sand-light px-2 py-0.5">
                            {post.destination === "siwa" ? "Siwa" : "North Coast"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-2">
                      <Button
                        onClick={() => setLocation(`/admin/blog/${post.id}/edit`)}
                        variant="outline"
                        size="sm"
                        className="rounded-none border-sand text-[0.58rem] tracking-[0.18em] uppercase hover:border-gold hover:text-navy text-ink-soft px-3"
                      >
                        <Edit3 className="w-3 h-3 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm(`Delete "${post.title}"?`)) {
                            deleteBlogMutation.mutate(post.id);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-none border-sand text-rose-600 hover:bg-rose-50 hover:border-rose-300 px-3"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(blogPostsList as BlogPostRecord[]).length > PAGE_SIZE && (
              <Pagination
                page={Math.min(listPage, Math.max(1, Math.ceil((blogPostsList as BlogPostRecord[]).length / PAGE_SIZE)))}
                totalPages={Math.max(1, Math.ceil((blogPostsList as BlogPostRecord[]).length / PAGE_SIZE))}
                onChange={setListPage}
              />
            )}
          </div>)}

          {/* Pages editor — master/detail view over site_content */}
          {activeView === "pages-editor" && (
            <PagesEditor toast={toast} />
          )}

          {/* Custom builder pages — create, edit, draft/publish */}
          {activeView === "pages" && <PageBuilderManagement />}

          {/* AI Knowledge — upload PDFs / text files the chat AI uses */}
          {activeView === "ai-knowledge" && <AIKnowledgePanel toast={toast} />}

          {/* Image Management */}
          {activeView === "images" && (<div className="space-y-6">
            <div className="flex justify-between items-end pb-2">
              <div>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">
                  Library · {Array.isArray(images) ? images.length : 0} files
                </p>
                <h2 className="font-display text-[1.4rem] text-navy">Image library</h2>
              </div>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gold hover:bg-gold-light text-navy rounded-none h-10 px-5 text-[0.6rem] tracking-[0.2em] uppercase font-body shadow-none">
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    Upload Images
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload New Images</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="images">Select Images</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => setSelectedFiles(e.target.files)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={uploadCategory} onValueChange={setUploadCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="experience">Experience</SelectItem>
                          <SelectItem value="destination">Destination</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pageId">Assign to Page (Optional)</Label>
                      <p className="text-sm text-gray-600 mb-2">Choose which page these images should appear on</p>
                      <Select value={uploadPageId} onValueChange={setUploadPageId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a page to assign these images to" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No specific page (general use)</SelectItem>
                          <SelectItem value="home">🏠 Home Page</SelectItem>
                          <SelectItem value="north-coast">🏖️ North Coast Destination</SelectItem>
                          <SelectItem value="siwa-sanctuary">🏜️ Siwa Sanctuary</SelectItem>
                          <SelectItem value="adrere-amellal">🏨 Adrere Amellal Hotel</SelectItem>
                          <SelectItem value="salt-lake-float-therapy">💧 Salt Lake Float Therapy</SelectItem>
                          <SelectItem value="shali-fortress">🏛️ Shali Fortress</SelectItem>
                          <SelectItem value="oracle-temple">⛩️ Oracle Temple</SelectItem>
                          <SelectItem value="mountain-biking">🚴 Mountain Biking</SelectItem>
                          <SelectItem value="desert-safari">🐪 Desert Safari</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        className="mt-2"
                        value={uploadPageId}
                        onChange={(e) => setUploadPageId(e.target.value)}
                        placeholder="Or enter custom page ID"
                      />
                    </div>
                    
                    {/* Section Assignment */}
                    {uploadPageId && uploadPageId !== 'none' && (
                      <div>
                        <Label htmlFor="sectionId">Assign to Section (Optional)</Label>
                        <p className="text-sm text-gray-600 mb-2">Choose exactly where on the page this image should appear</p>
                        <Select value={uploadSectionId} onValueChange={setUploadSectionId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a section on the page" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No specific section</SelectItem>
                            {uploadPageId === 'north-coast' && (
                              <>
                                <SelectItem value="hero">🎬 Hero Section (Main video/image)</SelectItem>
                                <SelectItem value="resorts">🏨 Resorts Carousel</SelectItem>
                                <SelectItem value="experiences">🏄 Experiences Gallery</SelectItem>
                                <SelectItem value="offers">💰 Offers Section</SelectItem>
                                <SelectItem value="plan">📅 Plan Trip Section</SelectItem>
                              </>
                            )}
                            {uploadPageId === 'siwa-sanctuary' && (
                              <>
                                <SelectItem value="hero">🎬 Hero Section</SelectItem>
                                <SelectItem value="experiences">🏜️ Desert Experiences</SelectItem>
                                <SelectItem value="hotels">🏨 Hotels Section</SelectItem>
                                <SelectItem value="culture">🏛️ Culture & History</SelectItem>
                              </>
                            )}
                            {uploadPageId === 'adrere-amellal' && (
                              <>
                                <SelectItem value="hero">🎬 Hero Section</SelectItem>
                                <SelectItem value="rooms">🛏️ Rooms Gallery</SelectItem>
                                <SelectItem value="amenities">🏊 Amenities Section</SelectItem>
                                <SelectItem value="dining">🍽️ Dining Section</SelectItem>
                                <SelectItem value="activities">🏄 Activities Section</SelectItem>
                              </>
                            )}
                            {uploadPageId === 'salt-lake-float-therapy' && (
                              <>
                                <SelectItem value="hero">🎬 Hero Section</SelectItem>
                                <SelectItem value="gallery">📸 Photo Gallery</SelectItem>
                                <SelectItem value="details">ℹ️ Experience Details</SelectItem>
                                <SelectItem value="pricing">💰 Pricing Section</SelectItem>
                              </>
                            )}
                            {uploadPageId === 'home' && (
                              <>
                                <SelectItem value="hero">🎬 Hero Section</SelectItem>
                                <SelectItem value="destinations">🗺️ Destinations Overview</SelectItem>
                                <SelectItem value="north-coast">🏖️ North Coast Section</SelectItem>
                                <SelectItem value="siwa">🏜️ Siwa Section</SelectItem>
                                <SelectItem value="experiences">🎯 Experiences Section</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="Describe the images..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleFileUpload}
                        disabled={!selectedFiles || uploadImagesMutation.isPending}
                      >
                        {uploadImagesMutation.isPending ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Helper Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">How to Assign Images to Pages</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• <strong>Step 1:</strong> Click "Upload Images" and select your files</p>
                <p>• <strong>Step 2:</strong> Choose a category (hotel, experience, destination, general)</p>
                <p>• <strong>Step 3:</strong> Select which page to assign the images to</p>
                <p>• <strong>Step 4:</strong> Choose the specific section on that page (optional)</p>
                <p>• <strong>Step 5:</strong> Add a description (optional) and upload</p>
                <div className="bg-blue-100 p-2 rounded mt-2">
                  <p className="font-medium">💡 Pro Tip:</p>
                  <p>Now you can assign images to specific sections! For example, assign to "North Coast" → "Hero Section" to specify exactly where the image should appear on that page.</p>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Filter by Category:</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="destination">Destination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Filter by Page:</Label>
                  <Select value={filterPageId} onValueChange={setFilterPageId}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Pages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages</SelectItem>
                      <SelectItem value="home">Home Page</SelectItem>
                      <SelectItem value="north-coast">North Coast</SelectItem>
                      <SelectItem value="siwa-sanctuary">Siwa Sanctuary</SelectItem>
                      <SelectItem value="adrere-amellal">Adrere Amellal Hotel</SelectItem>
                      <SelectItem value="salt-lake-float-therapy">Salt Lake Float Therapy</SelectItem>
                      <SelectItem value="shali-fortress">Shali Fortress</SelectItem>
                      <SelectItem value="oracle-temple">Oracle Temple</SelectItem>
                      <SelectItem value="mountain-biking">Mountain Biking</SelectItem>
                      <SelectItem value="desert-safari">Desert Safari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterPageId('all');
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {imagesLoading ? (
              <div className="text-center py-8">Loading images...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No images found</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    {filterPageId !== 'all' && (
                      <p>No images have been uploaded for the "{filterPageId}" page.</p>
                    )}
                    {filterCategory !== 'all' && (
                      <p>No images found in the "{filterCategory}" category.</p>
                    )}
                    <p>Try uploading some images or changing your filter settings.</p>
                  </div>
                  <Button
                    onClick={() => setUploadDialogOpen(true)}
                    className="mt-4"
                  >
                    Upload Images
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image: UploadedImage) => (
                  <Card key={image.id}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        {image.mimeType.startsWith('video/') ? (
                          <video
                            src={image.path}
                            className="w-full h-32 object-cover rounded"
                            controls
                          />
                        ) : (
                          <img
                            src={image.path}
                            alt={image.originalName}
                            className="w-full h-32 object-cover rounded"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <Button
                          onClick={() => deleteImageMutation.mutate(image.id)}
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-sm truncate" title={image.originalName}>
                          {image.originalName}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{image.category}</span>
                          <span>{formatFileSize(image.size)}</span>
                        </div>
                        {image.pageId && (
                          <p className="text-xs text-blue-600">Page: {image.pageId}</p>
                        )}
                        {image.sectionId && (
                          <p className="text-xs text-purple-600">Section: {image.sectionId}</p>
                        )}
                        {image.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-400">
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>)}

        </main>
      </div>

      {/* Edit Tour Dialog (bundled tours — uses TourForm) */}
      {editingExperience && (editingExperience as any).slug && (
        <Dialog open={!!editingExperience} onOpenChange={() => setEditingExperience(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit tour</DialogTitle>
            </DialogHeader>
            <TourForm
              tour={editingExperience as any}
              onSubmit={(data) =>
                updateExperienceMutation.mutate({ id: editingExperience.id, data })
              }
              onCancel={() => setEditingExperience(null)}
              isLoading={updateExperienceMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Experience Dialog (legacy pricing — old form) */}
      {editingExperience && !(editingExperience as any).slug && (
        <Dialog open={!!editingExperience} onOpenChange={() => setEditingExperience(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Price Per Person ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingExperience.pricePerPerson}
                    onChange={(e) => setEditingExperience({
                      ...editingExperience,
                      pricePerPerson: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={editingExperience.duration}
                    onChange={(e) => setEditingExperience({
                      ...editingExperience,
                      duration: e.target.value
                    })}
                  />
                </div>
              </div>
              
              {/* Tiered Pricing Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Tiered Pricing (Optional)</Label>
                  <p className="text-sm text-gray-600">Set custom prices for different group sizes</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>2 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor2 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor2: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                  <div>
                    <Label>3 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor3 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor3: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                  <div>
                    <Label>4 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor4 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor4: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                  <div>
                    <Label>5 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor5 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor5: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>6 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor6 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor6: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                  <div>
                    <Label>7 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor7 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor7: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                  <div>
                    <Label>8 Guests Total ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingExperience.priceFor8 || ''}
                      onChange={(e) => setEditingExperience({
                        ...editingExperience,
                        priceFor8: e.target.value
                      })}
                      placeholder="Auto-calculate"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Note:</strong> Leave fields empty to use base price × guest count. Custom prices override automatic calculation.
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Max Guests</Label>
                  <Input
                    type="number"
                    value={editingExperience.maxGuests}
                    onChange={(e) => setEditingExperience({
                      ...editingExperience,
                      maxGuests: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Min Age</Label>
                  <Input
                    type="number"
                    value={editingExperience.minAge}
                    onChange={(e) => setEditingExperience({
                      ...editingExperience,
                      minAge: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={editingExperience.difficulty}
                    onValueChange={(value) => setEditingExperience({
                      ...editingExperience,
                      difficulty: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={editingExperience.summary}
                  onChange={(e) => setEditingExperience({
                    ...editingExperience,
                    summary: e.target.value
                  })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingExperience.description}
                  onChange={(e) => setEditingExperience({
                    ...editingExperience,
                    description: e.target.value
                  })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingExperience(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateExperience(editingExperience)}
                  disabled={updateExperienceMutation.isPending}
                >
                  {updateExperienceMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hotel Creation Dialog */}
      <Dialog open={newHotelDialogOpen} onOpenChange={setNewHotelDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Hotel</DialogTitle>
          </DialogHeader>
          <HotelForm 
            onSubmit={(data) => createHotelMutation.mutate(data)}
            onCancel={() => setNewHotelDialogOpen(false)}
            isLoading={createHotelMutation.isPending}
            submitText="Create Hotel"
          />
        </DialogContent>
      </Dialog>

      {/* Hotel Editing Dialog */}
      {editingHotel && (
        <Dialog open={true} onOpenChange={() => setEditingHotel(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Hotel</DialogTitle>
            </DialogHeader>
            <HotelForm
              hotel={editingHotel}
              onSubmit={(data) => updateHotelMutation.mutate({ id: editingHotel.id, data })}
              onCancel={() => setEditingHotel(null)}
              isLoading={updateHotelMutation.isPending}
              submitText="Update Hotel"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Blog post create/edit now lives at /admin/blog/new and
          /admin/blog/:id/edit — see admin-blog-wizard.tsx. */}
    </div>
  );
}

// Hotel Form Component
function HotelForm({ 
  hotel, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  submitText = "Save" 
}: {
  hotel?: Hotel;
  onSubmit: (data: Partial<Hotel>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
}) {
  const hotelDetails = (hotel as any)?.details ?? {};
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    slug: hotel?.slug || '',
    imageUrl: hotel?.imageUrl || '',
    blurb: hotel?.blurb || '',
    description: hotel?.description || '',
    latitude: hotel?.latitude || '',
    longitude: hotel?.longitude || '',
    category: hotel?.category || '',
    pricePerNight: hotel?.pricePerNight || '',
    amenities: hotel?.amenities ? hotel.amenities.join(', ') : '',
    destination: hotel?.destination || 'north-coast',
    eco: hotel?.eco || false,
    luxury: hotel?.luxury || false,
    isActive: hotel?.isActive !== undefined ? hotel.isActive : true,
    // Rich detail-page content
    tagLine: hotelDetails.tagLine || '',
    heroTag: hotelDetails.heroTag || '',
    eyebrow: hotelDetails.eyebrow || '',
    headline: hotelDetails.headline || '',
    headlineItalic: hotelDetails.headlineItalic || '',
    intro: (hotelDetails.intro ?? []).join('\n\n'),
    heroMeta: (hotelDetails.heroMeta ?? []).join('\n'),
    priceLabel: hotelDetails.priceLabel || '',
    facts: hotelDetails.facts ?? [],
    rooms: hotelDetails.rooms ?? [],
    location: hotelDetails.location ?? [],
    reviews: hotelDetails.reviews ?? [],
  });

  type Fact = { label: string; value: string };
  type Room = { name: string; type: string; desc: string; sqm: string; beds: string; occupancy: string; price: number };
  type Review = { name: string; origin: string; text: string };

  const updateAt = (key: 'facts' | 'rooms' | 'location' | 'reviews', i: number, patch: any) =>
    setFormData((d) => ({
      ...d,
      [key]: (d as any)[key].map((item: any, idx: number) =>
        idx === i ? { ...item, ...patch } : item,
      ),
    }));
  const addAt = (key: 'facts' | 'rooms' | 'location' | 'reviews', empty: any) =>
    setFormData((d) => ({ ...d, [key]: [...(d as any)[key], empty] }));
  const removeAt = (key: 'facts' | 'rooms' | 'location' | 'reviews', i: number) =>
    setFormData((d) => ({
      ...d,
      [key]: (d as any)[key].filter((_: any, idx: number) => idx !== i),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArray = formData.amenities
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const details: Record<string, any> = {
      ...(hotelDetails || {}),
      tagLine: formData.tagLine || undefined,
      heroTag: formData.heroTag || undefined,
      eyebrow: formData.eyebrow || undefined,
      headline: formData.headline || undefined,
      headlineItalic: formData.headlineItalic || undefined,
      intro: formData.intro.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean),
      heroMeta: formData.heroMeta.split('\n').map((p: string) => p.trim()).filter(Boolean),
      priceLabel: formData.priceLabel || undefined,
      facts: (formData.facts as Fact[]).filter((f) => f.label.trim() || f.value.trim()),
      rooms: (formData.rooms as Room[]).filter((r) => r.name.trim()),
      location: (formData.location as Fact[]).filter((l) => l.label.trim() || l.value.trim()),
      reviews: (formData.reviews as Review[]).filter((r) => r.text.trim()),
    };

    const submitData: any = {
      name: formData.name,
      slug: formData.slug,
      imageUrl: formData.imageUrl || null,
      blurb: formData.blurb,
      description: formData.description || null,
      category: formData.category,
      pricePerNight: formData.pricePerNight || null,
      amenities: amenitiesArray,
      destination: formData.destination,
      eco: formData.eco,
      luxury: formData.luxury,
      isActive: formData.isActive,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      details,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Hotel Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/hotel-image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="blurb">Short Description *</Label>
        <Textarea
          id="blurb"
          value={formData.blurb}
          onChange={(e) => setFormData({ ...formData, blurb: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="destination">Destination *</Label>
          <Select value={formData.destination} onValueChange={(value) => setFormData({ ...formData, destination: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north-coast">North Coast</SelectItem>
              <SelectItem value="siwa">Siwa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Resort, Boutique, Luxury"
            required
          />
        </div>
        <div>
          <Label htmlFor="pricePerNight">Price per Night</Label>
          <Input
            id="pricePerNight"
            value={formData.pricePerNight}
            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
            placeholder="e.g., $200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="e.g., 31.0409"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="e.g., 28.9578"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Textarea
          id="amenities"
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          rows={3}
          placeholder="Pool, WiFi, Restaurant, Spa, Beach Access"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.eco}
            onChange={(e) => setFormData({ ...formData, eco: e.target.checked })}
            className="rounded"
          />
          <span>Eco-Friendly</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.luxury}
            onChange={(e) => setFormData({ ...formData, luxury: e.target.checked })}
            className="rounded"
          />
          <span>Luxury</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded"
          />
          <span>Active</span>
        </label>
      </div>

      {/* ── Detail page content (JSONB) ── */}
      <section className="space-y-4 border-t border-sand pt-5">
        <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Detail page content</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tagLine">Tag line</Label>
            <Input id="tagLine" value={formData.tagLine}
              onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
              placeholder="Eco Lodge · No electricity · Salt lake front" />
          </div>
          <div>
            <Label htmlFor="heroTag">Hero tag chip</Label>
            <Input id="heroTag" value={formData.heroTag}
              onChange={(e) => setFormData({ ...formData, heroTag: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="eyebrow">Eyebrow</Label>
            <Input id="eyebrow" value={formData.eyebrow}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              placeholder="The property" />
          </div>
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="headlineItalic">Headline italic</Label>
            <Input id="headlineItalic" value={formData.headlineItalic}
              onChange={(e) => setFormData({ ...formData, headlineItalic: e.target.value })} />
          </div>
        </div>

        <div>
          <Label htmlFor="intro">Intro paragraphs (separated by a blank line)</Label>
          <Textarea id="intro" rows={6} value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
            className="font-mono text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="heroMeta">Hero meta (one chip per line)</Label>
            <Textarea id="heroMeta" rows={4} value={formData.heroMeta}
              onChange={(e) => setFormData({ ...formData, heroMeta: e.target.value })}
              className="font-mono text-xs" />
          </div>
          <div>
            <Label htmlFor="priceLabel">Price label</Label>
            <Input id="priceLabel" value={formData.priceLabel}
              onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
              placeholder="/ night · full board" />
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="space-y-3 border-t border-sand pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Quick facts</h3>
          <Button type="button" variant="outline" size="sm"
            onClick={() => addAt('facts', { label: '', value: '' })}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add fact
          </Button>
        </div>
        {(formData.facts as Fact[]).length === 0 && (
          <p className="text-xs text-ink-soft/60 italic">No facts yet.</p>
        )}
        {(formData.facts as Fact[]).map((fact, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <Input value={fact.label}
              onChange={(e) => updateAt('facts', i, { label: e.target.value })}
              placeholder="Property type" />
            <Input value={fact.value}
              onChange={(e) => updateAt('facts', i, { value: e.target.value })}
              placeholder="Eco Lodge" />
            <Button type="button" variant="outline" size="sm"
              onClick={() => removeAt('facts', i)} className="text-rose-600">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </section>

      {/* Rooms */}
      <section className="space-y-3 border-t border-sand pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Rooms</h3>
          <Button type="button" variant="outline" size="sm"
            onClick={() => addAt('rooms', { name: '', type: '', desc: '', sqm: '', beds: '', occupancy: '', price: 0 })}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add room
          </Button>
        </div>
        {(formData.rooms as Room[]).length === 0 && (
          <p className="text-xs text-ink-soft/60 italic">No rooms yet.</p>
        )}
        {(formData.rooms as Room[]).map((room, i) => (
          <div key={i} className="border border-sand-light p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={room.name} onChange={(e) => updateAt('rooms', i, { name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Input value={room.type} onChange={(e) => updateAt('rooms', i, { type: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea rows={2} value={room.desc}
                onChange={(e) => updateAt('rooms', i, { desc: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <Label className="text-xs">m²</Label>
                <Input value={room.sqm} onChange={(e) => updateAt('rooms', i, { sqm: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Beds</Label>
                <Input value={room.beds} onChange={(e) => updateAt('rooms', i, { beds: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Occupancy</Label>
                <Input value={room.occupancy} onChange={(e) => updateAt('rooms', i, { occupancy: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Price (€)</Label>
                <Input type="number" value={room.price}
                  onChange={(e) => updateAt('rooms', i, { price: Number(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm"
                onClick={() => removeAt('rooms', i)} className="text-rose-600">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove room
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* Location */}
      <section className="space-y-3 border-t border-sand pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Location & transfers</h3>
          <Button type="button" variant="outline" size="sm"
            onClick={() => addAt('location', { label: '', value: '' })}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add row
          </Button>
        </div>
        {(formData.location as Fact[]).map((loc, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <Input value={loc.label}
              onChange={(e) => updateAt('location', i, { label: e.target.value })}
              placeholder="From Cairo" />
            <Input value={loc.value}
              onChange={(e) => updateAt('location', i, { value: e.target.value })}
              placeholder="~8 hours by private vehicle" />
            <Button type="button" variant="outline" size="sm"
              onClick={() => removeAt('location', i)} className="text-rose-600">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </section>

      {/* Reviews */}
      <section className="space-y-3 border-t border-sand pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Guest reviews</h3>
          <Button type="button" variant="outline" size="sm"
            onClick={() => addAt('reviews', { name: '', origin: '', text: '' })}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add review
          </Button>
        </div>
        {(formData.reviews as Review[]).map((review, i) => (
          <div key={i} className="border border-sand-light p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={review.name} onChange={(e) => updateAt('reviews', i, { name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Origin</Label>
                <Input value={review.origin}
                  onChange={(e) => updateAt('reviews', i, { origin: e.target.value })}
                  placeholder="France · Stayed October 2024" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Quote</Label>
              <Textarea rows={2} value={review.text}
                onChange={(e) => updateAt('reviews', i, { text: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm"
                onClick={() => removeAt('reviews', i)} className="text-rose-600">
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove review
              </Button>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end gap-2 pt-4 border-t border-sand sticky bottom-0 bg-white">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-gold hover:bg-gold-light text-navy">
          {isLoading ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}

// ── Blog post form ────────────────────────────────────────────
function BlogPostForm({
  post,
  onSubmit,
  onCancel,
  isLoading,
}: {
  post: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    category: post.category || "Siwa",
    author: post.author || "Soléi Editorial",
    readTime: post.readTime ?? 5,
    featured: !!post.featured,
    isPublished: post.isPublished !== false,
    destination: post.destination || "",
    articleType: post.articleType || "",
    linkedExperience: post.linkedExperience || "",
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    content: Array.isArray(post.content) ? post.content.join("\n\n") : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      coverImage: formData.coverImage || null,
      category: formData.category,
      author: formData.author,
      readTime: Number(formData.readTime) || 5,
      featured: formData.featured,
      isPublished: formData.isPublished,
      destination: formData.destination || null,
      articleType: formData.articleType || null,
      linkedExperience: formData.linkedExperience || null,
      tags: formData.tags
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      content: formData.content
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          placeholder="/attached_assets/your-image.jpg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Siwa">Siwa</SelectItem>
              <SelectItem value="North Coast">North Coast</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Culture">Culture</SelectItem>
              <SelectItem value="Travel Tips">Travel Tips</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Select
            value={formData.destination || "none"}
            onValueChange={(v) => setFormData({ ...formData, destination: v === "none" ? "" : v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— None —</SelectItem>
              <SelectItem value="siwa">Siwa</SelectItem>
              <SelectItem value="north-coast">North Coast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="articleType">Article type</Label>
          <Select
            value={formData.articleType || "none"}
            onValueChange={(v) => setFormData({ ...formData, articleType: v === "none" ? "" : v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— None —</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="readTime">Read time (min)</Label>
          <Input
            id="readTime"
            type="number"
            min={1}
            value={formData.readTime}
            onChange={(e) => setFormData({ ...formData, readTime: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="linkedExperience">Linked experience slug</Label>
          <Input
            id="linkedExperience"
            value={formData.linkedExperience}
            onChange={(e) => setFormData({ ...formData, linkedExperience: e.target.value })}
            placeholder="optional"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="content">Content — paragraphs separated by a blank line</Label>
        <Textarea
          id="content"
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          />
          Published
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-sand">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-gold hover:bg-gold-light text-navy">
          {isLoading ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

// ── Tour rich-detail form ─────────────────────────────────────
function TourForm({
  tour,
  onSubmit,
  onCancel,
  isLoading,
}: {
  tour: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const details = tour.details ?? {};
  const [formData, setFormData] = useState({
    title: tour.title || "",
    slug: tour.slug || "",
    summary: tour.summary || "",
    description: tour.description || "",
    category: tour.category || "",
    duration: tour.duration || "",
    pricePerPerson: tour.pricePerPerson || "0",
    maxGuests: tour.maxGuests ?? 8,
    destination: tour.destination || "siwa",
    imageUrl: tour.imageUrl || "",
    isActive: tour.isActive !== false,
    overview: (details.overview ?? []).join("\n\n"),
    includes: (details.includes ?? []).join("\n"),
    excludes: (details.excludes ?? []).join("\n"),
    whatToBring: (details.whatToBring ?? []).join("\n"),
    itinerary: details.itinerary ?? [],
    faqs: details.faqs ?? [],
    meetingPoint: details.meetingPoint || "",
    cancellationPolicy: details.cancellationPolicy || "",
  });

  type ItineraryStep = { time: string; title: string; body: string };
  type Faq = { q: string; a: string };

  const updateItinerary = (i: number, patch: Partial<ItineraryStep>) =>
    setFormData((d) => ({
      ...d,
      itinerary: d.itinerary.map((s: ItineraryStep, idx: number) =>
        idx === i ? { ...s, ...patch } : s,
      ),
    }));
  const addItinerary = () =>
    setFormData((d) => ({
      ...d,
      itinerary: [...d.itinerary, { time: "", title: "", body: "" }],
    }));
  const removeItinerary = (i: number) =>
    setFormData((d) => ({
      ...d,
      itinerary: d.itinerary.filter((_: ItineraryStep, idx: number) => idx !== i),
    }));

  const updateFaq = (i: number, patch: Partial<Faq>) =>
    setFormData((d) => ({
      ...d,
      faqs: d.faqs.map((f: Faq, idx: number) => (idx === i ? { ...f, ...patch } : f)),
    }));
  const addFaq = () =>
    setFormData((d) => ({ ...d, faqs: [...d.faqs, { q: "", a: "" }] }));
  const removeFaq = (i: number) =>
    setFormData((d) => ({
      ...d,
      faqs: d.faqs.filter((_: Faq, idx: number) => idx !== i),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      description: formData.description,
      category: formData.category,
      duration: formData.duration,
      pricePerPerson: String(formData.pricePerPerson),
      maxGuests: Number(formData.maxGuests) || 8,
      destination: formData.destination || null,
      imageUrl: formData.imageUrl || null,
      isActive: formData.isActive,
      details: {
        overview: formData.overview.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean),
        includes: formData.includes.split("\n").map((s: string) => s.trim()).filter(Boolean),
        excludes: formData.excludes.split("\n").map((s: string) => s.trim()).filter(Boolean),
        whatToBring: formData.whatToBring.split("\n").map((s: string) => s.trim()).filter(Boolean),
        itinerary: (formData.itinerary as ItineraryStep[]).filter(
          (s) => s.title.trim() || s.body.trim() || s.time.trim(),
        ),
        faqs: (formData.faqs as Faq[]).filter((f) => f.q.trim() || f.a.trim()),
        meetingPoint: formData.meetingPoint || undefined,
        cancellationPolicy: formData.cancellationPolicy || undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Basics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
          </div>
        </div>
        <div>
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={2} value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Select value={formData.destination} onValueChange={(v) => setFormData({ ...formData, destination: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="siwa">Siwa Oasis</SelectItem>
                <SelectItem value="north-coast">North Coast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Water · Wellness" />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="Half day · 2–3 hours" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="pricePerPerson">Price per person (€)</Label>
            <Input id="pricePerPerson" type="number" step="1" value={formData.pricePerPerson} onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="maxGuests">Max guests</Label>
            <Input id="maxGuests" type="number" min={1} value={formData.maxGuests} onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              Active (shown on site)
            </label>
          </div>
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="/attached_assets/your-image.jpg" />
        </div>
      </section>

      <section className="space-y-3 border-t border-sand pt-5">
        <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Overview</h3>
        <Label htmlFor="overview" className="text-xs text-ink-soft">
          Paragraphs separated by a blank line.
        </Label>
        <Textarea id="overview" rows={6} value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} className="font-mono text-sm" />
      </section>

      <section className="space-y-4 border-t border-sand pt-5">
        <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Includes, excludes, what to bring</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="includes">Includes (one per line)</Label>
            <Textarea id="includes" rows={6} value={formData.includes} onChange={(e) => setFormData({ ...formData, includes: e.target.value })} className="font-mono text-sm" />
          </div>
          <div>
            <Label htmlFor="excludes">Excludes (one per line)</Label>
            <Textarea id="excludes" rows={6} value={formData.excludes} onChange={(e) => setFormData({ ...formData, excludes: e.target.value })} className="font-mono text-sm" />
          </div>
          <div>
            <Label htmlFor="whatToBring">What to bring (one per line)</Label>
            <Textarea id="whatToBring" rows={6} value={formData.whatToBring} onChange={(e) => setFormData({ ...formData, whatToBring: e.target.value })} className="font-mono text-sm" />
          </div>
        </div>
      </section>

      <section className="space-y-3 border-t border-sand pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Itinerary</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItinerary}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add step
          </Button>
        </div>
        <div className="space-y-3">
          {(formData.itinerary as ItineraryStep[]).length === 0 && (
            <p className="text-xs text-ink-soft/60 italic">No itinerary steps yet.</p>
          )}
          {(formData.itinerary as ItineraryStep[]).map((step, i) => (
            <div key={i} className="border border-sand-light p-3 space-y-2">
              <div className="flex gap-3 items-end">
                <div className="w-32">
                  <Label className="text-xs">Time</Label>
                  <Input value={step.time} onChange={(e) => updateItinerary(i, { time: e.target.value })} placeholder="9:00 AM" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Title</Label>
                  <Input value={step.title} onChange={(e) => updateItinerary(i, { title: e.target.value })} placeholder="Pickup" />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => removeItinerary(i)} className="text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea rows={2} value={step.body} onChange={(e) => updateItinerary(i, { body: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-sand pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">FAQs</h3>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add FAQ
          </Button>
        </div>
        <div className="space-y-3">
          {(formData.faqs as Faq[]).length === 0 && (
            <p className="text-xs text-ink-soft/60 italic">No FAQs yet.</p>
          )}
          {(formData.faqs as Faq[]).map((faq, i) => (
            <div key={i} className="border border-sand-light p-3 space-y-2">
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <div>
                    <Label className="text-xs">Question</Label>
                    <Input value={faq.q} onChange={(e) => updateFaq(i, { q: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Answer</Label>
                    <Textarea rows={2} value={faq.a} onChange={(e) => updateFaq(i, { a: e.target.value })} />
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => removeFaq(i)} className="text-rose-600 mt-6">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-sand pt-5">
        <h3 className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">Meeting point & cancellation</h3>
        <div>
          <Label htmlFor="meetingPoint">Meeting point</Label>
          <Input id="meetingPoint" value={formData.meetingPoint} onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="cancellationPolicy">Cancellation policy</Label>
          <Input id="cancellationPolicy" value={formData.cancellationPolicy} onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })} />
        </div>
      </section>

      <div className="flex justify-end gap-2 pt-4 border-t border-sand sticky bottom-0 bg-white">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading} className="bg-gold hover:bg-gold-light text-navy">
          {isLoading ? "Saving…" : "Save tour"}
        </Button>
      </div>
    </form>
  );
}

// ── Pages editor ──────────────────────────────────────────────
// Master/detail editor for static page content. Left rail: list of
// editable pages. Center: the chosen page's sections grouped as
// cards. Each section card holds the structured fields for that
// chunk of the page. Save buttons live per section so the user
// commits one section at a time and gets clear feedback.
function PagesEditor({ toast }: { toast: any }) {
  const queryClient = useQueryClient();
  const { data: content = {} } = useQuery<Record<string, any>>({
    queryKey: ['/api/site-content'],
    queryFn: async () => {
      const res = await fetch('/api/site-content');
      if (!res.ok) return {};
      return res.json();
    },
    retry: false,
  });

  type Field = {
    key: string;
    label: string;
    multiline?: boolean;
    placeholder?: string;
    help?: string;
    /** 'media' renders the library picker + upload button. */
    type?: 'text' | 'faq-list' | 'media' | 'media-video' | 'media-image';
  };
  type FaqItem = { q: string; a: string };
  type Section = {
    id: string;
    label: string;
    description?: string;
    fields: Field[];
  };
  type EditablePage = {
    id: string;
    label: string;
    route: string;
    description?: string;
    sections: Section[];
  };

  const pages: EditablePage[] = [
    {
      id: 'contact',
      label: 'Contact details',
      route: '/',
      description: 'Owner contact info used by the AI concierge fallback and other contact CTAs across the site.',
      sections: [
        {
          id: 'owner',
          label: 'Owner contact',
          description: 'Used as the fallback contact when the AI chat is unavailable. The WhatsApp number should include country code, digits only (e.g. 201234567890).',
          fields: [
            { key: 'contact.whatsapp', label: 'WhatsApp number (with country code, digits only)', placeholder: '201234567890' },
            { key: 'contact.whatsapp_label', label: 'WhatsApp display label', placeholder: '+20 1234 567890' },
            { key: 'contact.email', label: 'Contact email', placeholder: 'hello@solei.travel' },
            { key: 'contact.fallback_message', label: 'Chat fallback message', multiline: true, placeholder: "Sorry, I'm not available right now. Please try again later or reach the Soléi team directly on WhatsApp." },
          ],
        },
      ],
    },
    {
      id: 'header',
      label: 'Header (Nav)',
      route: '/',
      description: 'Site-wide top navigation — brand wordmark, menu labels, and the gold CTA button. Edits apply to every page.',
      sections: [
        {
          id: 'nav',
          label: 'Navigation labels',
          fields: [
            { key: 'nav.brand', label: 'Brand wordmark', placeholder: 'Soléi' },
            { key: 'nav.link_siwa', label: 'Siwa link label', placeholder: 'Siwa Oasis' },
            { key: 'nav.link_siwa_href', label: 'Siwa link URL', placeholder: '/siwa-oasis' },
            { key: 'nav.link_nc', label: 'North Coast link label', placeholder: 'North Coast' },
            { key: 'nav.link_nc_href', label: 'North Coast link URL', placeholder: '/north-coast' },
            { key: 'nav.link_journal', label: 'Journal link label', placeholder: 'Journal' },
            { key: 'nav.link_journal_href', label: 'Journal link URL', placeholder: '/journal' },
            { key: 'nav.link_story', label: 'Our Story link label', placeholder: 'Our Story' },
            { key: 'nav.link_story_href', label: 'Our Story link URL', placeholder: '/our-story' },
            { key: 'nav.cta', label: 'CTA button label', placeholder: 'Begin your stay' },
            { key: 'nav.cta_href', label: 'CTA button URL', placeholder: '/enquire' },
          ],
        },
      ],
    },
    {
      id: 'footer',
      label: 'Footer',
      route: '/',
      description: 'Site-wide footer — brand block, three column titles, copyright, and the legal links. Edits apply to every page.',
      sections: [
        {
          id: 'brand',
          label: 'Brand block',
          description: 'Logo wordmark, tagline, and description in the first column.',
          fields: [
            { key: 'footer.brand', label: 'Brand wordmark', placeholder: 'Soléi' },
            { key: 'footer.tagline', label: 'Tagline (italic)', placeholder: 'From Sea to Sands' },
            { key: 'footer.description', label: 'Description', multiline: true },
          ],
        },
        {
          id: 'columns',
          label: 'Column titles',
          description: 'Titles for the three link columns.',
          fields: [
            { key: 'footer.col1.title', label: 'Column 1 title', placeholder: 'Siwa Oasis' },
            { key: 'footer.col2.title', label: 'Column 2 title', placeholder: 'North Coast' },
            { key: 'footer.col3.title', label: 'Column 3 title', placeholder: 'Soléi' },
          ],
        },
        {
          id: 'siwa-links',
          label: 'Column 1 links (Siwa)',
          description: 'Label + URL for each link in the Siwa column.',
          fields: [
            { key: 'footer.siwa.0.label', label: '1 — label', placeholder: 'Destination' },
            { key: 'footer.siwa.0.href', label: '1 — URL', placeholder: '/siwa-oasis' },
            { key: 'footer.siwa.1.label', label: '2 — label', placeholder: 'Accommodation' },
            { key: 'footer.siwa.1.href', label: '2 — URL', placeholder: '/siwa-oasis/accommodation' },
            { key: 'footer.siwa.2.label', label: '3 — label', placeholder: 'Experiences' },
            { key: 'footer.siwa.2.href', label: '3 — URL', placeholder: '/siwa-oasis/experiences' },
            { key: 'footer.siwa.3.label', label: '4 — label', placeholder: 'Transportation' },
            { key: 'footer.siwa.3.href', label: '4 — URL', placeholder: '/siwa-oasis/transportation' },
            { key: 'footer.siwa.4.label', label: '5 — label', placeholder: 'Travel tips' },
            { key: 'footer.siwa.4.href', label: '5 — URL', placeholder: '/siwa-travel-tips' },
            { key: 'footer.siwa.5.label', label: '6 — label', placeholder: 'FAQ' },
            { key: 'footer.siwa.5.href', label: '6 — URL', placeholder: '/siwa-faq' },
          ],
        },
        {
          id: 'nc-links',
          label: 'Column 2 links (North Coast)',
          description: 'Label + URL for each link in the North Coast column.',
          fields: [
            { key: 'footer.nc.0.label', label: '1 — label', placeholder: 'Destination' },
            { key: 'footer.nc.0.href', label: '1 — URL', placeholder: '/north-coast' },
            { key: 'footer.nc.1.label', label: '2 — label', placeholder: 'Accommodation' },
            { key: 'footer.nc.1.href', label: '2 — URL', placeholder: '/north-coast/accommodation' },
            { key: 'footer.nc.2.label', label: '3 — label', placeholder: 'Experiences' },
            { key: 'footer.nc.2.href', label: '3 — URL', placeholder: '/north-coast/experiences' },
            { key: 'footer.nc.3.label', label: '4 — label', placeholder: 'Transportation' },
            { key: 'footer.nc.3.href', label: '4 — URL', placeholder: '/north-coast/transportation' },
            { key: 'footer.nc.4.label', label: '5 — label', placeholder: 'Travel tips' },
            { key: 'footer.nc.4.href', label: '5 — URL', placeholder: '/north-coast-travel-tips' },
            { key: 'footer.nc.5.label', label: '6 — label', placeholder: 'FAQ' },
            { key: 'footer.nc.5.href', label: '6 — URL', placeholder: '/north-coast-faq' },
          ],
        },
        {
          id: 'solei-links',
          label: 'Column 3 links (Soléi)',
          description: 'Label + URL for each link in the Soléi column.',
          fields: [
            { key: 'footer.solei.0.label', label: '1 — label', placeholder: 'Our Story' },
            { key: 'footer.solei.0.href', label: '1 — URL', placeholder: '/our-story' },
            { key: 'footer.solei.1.label', label: '2 — label', placeholder: 'Journal' },
            { key: 'footer.solei.1.href', label: '2 — URL', placeholder: '/journal' },
            { key: 'footer.solei.2.label', label: '3 — label', placeholder: 'Begin your stay' },
            { key: 'footer.solei.2.href', label: '3 — URL', placeholder: '/enquire' },
          ],
        },
        {
          id: 'legal',
          label: 'Legal row',
          description: 'Bottom row — copyright line and the Terms / Privacy links.',
          fields: [
            { key: 'footer.copyright', label: 'Copyright line', placeholder: '© 2025 Soléi · Siwa Oasis, Egypt' },
            { key: 'footer.terms_label', label: 'Terms link label', placeholder: 'Terms' },
            { key: 'footer.terms_href', label: 'Terms link URL', placeholder: '/terms-of-service' },
            { key: 'footer.privacy_label', label: 'Privacy link label', placeholder: 'Privacy' },
            { key: 'footer.privacy_href', label: 'Privacy link URL', placeholder: '/privacy' },
          ],
        },
      ],
    },
    {
      id: 'home',
      label: 'Home page',
      route: '/',
      description: 'The landing experience — hero, intro, destinations, moments, closing.',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          description: 'The first screen visitors see, over the salt-lake video.',
          fields: [
            { key: 'home.hero.eyebrow', label: 'Eyebrow', placeholder: 'From Sea to Sands' },
            { key: 'home.hero.title', label: 'Title (first line)', placeholder: 'Feel Egypt.' },
            { key: 'home.hero.italic', label: 'Italic accent (second line)', placeholder: "Don't just see it." },
            { key: 'home.hero.subhead', label: 'Subhead', multiline: true, placeholder: 'Two destinations…' },
            { key: 'home.hero.video_url', label: 'Background image or video', type: 'media', placeholder: '/videos/salt-lake.mp4' },
          ],
        },
        {
          id: 'intro',
          label: 'A different kind of Egypt',
          description: 'Cream strip directly below the hero.',
          fields: [
            { key: 'home.intro.eyebrow', label: 'Eyebrow', placeholder: 'A different kind of Egypt' },
            { key: 'home.intro.title', label: 'Title (first line)', placeholder: 'Built around the moments' },
            { key: 'home.intro.title_2', label: 'Title (second line)', placeholder: 'most travelers' },
            { key: 'home.intro.italic', label: 'Italic accent', placeholder: 'never reach.' },
            { key: 'home.intro.body', label: 'Body', multiline: true },
            { key: 'home.intro.cta', label: 'CTA label', placeholder: 'Read our story' },
          ],
        },
        {
          id: 'destinations',
          label: 'Two destinations',
          description: 'The Siwa and North Coast cards on the home page.',
          fields: [
            { key: 'home.destinations.eyebrow', label: 'Section eyebrow', placeholder: 'Two destinations' },
            { key: 'home.destinations.siwa.tag', label: 'Siwa card · eyebrow', placeholder: 'Primary destination' },
            { key: 'home.destinations.siwa.name', label: 'Siwa card · name', placeholder: 'Siwa' },
            { key: 'home.destinations.siwa.italic', label: 'Siwa card · italic', placeholder: 'Oasis' },
            { key: 'home.destinations.siwa.body', label: 'Siwa card · body', multiline: true },
            { key: 'home.destinations.siwa.cta', label: 'Siwa card · CTA', placeholder: 'Explore Siwa →' },
            { key: 'home.destinations.nc.tag', label: 'NC card · eyebrow', placeholder: 'North Coast' },
            { key: 'home.destinations.nc.name', label: 'NC card · name', placeholder: 'The' },
            { key: 'home.destinations.nc.italic', label: 'NC card · italic', placeholder: 'Coast' },
            { key: 'home.destinations.nc.body', label: 'NC card · body', multiline: true },
            { key: 'home.destinations.nc.cta', label: 'NC card · CTA', placeholder: 'Explore the Coast →' },
          ],
        },
        {
          id: 'moments',
          label: 'States of being (Moments)',
          description: 'The white "Soléi difference" section with three cards. Card content is hard-coded for now; this edits the header strip.',
          fields: [
            { key: 'home.moments.eyebrow', label: 'Eyebrow', placeholder: 'The Soléi difference' },
            { key: 'home.moments.title', label: 'Title (first line)', placeholder: 'States of being,' },
            { key: 'home.moments.title_2', label: 'Title (second line word)', placeholder: 'not' },
            { key: 'home.moments.italic', label: 'Italic accent', placeholder: 'itineraries.' },
            { key: 'home.moments.subhead', label: 'Subhead', multiline: true },
          ],
        },
        {
          id: 'closing',
          label: 'Closing CTA',
          description: 'The navy invitation panel above the footer.',
          fields: [
            { key: 'home.closing.title', label: 'Title (first line)', placeholder: 'Come as you are.' },
            { key: 'home.closing.italic', label: 'Italic accent', placeholder: "We'll take care of the rest." },
            { key: 'home.closing.body', label: 'Body', multiline: true },
            { key: 'home.closing.primary_cta', label: 'Primary button', placeholder: 'Begin your stay' },
            { key: 'home.closing.secondary_cta', label: 'Secondary button', placeholder: 'Our story' },
          ],
        },
      ],
    },
    {
      id: 'siwa-hub',
      label: 'Siwa Oasis page',
      route: '/siwa-oasis',
      description: 'Destination landing page for Siwa — hero, intro, moments, lodge, and the strip headers above each catalog.',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          description: 'Navy hero with the breadcrumb, title, and category pills.',
          fields: [
            { key: 'siwa_hub.hero.eyebrow', label: 'Eyebrow', placeholder: 'Primary destination' },
            { key: 'siwa_hub.hero.title', label: 'Title (first part)', placeholder: 'Siwa' },
            { key: 'siwa_hub.hero.italic', label: 'Italic accent', placeholder: 'Oasis.' },
            { key: 'siwa_hub.hero.line2', label: 'Second line', placeholder: 'Feel it deeply.' },
            { key: 'siwa_hub.hero.sub', label: 'Subhead', multiline: true },
          ],
        },
        {
          id: 'intro',
          label: 'The founding place (Intro)',
          description: 'Cream strip — sidebar number + label + 3 paragraphs.',
          fields: [
            { key: 'siwa_hub.intro.num', label: 'Sidebar number', placeholder: '01' },
            { key: 'siwa_hub.intro.label', label: 'Sidebar label', placeholder: 'The founding place' },
            { key: 'siwa_hub.intro.title', label: 'Title (first part)', multiline: true },
            { key: 'siwa_hub.intro.title_italic', label: 'Title italic accent', placeholder: 'thousands of years.' },
            { key: 'siwa_hub.intro.p1', label: 'Paragraph 1', multiline: true },
            { key: 'siwa_hub.intro.p1_link', label: 'Paragraph 1 inline link text', placeholder: 'Soléi was built to change that.' },
            { key: 'siwa_hub.intro.p2', label: 'Paragraph 2', multiline: true },
          ],
        },
        {
          id: 'moments',
          label: 'Moments — header',
          description: 'Eyebrow + title above the three moment cards.',
          fields: [
            { key: 'siwa_hub.moments.eyebrow', label: 'Eyebrow', placeholder: 'What awaits you' },
            { key: 'siwa_hub.moments.title', label: 'Title (first line)', placeholder: 'The moments most' },
            { key: 'siwa_hub.moments.title_2', label: 'Title (second line word)', placeholder: 'travelers' },
            { key: 'siwa_hub.moments.italic', label: 'Italic accent', placeholder: 'never reach.' },
            { key: 'siwa_hub.moments.body', label: 'Body', multiline: true },
          ],
        },
        {
          id: 'lodge',
          label: 'Where you sleep (Lodge)',
          description: 'Navy section about the eco-lodges.',
          fields: [
            { key: 'siwa_hub.lodge.eyebrow', label: 'Eyebrow', placeholder: 'Where you sleep' },
            { key: 'siwa_hub.lodge.title', label: 'Title (first part)', placeholder: 'A Siwa that extends into' },
            { key: 'siwa_hub.lodge.italic', label: 'Italic accent', placeholder: 'every room.' },
            { key: 'siwa_hub.lodge.p1', label: 'Paragraph 1', multiline: true },
            { key: 'siwa_hub.lodge.p2', label: 'Paragraph 2', multiline: true },
            { key: 'siwa_hub.lodge.p3', label: 'Closing line', multiline: true },
            { key: 'siwa_hub.lodge.cta', label: 'CTA button', placeholder: 'View accommodation' },
          ],
        },
        {
          id: 'accommodation-header',
          label: 'Accommodation — strip header',
          description: 'Eyebrow + title for the hotel cards strip. The hotel cards themselves come from the Hotels admin tab.',
          fields: [
            { key: 'siwa_hub.accommodation.eyebrow', label: 'Eyebrow', placeholder: 'Where you stay' },
            { key: 'siwa_hub.accommodation.title', label: 'Title (first part)', placeholder: 'Siwa' },
            { key: 'siwa_hub.accommodation.italic', label: 'Italic accent', placeholder: 'accommodation' },
          ],
        },
        {
          id: 'experiences-header',
          label: 'Experiences — strip header',
          description: 'Eyebrow + title for the experiences cards strip. The tour cards themselves come from the Tours admin tab.',
          fields: [
            { key: 'siwa_hub.experiences.eyebrow', label: 'Eyebrow', placeholder: 'What you do' },
            { key: 'siwa_hub.experiences.title', label: 'Title (first part)', placeholder: 'Siwa' },
            { key: 'siwa_hub.experiences.italic', label: 'Italic accent', placeholder: 'experiences' },
          ],
        },
        {
          id: 'transport',
          label: 'Getting here (Transportation)',
          description: 'White section explaining how to reach Siwa.',
          fields: [
            { key: 'siwa_hub.transport.eyebrow', label: 'Eyebrow', placeholder: 'Getting here' },
            { key: 'siwa_hub.transport.title', label: 'Title (first part)', placeholder: 'Arrive the' },
            { key: 'siwa_hub.transport.italic', label: 'Italic accent', placeholder: 'right way.' },
            { key: 'siwa_hub.transport.body', label: 'Body', multiline: true },
            { key: 'siwa_hub.transport.cta', label: 'CTA button', placeholder: 'View all routes' },
          ],
        },
      ],
    },
    {
      id: 'nc-hub',
      label: 'North Coast page',
      route: '/north-coast',
      description: 'Destination landing for the North Coast — hero, intro, what makes it different, strip headers, booking, transport, practical, Siwa crosslink.',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          description: 'Coastal-blue hero with the breadcrumb, title, and category pills.',
          fields: [
            { key: 'nc_hub.hero.eyebrow', label: 'Eyebrow', placeholder: 'Secondary destination' },
            { key: 'nc_hub.hero.title', label: 'Title (first part)', placeholder: 'The' },
            { key: 'nc_hub.hero.italic', label: 'Italic accent', placeholder: 'Coast.' },
            { key: 'nc_hub.hero.line2', label: 'Second line', placeholder: 'Space. Sea. Silence.' },
            { key: 'nc_hub.hero.sub', label: 'Subhead', multiline: true },
          ],
        },
        {
          id: 'intro',
          label: 'The coast (Intro)',
          description: 'Cream strip — sidebar number + label + 3 paragraphs.',
          fields: [
            { key: 'nc_hub.intro.num', label: 'Sidebar number', placeholder: '02' },
            { key: 'nc_hub.intro.label', label: 'Sidebar label', placeholder: 'The coast' },
            { key: 'nc_hub.intro.title', label: 'Title (first part)', multiline: true },
            { key: 'nc_hub.intro.title_italic', label: 'Title italic accent', placeholder: 'Soléi offers another.' },
            { key: 'nc_hub.intro.p1', label: 'Paragraph 1', multiline: true },
            { key: 'nc_hub.intro.p2', label: 'Paragraph 2', multiline: true },
          ],
        },
        {
          id: 'different',
          label: 'Not the Coast you know',
          description: 'White strip — what makes this curated selection different.',
          fields: [
            { key: 'nc_hub.different.eyebrow', label: 'Eyebrow', placeholder: 'What to expect' },
            { key: 'nc_hub.different.title', label: 'Title (first line)', placeholder: 'Not the North Coast' },
            { key: 'nc_hub.different.title_2', label: 'Title (second line)', placeholder: 'most people' },
            { key: 'nc_hub.different.italic', label: 'Italic accent', placeholder: 'know.' },
            { key: 'nc_hub.different.body', label: 'Body', multiline: true },
          ],
        },
        {
          id: 'accommodation-header',
          label: 'Accommodation — strip header',
          description: 'Eyebrow + title for the hotel cards strip. The hotels themselves come from the Hotels admin tab.',
          fields: [
            { key: 'nc_hub.accommodation.eyebrow', label: 'Eyebrow', placeholder: 'Where you stay' },
            { key: 'nc_hub.accommodation.title', label: 'Title (first part)', placeholder: 'North Coast' },
            { key: 'nc_hub.accommodation.italic', label: 'Italic accent', placeholder: 'accommodation' },
          ],
        },
        {
          id: 'booking',
          label: 'How booking works',
          description: 'Coastal-blue strip explaining the enquiry-based reservation flow.',
          fields: [
            { key: 'nc_hub.booking.eyebrow', label: 'Eyebrow', placeholder: 'How booking works' },
            { key: 'nc_hub.booking.title', label: 'Title (first line)', placeholder: 'North Coast reservations' },
            { key: 'nc_hub.booking.title_2', label: 'Title (second line)', placeholder: 'are' },
            { key: 'nc_hub.booking.italic', label: 'Italic accent', placeholder: 'personally handled.' },
            { key: 'nc_hub.booking.body', label: 'Body', multiline: true },
          ],
        },
        {
          id: 'experiences-header',
          label: 'Experiences — strip header',
          description: 'Eyebrow + title for the experiences cards strip. The tours come from the Tours admin tab.',
          fields: [
            { key: 'nc_hub.experiences.eyebrow', label: 'Eyebrow', placeholder: 'What you do' },
            { key: 'nc_hub.experiences.title', label: 'Title (first part)', placeholder: 'North Coast' },
            { key: 'nc_hub.experiences.italic', label: 'Italic accent', placeholder: 'experiences' },
          ],
        },
        {
          id: 'transport',
          label: 'Getting here (Transportation)',
          description: 'White section explaining how to reach the coast.',
          fields: [
            { key: 'nc_hub.transport.eyebrow', label: 'Eyebrow', placeholder: 'Getting here' },
            { key: 'nc_hub.transport.title', label: 'Title (first line)', placeholder: 'Two hours from' },
            { key: 'nc_hub.transport.italic', label: 'Italic accent (second line)', placeholder: 'Cairo or Alexandria.' },
            { key: 'nc_hub.transport.body', label: 'Body', multiline: true },
            { key: 'nc_hub.transport.cta', label: 'CTA button', placeholder: 'View all routes' },
          ],
        },
        {
          id: 'practical',
          label: 'Practical info — header',
          description: 'Eyebrow + title above the practical cards. Cards themselves are still hard-coded.',
          fields: [
            { key: 'nc_hub.practical.eyebrow', label: 'Eyebrow', placeholder: 'Before you arrive' },
            { key: 'nc_hub.practical.title', label: 'Title (first part)', placeholder: 'Good to' },
            { key: 'nc_hub.practical.italic', label: 'Italic accent', placeholder: 'know.' },
            { key: 'nc_hub.practical.cta', label: 'Top-right link', placeholder: 'Full travel guide →' },
          ],
        },
        {
          id: 'crosslink',
          label: 'Siwa cross-link card',
          description: 'Navy card pointing visitors back to Siwa.',
          fields: [
            { key: 'nc_hub.crosslink.eyebrow', label: 'Eyebrow', placeholder: 'Also explore' },
            { key: 'nc_hub.crosslink.title', label: 'Title (first part)', placeholder: 'Siwa' },
            { key: 'nc_hub.crosslink.italic', label: 'Italic accent', placeholder: 'Oasis.' },
            { key: 'nc_hub.crosslink.body', label: 'Body', multiline: true },
            { key: 'nc_hub.crosslink.cta', label: 'CTA arrow text', placeholder: 'Explore Siwa →' },
          ],
        },
      ],
    },
    {
      id: 'nc-tips',
      label: 'North Coast Travel Tips page',
      route: '/north-coast-travel-tips',
      description: 'Travel guide for the North Coast — hero, Siwa cross-link, and closing CTA. Long-form body sections stay code-managed.',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          description: 'Coastal hero — eyebrow, title, body, and three stat tiles.',
          fields: [
            { key: 'nc_tips.hero.eyebrow', label: 'Eyebrow', placeholder: 'North Coast' },
            { key: 'nc_tips.hero.title', label: 'Title (first line)', placeholder: 'Travel tips for' },
            { key: 'nc_tips.hero.italic_pre', label: 'Second-line prefix', placeholder: "Egypt's" },
            { key: 'nc_tips.hero.italic', label: 'Italic accent', placeholder: 'North Coast.' },
            { key: 'nc_tips.hero.body', label: 'Body', multiline: true },
            { key: 'nc_tips.hero.stat1_value', label: 'Stat 1 value', placeholder: '~2.5 hrs' },
            { key: 'nc_tips.hero.stat1_label', label: 'Stat 1 label', placeholder: 'From Cairo' },
            { key: 'nc_tips.hero.stat2_value', label: 'Stat 2 value', placeholder: 'Apr–Jun' },
            { key: 'nc_tips.hero.stat2_label', label: 'Stat 2 label', placeholder: 'Best season' },
            { key: 'nc_tips.hero.stat3_value', label: 'Stat 3 value', placeholder: '3–5' },
            { key: 'nc_tips.hero.stat3_label', label: 'Stat 3 label', placeholder: 'Ideal nights' },
          ],
        },
        {
          id: 'crosslink',
          label: 'Siwa cross-link',
          description: 'Sand strip pointing at the Siwa tips page.',
          fields: [
            { key: 'nc_tips.crosslink.title', label: 'Title (first part)', placeholder: 'Also visiting' },
            { key: 'nc_tips.crosslink.italic', label: 'Italic accent', placeholder: 'Siwa Oasis?' },
            { key: 'nc_tips.crosslink.body', label: 'Body', multiline: true },
            { key: 'nc_tips.crosslink.cta', label: 'CTA', placeholder: 'Siwa travel tips →' },
          ],
        },
        {
          id: 'closing',
          label: 'Closing',
          description: 'Navy "Ready to experience the North Coast?" panel with two CTAs.',
          fields: [
            { key: 'nc_tips.closing.title', label: 'Title (first line)', placeholder: 'Ready to experience' },
            { key: 'nc_tips.closing.italic_pre', label: 'Second-line prefix', placeholder: 'the' },
            { key: 'nc_tips.closing.italic', label: 'Italic accent', placeholder: 'North Coast?' },
            { key: 'nc_tips.closing.body', label: 'Body', multiline: true },
            { key: 'nc_tips.closing.primary_cta', label: 'Primary button', placeholder: 'Begin your stay' },
            { key: 'nc_tips.closing.secondary_cta', label: 'Secondary button', placeholder: 'Explore the North Coast' },
          ],
        },
      ],
    },
    {
      id: 'nc-faq',
      label: 'North Coast FAQ page',
      route: '/north-coast-faq',
      description: 'Question/answer pairs for the North Coast, grouped into 5 themed sections. Each Q/A list overrides the page defaults when populated.',
      sections: [
        {
          id: 'planning',
          label: 'Planning your trip',
          description: 'Best time to visit, length of stay, group composition.',
          fields: [
            { key: 'nc_faq.planning.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'accommodation',
          label: 'Accommodation',
          description: 'Resorts, boutique stays, Marassi vs Almaza vs El Alamein.',
          fields: [
            { key: 'nc_faq.accommodation.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'experiences',
          label: 'Experiences',
          description: 'Yacht, beach club, dining, nightlife, wellness.',
          fields: [
            { key: 'nc_faq.experiences.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'transportation',
          label: 'Getting to & around the coast',
          description: 'Transfers from Cairo and Alexandria, on-coast transport.',
          fields: [
            { key: 'nc_faq.transportation.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'practical',
          label: 'Practical info',
          description: 'Cards & cash, connectivity, dress code, family-friendly.',
          fields: [
            { key: 'nc_faq.practical.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
      ],
    },
    {
      id: 'terms',
      label: 'Terms of Service page',
      route: '/terms-of-service',
      description: 'Legal page — only the page title is editable here. The numbered legal sections (booking, deposit, cancellation, liability, etc.) stay code-managed so they cannot be accidentally broken; ask the developer to update them.',
      sections: [
        {
          id: 'header',
          label: 'Page title',
          fields: [
            { key: 'terms.title', label: 'Title', placeholder: 'Terms of Service' },
          ],
        },
      ],
    },
    {
      id: 'privacy',
      label: 'Privacy Policy page',
      route: '/privacy',
      description: 'Legal page — only the eyebrow and title are editable. The 15 numbered policy sections stay code-managed; ask the developer to update them.',
      sections: [
        {
          id: 'header',
          label: 'Page header',
          fields: [
            { key: 'privacy.eyebrow', label: 'Eyebrow', placeholder: 'Legal' },
            { key: 'privacy.title', label: 'Title', placeholder: 'Privacy Policy.' },
          ],
        },
      ],
    },
    {
      id: 'siwa-faq',
      label: 'Siwa FAQ page',
      route: '/siwa-faq',
      description: 'Question/answer pairs for Siwa, grouped into 5 themed sections. Each Q/A list overrides the page defaults when populated.',
      sections: [
        {
          id: 'planning',
          label: 'Planning your trip',
          description: 'Questions about choosing dates, length of stay, who to bring, etc.',
          fields: [
            { key: 'siwa_faq.planning.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'accommodation',
          label: 'Accommodation',
          description: 'Where to stay — eco-lodges, boutique hotels, family stays.',
          fields: [
            { key: 'siwa_faq.accommodation.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'experiences',
          label: 'Experiences',
          description: 'Tours, activities, what to expect from each.',
          fields: [
            { key: 'siwa_faq.experiences.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'transportation',
          label: 'Getting to & around Siwa',
          description: 'Transfers, in-oasis transport, road conditions.',
          fields: [
            { key: 'siwa_faq.transportation.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
        {
          id: 'practical',
          label: 'Practical info',
          description: 'Money, connectivity, packing, language, customs.',
          fields: [
            { key: 'siwa_faq.practical.items', label: 'Q/A list', type: 'faq-list' },
          ],
        },
      ],
    },
    {
      id: 'siwa-tips',
      label: 'Siwa Travel Tips page',
      route: '/siwa-travel-tips',
      description: 'Travel guide for Siwa — hero, North Coast cross-link, and closing CTA. The long-form tip body sections stay code-managed for now.',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          description: 'Navy hero — eyebrow, title, body, and three stat tiles.',
          fields: [
            { key: 'siwa_tips.hero.eyebrow', label: 'Eyebrow', placeholder: 'Siwa Oasis' },
            { key: 'siwa_tips.hero.title', label: 'Title (first line)', placeholder: 'Travel tips for' },
            { key: 'siwa_tips.hero.italic', label: 'Italic accent (second line)', placeholder: 'Siwa Oasis.' },
            { key: 'siwa_tips.hero.body', label: 'Body', multiline: true },
            { key: 'siwa_tips.hero.stat1_value', label: 'Stat 1 value', placeholder: '~8 hrs' },
            { key: 'siwa_tips.hero.stat1_label', label: 'Stat 1 label', placeholder: 'From Cairo' },
            { key: 'siwa_tips.hero.stat2_value', label: 'Stat 2 value', placeholder: 'Oct–Apr' },
            { key: 'siwa_tips.hero.stat2_label', label: 'Stat 2 label', placeholder: 'Best season' },
            { key: 'siwa_tips.hero.stat3_value', label: 'Stat 3 value', placeholder: '3–5' },
            { key: 'siwa_tips.hero.stat3_label', label: 'Stat 3 label', placeholder: 'Ideal nights' },
          ],
        },
        {
          id: 'crosslink',
          label: 'North Coast cross-link',
          description: 'Sand strip pointing at the NC tips page.',
          fields: [
            { key: 'siwa_tips.crosslink.title', label: 'Title (first part)', placeholder: 'Also visiting the' },
            { key: 'siwa_tips.crosslink.italic', label: 'Italic accent', placeholder: 'North Coast?' },
            { key: 'siwa_tips.crosslink.body', label: 'Body', multiline: true },
            { key: 'siwa_tips.crosslink.cta', label: 'CTA', placeholder: 'North Coast travel tips →' },
          ],
        },
        {
          id: 'closing',
          label: 'Closing',
          description: 'Navy "Plan your Siwa escape" panel with two CTAs.',
          fields: [
            { key: 'siwa_tips.closing.title', label: 'Title (first part)', placeholder: 'Plan your Siwa' },
            { key: 'siwa_tips.closing.italic', label: 'Italic accent', placeholder: 'escape.' },
            { key: 'siwa_tips.closing.body', label: 'Body', multiline: true },
            { key: 'siwa_tips.closing.primary_cta', label: 'Primary button', placeholder: 'Begin your stay' },
            { key: 'siwa_tips.closing.secondary_cta', label: 'Secondary button', placeholder: 'Explore Siwa Oasis' },
          ],
        },
      ],
    },
    {
      id: 'our-story',
      label: 'Our Story page',
      route: '/our-story',
      description: 'The brand narrative — hero, origin, moments, philosophy, lodge, closing.',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          description: 'First screen — navy background with the founder statement.',
          fields: [
            { key: 'our_story.hero.eyebrow', label: 'Eyebrow', placeholder: 'Our Story' },
            { key: 'our_story.hero.title', label: 'Title', multiline: true, placeholder: "We don't show you Egypt…" },
            { key: 'our_story.hero.italic', label: 'Italic accent', placeholder: 'feel it.' },
          ],
        },
        {
          id: 'origin',
          label: 'Origin',
          description: 'The founder voice — "Where this began".',
          fields: [
            { key: 'our_story.origin.label', label: 'Sidebar label', placeholder: 'Where this began' },
            { key: 'our_story.origin.intro', label: 'Opening statement', multiline: true },
            { key: 'our_story.origin.p1', label: 'Paragraph 1', multiline: true },
            { key: 'our_story.origin.p2', label: 'Paragraph 2 (after divider)', multiline: true },
            { key: 'our_story.origin.p3', label: 'Paragraph 3 (closing line)', multiline: true },
          ],
        },
        {
          id: 'moments',
          label: 'Three Moments — header',
          description: 'Eyebrow for the navy strip with the three numbered cards.',
          fields: [
            { key: 'our_story.moments.eyebrow', label: 'Eyebrow', placeholder: 'The moments most travelers never reach' },
          ],
        },
        {
          id: 'philosophy',
          label: 'What we believe (Philosophy)',
          description: 'Sand-light centered strip — the brand thesis.',
          fields: [
            { key: 'our_story.philosophy.eyebrow', label: 'Eyebrow', placeholder: 'What we believe' },
            { key: 'our_story.philosophy.title', label: 'Title (italic part)', multiline: true },
            { key: 'our_story.philosophy.accent', label: 'Coastal accent words', placeholder: 'states of being.' },
            { key: 'our_story.philosophy.body', label: 'Body', multiline: true },
          ],
        },
        {
          id: 'lodge',
          label: 'Where you sleep (The Lodge)',
          description: 'Navy two-column section about the eco-lodges.',
          fields: [
            { key: 'our_story.lodge.eyebrow', label: 'Eyebrow', placeholder: 'Where you sleep' },
            { key: 'our_story.lodge.title', label: 'Title (first part)', placeholder: 'A Siwa that extends into' },
            { key: 'our_story.lodge.italic', label: 'Italic accent', placeholder: 'every room.' },
            { key: 'our_story.lodge.p1', label: 'Paragraph 1', multiline: true },
            { key: 'our_story.lodge.p2', label: 'Paragraph 2', multiline: true },
            { key: 'our_story.lodge.p3', label: 'Closing line', multiline: true },
          ],
        },
        {
          id: 'closing',
          label: 'Closing',
          description: 'Cream centered finale with the founder quote and CTA.',
          fields: [
            { key: 'our_story.closing.quote', label: 'Italic quote', multiline: true },
            { key: 'our_story.closing.body', label: 'Body', multiline: true },
            { key: 'our_story.closing.cta', label: 'CTA button', placeholder: 'Come as you are' },
          ],
        },
      ],
    },
  ];

  // master/detail state. draft can hold any JSON value (string for
  // simple text fields, FaqItem[] for faq-list fields).
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0].id);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const selectedPage = pages.find((p) => p.id === selectedPageId) ?? pages[0];

  const stringValueOf = (key: string) =>
    draft[key] !== undefined
      ? (typeof draft[key] === 'string' ? draft[key] : '')
      : typeof content[key] === 'string'
      ? content[key]
      : '';
  const valueOf = stringValueOf;
  const faqValueOf = (key: string): FaqItem[] => {
    if (Array.isArray(draft[key])) return draft[key];
    if (Array.isArray(content[key])) return content[key];
    return [];
  };
  const isDirty = (key: string) =>
    draft[key] !== undefined &&
    JSON.stringify(draft[key]) !== JSON.stringify(content[key] ?? null);
  const sectionDirtyKeys = (section: Section) =>
    section.fields.map((f) => f.key).filter(isDirty);

  const saveSectionMutation = useMutation({
    mutationFn: async (keys: string[]) => {
      for (const key of keys) {
        const res = await apiRequest('PUT', `/api/admin/site-content/${encodeURIComponent(key)}`, {
          value: draft[key],
        });
        if (!res.ok) throw new Error(`Failed to save ${key}`);
      }
      return keys;
    },
    onSuccess: (keys) => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-content'] });
      setDraft((d) => {
        const next = { ...d };
        for (const k of keys) delete next[k];
        return next;
      });
      toast({
        title: 'Saved',
        description: `Updated ${keys.length} field${keys.length > 1 ? 's' : ''}`,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Save failed', description: err?.message ?? 'Could not save', variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end pb-2">
        <div>
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">
            Editable pages · {pages.length}
          </p>
          <h2 className="font-display text-[1.4rem] text-navy">Pages</h2>
        </div>
        <a
          href={selectedPage.route}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.6rem] tracking-[0.18em] uppercase text-ink-soft/65 hover:text-navy transition-colors flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View live page
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Pages rail */}
        <nav className="bg-white border border-sand p-2">
          {pages.map((p) => {
            const active = selectedPageId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPageId(p.id)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  active
                    ? 'bg-cream border-l-2 border-gold pl-[14px]'
                    : 'border-l-2 border-transparent hover:bg-cream/60'
                }`}
              >
                <p className="font-display text-[0.95rem] text-navy">{p.label}</p>
                <p className="text-[0.6rem] text-ink-soft/55 mt-0.5 font-mono">{p.route}</p>
              </button>
            );
          })}
        </nav>

        {/* Sections */}
        <div className="space-y-6 min-w-0">
          {selectedPage.description && (
            <p className="text-[0.85rem] text-ink-soft leading-[1.7]">
              {selectedPage.description}
            </p>
          )}
          {selectedPage.sections.map((section) => {
            const dirtyKeys = sectionDirtyKeys(section);
            const saving =
              saveSectionMutation.isPending &&
              saveSectionMutation.variables?.some((k) => section.fields.some((f) => f.key === k));
            return (
              <section key={section.id} className="bg-white border border-sand">
                <header className="flex items-end justify-between gap-4 px-6 pt-5 pb-4 border-b border-sand-light">
                  <div>
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold mb-1">
                      Section
                    </p>
                    <h3 className="font-display text-[1.1rem] text-navy">{section.label}</h3>
                    {section.description && (
                      <p className="text-[0.78rem] text-ink-soft/65 mt-1 max-w-prose">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    disabled={dirtyKeys.length === 0 || saving}
                    onClick={() => saveSectionMutation.mutate(dirtyKeys)}
                    className="bg-gold hover:bg-gold-light text-navy rounded-none h-9 px-4 text-[0.58rem] tracking-[0.2em] uppercase font-body shadow-none"
                  >
                    {saving ? 'Saving…' : dirtyKeys.length > 0 ? `Save (${dirtyKeys.length})` : 'Saved'}
                  </Button>
                </header>
                <div className="p-6 space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <Label className="flex items-center justify-between">
                        <span>{field.label}</span>
                        {isDirty(field.key) && (
                          <span className="text-[0.55rem] tracking-[0.2em] uppercase text-gold">
                            · unsaved
                          </span>
                        )}
                      </Label>
                      {field.type === 'faq-list' ? (
                        (() => {
                          const items = faqValueOf(field.key);
                          const setItems = (next: FaqItem[]) =>
                            setDraft({ ...draft, [field.key]: next });
                          return (
                            <div className="space-y-3 mt-2">
                              {items.length === 0 && (
                                <p className="text-xs text-ink-soft/60 italic">No questions yet.</p>
                              )}
                              {items.map((item, i) => (
                                <div key={i} className="border border-sand-light p-3 space-y-2">
                                  <div className="flex gap-3 items-start">
                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <Label className="text-xs">Question</Label>
                                        <Input
                                          value={item.q}
                                          onChange={(e) =>
                                            setItems(items.map((it, idx) => idx === i ? { ...it, q: e.target.value } : it))
                                          }
                                          placeholder="e.g. When is the best time to visit?"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Answer (paragraphs separated by blank lines)</Label>
                                        <Textarea
                                          rows={4}
                                          value={item.a}
                                          onChange={(e) =>
                                            setItems(items.map((it, idx) => idx === i ? { ...it, a: e.target.value } : it))
                                          }
                                          className="font-mono text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-6">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={i === 0}
                                        onClick={() => {
                                          if (i === 0) return;
                                          const next = [...items];
                                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                                          setItems(next);
                                        }}
                                        title="Move up"
                                      >
                                        ↑
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={i === items.length - 1}
                                        onClick={() => {
                                          if (i === items.length - 1) return;
                                          const next = [...items];
                                          [next[i], next[i + 1]] = [next[i + 1], next[i]];
                                          setItems(next);
                                        }}
                                        title="Move down"
                                      >
                                        ↓
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                                        className="text-rose-600"
                                        title="Remove"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setItems([...items, { q: '', a: '' }])}
                              >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Add question
                              </Button>
                            </div>
                          );
                        })()
                      ) : field.type === 'media' || field.type === 'media-video' || field.type === 'media-image' ? (
                        <div className="mt-2">
                          <MediaField
                            value={valueOf(field.key)}
                            onChange={(url) => setDraft({ ...draft, [field.key]: url })}
                            accept={field.type === 'media-video' ? 'video' : field.type === 'media-image' ? 'image' : 'all'}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ) : field.multiline ? (
                        <Textarea
                          rows={3}
                          value={valueOf(field.key)}
                          onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <Input
                          value={valueOf(field.key)}
                          onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Legacy name kept for any stray reference
function SiteCopyPanel({ toast }: { toast: any }) {
  return <PagesEditor toast={toast} />;
}

// Minimal pagination control reused across admin list views.
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-sand-light text-[0.62rem] tracking-[0.18em] uppercase text-ink-soft">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-2 border border-sand hover:border-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>
      <span className="text-ink-soft/70">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-2 border border-sand hover:border-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}

/**
 * Publish + Draft as two adjacent buttons rather than a single toggle.
 * The active state is filled gold (Live) or rose (Draft); the inactive
 * one is outlined and clickable. Going Live → Draft requires confirm.
 */
function PublishDraftButtons({
  isLive,
  itemLabel,
  onPublish,
  onDraft,
}: {
  isLive: boolean;
  itemLabel: string;
  onPublish: () => void;
  onDraft: () => void;
}) {
  const handleDraft = () => {
    if (!isLive) return;
    const ok = window.confirm(
      `Hide "${itemLabel}" from the live site?\n\nIt will be saved as a draft and visitors won't be able to see it. You can publish it again at any time.`,
    );
    if (ok) onDraft();
  };
  const handlePublish = () => {
    if (isLive) return;
    onPublish();
  };

  const liveClass = isLive
    ? "bg-[#5a8a6a] text-white border-[#5a8a6a] cursor-default"
    : "border-sand text-ink-soft/65 hover:border-[#5a8a6a] hover:text-[#5a8a6a]";
  const draftClass = !isLive
    ? "bg-rose-600 text-white border-rose-600 cursor-default"
    : "border-sand text-ink-soft/65 hover:border-rose-400 hover:text-rose-600";

  return (
    <div className="inline-flex border border-sand">
      <button
        type="button"
        onClick={handlePublish}
        disabled={isLive}
        title={isLive ? "Currently published" : "Publish to the live site"}
        className={`text-[0.55rem] tracking-[0.16em] uppercase px-3 py-1.5 border-r transition-colors ${liveClass}`}
      >
        Publish
      </button>
      <button
        type="button"
        onClick={handleDraft}
        disabled={!isLive}
        title={!isLive ? "Currently a draft" : "Hide from the live site"}
        className={`text-[0.55rem] tracking-[0.16em] uppercase px-3 py-1.5 transition-colors ${draftClass}`}
      >
        Draft
      </button>
    </div>
  );
}

// ── AI Knowledge panel ────────────────────────────────────────
// Upload PDF / text files the chat concierge uses as additional
// context on every conversation. Inactive entries stay in the DB
// but aren't sent to OpenAI.
function AIKnowledgePanel({ toast }: { toast: any }) {
  type Doc = {
    id: number;
    title: string;
    filename: string;
    mimeType: string;
    charCount: number;
    isActive: boolean;
  };

  const queryClient = useQueryClient();
  const { data: docs = [], isLoading } = useQuery<Doc[]>({
    queryKey: ['/api/admin/knowledge'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/knowledge');
      return res.json();
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File; title: string }) => {
      const fd = new FormData();
      fd.append('file', file);
      if (title) fd.append('title', title);
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `Upload failed (${res.status})`);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/knowledge'] });
      toast({ title: 'Knowledge added', description: 'The AI will use this on the next chat.' });
      setFile(null);
      setTitle('');
    },
    onError: (err: any) => {
      toast({ title: 'Upload failed', description: err?.message ?? 'Could not upload', variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest('PUT', `/api/admin/knowledge/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/knowledge'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/knowledge/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/knowledge'] });
      toast({ title: 'Removed' });
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    uploadMutation.mutate({ file, title: title.trim() });
  };

  const totalChars = docs.filter((d) => d.isActive).reduce((s, d) => s + d.charCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end pb-2">
        <div>
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">
            Concierge brain · {docs.length} documents · {totalChars.toLocaleString()} characters active
          </p>
          <h2 className="font-display text-[1.4rem] text-navy">AI Knowledge</h2>
          <p className="text-[0.82rem] text-ink-soft mt-2 max-w-[64ch] leading-[1.85]">
            Upload PDFs or plain-text files the chat concierge should know about — brochures, internal price sheets, partner notes, FAQs. Every active document is included in the AI's system prompt on every conversation.
          </p>
        </div>
      </div>

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="bg-white border border-sand p-6 md:p-7 space-y-4"
      >
        <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold">Add a document</p>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-end">
          <div>
            <Label className="text-[0.62rem] tracking-[0.2em] uppercase text-ink-soft mb-1.5 block">
              Title (optional)
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Soléi Q4 2026 brochure"
            />
          </div>
          <div>
            <Label className="text-[0.62rem] tracking-[0.2em] uppercase text-ink-soft mb-1.5 block">
              File (PDF or .txt — max 10 MB)
            </Label>
            <Input
              type="file"
              accept="application/pdf,text/plain,text/markdown,.md,.txt,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className="rounded-none bg-gold hover:bg-gold-light text-navy text-[0.62rem] tracking-[0.22em] uppercase px-6"
          >
            {uploadMutation.isPending ? 'Uploading…' : 'Upload to AI'}
          </Button>
        </div>
      </form>

      {/* Documents list */}
      <div className="space-y-3">
        {isLoading && (
          <p className="text-[0.78rem] text-ink-soft/55 text-center py-8">Loading…</p>
        )}
        {!isLoading && docs.length === 0 && (
          <div className="text-center py-16 text-ink-soft/55 border border-dashed border-sand">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-[0.78rem]">No knowledge documents yet. Upload one above.</p>
          </div>
        )}
        {docs.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-sand p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gold mb-1">
                {d.mimeType.replace('application/', '').replace('text/', '').toUpperCase()} · {d.charCount.toLocaleString()} chars
              </p>
              <h3 className="font-display text-[1rem] text-navy mb-1 truncate">{d.title}</h3>
              <p className="text-[0.72rem] text-ink-soft/65 truncate">{d.filename}</p>
            </div>
            <div className="flex items-center gap-2 md:flex-col md:items-stretch md:gap-2">
              <PublishDraftButtons
                isLive={d.isActive}
                itemLabel={d.title}
                onPublish={() => toggleMutation.mutate({ id: d.id, isActive: true })}
                onDraft={() => toggleMutation.mutate({ id: d.id, isActive: false })}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(`Remove "${d.title}" from the AI knowledge base?`)) {
                    deleteMutation.mutate(d.id);
                  }
                }}
                className="rounded-none border-sand text-rose-600 hover:border-rose-300 hover:bg-rose-50 px-3"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
