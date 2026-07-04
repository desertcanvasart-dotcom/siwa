import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Eye, Save, Trash2, GripVertical } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { BlockRenderer } from './block-renderer';
import { BlockTemplateLibrary } from './block-template-library';
import { SortableBlock } from './sortable-block';
import { BlockEditor } from './block-editor';
import type { Page, PageBlock, BlockTemplate } from '@shared/schema';

interface PageBuilderProps {
  pageId: number;
}

export function PageBuilder({ pageId }: PageBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<PageBlock | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch page data
  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['/api/admin/pages', pageId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/pages/${pageId}`);
      return response.json();
    },
    enabled: !!pageId,
  });

  // Fetch page blocks
  const { data: blocks = [], isLoading: blocksLoading } = useQuery({
    queryKey: ['/api/admin/page-blocks', pageId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/page-blocks/${pageId}`);
      const data = await response.json();
      console.log('Fetched blocks:', data);
      return data;
    },
    enabled: !!pageId,
  });

  // Fetch block templates
  const { data: templates = [] } = useQuery({
    queryKey: ['/api/admin/block-templates'],
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: async (updates: Partial<Page>) => {
      const response = await apiRequest('PUT', `/api/admin/pages/${pageId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages', pageId] });
      toast({
        title: "Page updated",
        description: "Your changes have been saved successfully.",
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

  // Create block mutation
  const createBlockMutation = useMutation({
    mutationFn: async (blockData: { templateId: number; position: number }) => {
      const template = templates.find(t => t.id === blockData.templateId);
      if (!template) throw new Error('Template not found');

      const newBlock = {
        pageId,
        blockType: template.blockType,
        content: template.defaultContent,
        position: blockData.position,
        isVisible: true,
      };

      const response = await apiRequest('POST', '/api/admin/page-blocks', newBlock);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-blocks', pageId] });
      toast({
        title: "Block added",
        description: "New block has been added to your page.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding block",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update block mutation
  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<PageBlock> }) => {
      const response = await apiRequest('PUT', `/api/admin/page-blocks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-blocks', pageId] });
      toast({
        title: "Block updated",
        description: "Block has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating block",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete block mutation
  const deleteBlockMutation = useMutation({
    mutationFn: async (blockId: number) => {
      await apiRequest('DELETE', `/api/admin/page-blocks/${blockId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-blocks', pageId] });
      toast({
        title: "Block deleted",
        description: "Block has been removed from your page.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting block",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reorder blocks mutation
  const reorderBlocksMutation = useMutation({
    mutationFn: async (blockIds: number[]) => {
      await apiRequest('POST', `/api/admin/page-blocks/reorder`, { pageId, blockIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-blocks', pageId] });
    },
    onError: (error) => {
      toast({
        title: "Error reordering blocks",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id.toString() === active.id);
      const newIndex = blocks.findIndex(block => block.id.toString() === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, movedBlock);
        
        const blockIds = newBlocks.map(block => block.id);
        reorderBlocksMutation.mutate(blockIds);
      }
    }
  };

  const handleAddBlock = (templateId: number) => {
    const position = blocks.length;
    createBlockMutation.mutate({ templateId, position });
    setIsTemplateLibraryOpen(false);
  };

  const handleUpdateBlock = (blockId: number, updates: Partial<PageBlock>) => {
    updateBlockMutation.mutate({ id: blockId, updates });
  };

  const handleDeleteBlock = (blockId: number) => {
    deleteBlockMutation.mutate(blockId);
    setSelectedBlock(null);
  };

  const handlePublishPage = () => {
    updatePageMutation.mutate({ isPublished: !page?.isPublished });
  };

  if (pageLoading || blocksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Page not found</h2>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Page Builder</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant={page.isPublished ? "default" : "outline"}
                size="sm"
                onClick={handlePublishPage}
                disabled={updatePageMutation.isPending}
              >
                {page.isPublished ? 'Published' : 'Publish'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={page.title}
                onChange={(e) => updatePageMutation.mutate({ title: e.target.value })}
                placeholder="Enter page title"
              />
            </div>
            <div>
              <Label htmlFor="page-slug">Page Slug</Label>
              <Input
                id="page-slug"
                value={page.slug}
                onChange={(e) => updatePageMutation.mutate({ slug: e.target.value })}
                placeholder="page-slug"
              />
            </div>
            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={page.metaDescription || ''}
                onChange={(e) => updatePageMutation.mutate({ metaDescription: e.target.value })}
                placeholder="Enter meta description for SEO"
                rows={3}
              />
            </div>
          </div>
        </div>

        {!isPreviewMode && (
          <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-2">
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blocks" className="flex-1 flex flex-col m-0">
              <div className="p-4 border-b border-gray-200">
                <Button
                  onClick={() => setIsTemplateLibraryOpen(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {blocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No blocks added yet. Click "Add Block" to get started.
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <Card
                        key={block.id}
                        className={`cursor-pointer transition-colors ${
                          selectedBlock?.id === block.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedBlock(block)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span className="font-medium capitalize">{block.blockType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Switch
                                checked={block.isVisible}
                                onCheckedChange={(checked) => 
                                  handleUpdateBlock(block.id, { isVisible: checked })
                                }
                                size="sm"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBlock(block.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 m-0">
              <ScrollArea className="h-full p-4">
                {selectedBlock ? (
                  <BlockEditor
                    block={selectedBlock}
                    onUpdate={(updates) => handleUpdateBlock(selectedBlock.id, updates)}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a block to edit its settings
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <div className="h-full overflow-y-auto">
          {isPreviewMode ? (
            <div className="p-8">
              {blocks.filter(block => block.isVisible).map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          ) : (
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id.toString())} strategy={verticalListSortingStrategy}>
                <div className="p-8 space-y-4">
                  {blocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedBlock?.id === block.id}
                      onSelect={() => setSelectedBlock(block)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />
                  ))}
                </div>
              </SortableContext>
              
              <DragOverlay>
                {activeId ? (
                  <div className="bg-white border-2 border-primary rounded-lg p-4 shadow-lg">
                    <div className="text-sm font-medium text-gray-600">
                      Moving block...
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {/* Template Library Dialog */}
      <BlockTemplateLibrary
        isOpen={isTemplateLibraryOpen}
        onClose={() => setIsTemplateLibraryOpen(false)}
        templates={templates}
        onAddBlock={handleAddBlock}
      />
    </div>
  );
}