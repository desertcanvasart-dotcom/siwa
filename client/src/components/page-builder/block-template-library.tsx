import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Layout, Type, Image, Video, Grid } from 'lucide-react';
import type { BlockTemplate } from '@shared/schema';

interface BlockTemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  templates: BlockTemplate[];
  onAddBlock: (templateId: number) => void;
}

export function BlockTemplateLibrary({ isOpen, onClose, templates, onAddBlock }: BlockTemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: Grid },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'content', name: 'Content', icon: Type },
    { id: 'media', name: 'Media', icon: Image },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.blockType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBlockIcon = (blockType: string) => {
    switch (blockType) {
      case 'hero':
        return <Layout className="w-6 h-6" />;
      case 'text':
        return <Type className="w-6 h-6" />;
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'gallery':
        return <Grid className="w-6 h-6" />;
      default:
        return <Layout className="w-6 h-6" />;
    }
  };

  const getBlockDescription = (blockType: string) => {
    switch (blockType) {
      case 'hero':
        return 'Full-width hero section with title, subtitle, and call-to-action button';
      case 'text':
        return 'Rich text content with customizable styling and formatting';
      case 'image':
        return 'Single image with caption and alignment options';
      case 'video':
        return 'Video player with controls and playback settings';
      case 'gallery':
        return 'Grid-based image gallery with multiple layout options';
      default:
        return 'Content block for your page';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Block Library</DialogTitle>
          <p className="text-gray-600">Choose a block to add to your page</p>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Search and Filters */}
          <div className="px-6 pb-4 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Templates Grid */}
          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getBlockIcon(template.blockType)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4">
                      {getBlockDescription(template.blockType)}
                    </p>
                    
                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-24">
                      <div className="text-xs text-gray-500 mb-2">Preview:</div>
                      <div className="bg-white rounded border p-3 text-center">
                        <div className="text-xs text-gray-400">
                          {template.blockType} block preview
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onAddBlock(template.id)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Block
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}