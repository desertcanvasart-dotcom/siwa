import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Video, Link, Palette, Layout, Type } from 'lucide-react';
import type { PageBlock } from '@shared/schema';

interface BlockEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
}

export function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  const [localContent, setLocalContent] = useState<any>({});

  const content = useMemo(() => {
    if (typeof block.content === 'string') {
      try {
        return JSON.parse(block.content);
      } catch {
        return {};
      }
    }
    return block.content || {};
  }, [block.content]);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleContentUpdate = (key: string, value: any) => {
    const newContent = { ...localContent, [key]: value };
    setLocalContent(newContent);
    onUpdate({ content: newContent });
  };

  const handleNestedUpdate = (path: string[], value: any) => {
    const newContent = { ...localContent };
    let current = newContent;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setLocalContent(newContent);
    onUpdate({ content: newContent });
  };

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={localContent.title || ''}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              placeholder="Enter hero title"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={localContent.subtitle || ''}
              onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
              placeholder="Enter hero subtitle"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="hero-button-text">Button Text</Label>
            <Input
              id="hero-button-text"
              value={localContent.buttonText || ''}
              onChange={(e) => handleContentUpdate('buttonText', e.target.value)}
              placeholder="Get Started"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-button-link">Button Link</Label>
            <Input
              id="hero-button-link"
              value={localContent.buttonLink || ''}
              onChange={(e) => handleContentUpdate('buttonLink', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <div>
            <Label htmlFor="hero-bg-image">Background Image URL</Label>
            <Input
              id="hero-bg-image"
              value={localContent.backgroundImage || ''}
              onChange={(e) => handleContentUpdate('backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-bg-video">Background Video URL</Label>
            <Input
              id="hero-bg-video"
              value={localContent.backgroundVideo || ''}
              onChange={(e) => handleContentUpdate('backgroundVideo', e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
          </div>
          
          <div>
            <Label>Overlay Opacity</Label>
            <Slider
              value={[localContent.overlayOpacity || 0.5]}
              onValueChange={(value) => handleContentUpdate('overlayOpacity', value[0])}
              max={1}
              min={0}
              step={0.1}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((localContent.overlayOpacity || 0.5) * 100)}%
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div>
            <Label>Text Color</Label>
            <div className="mt-2">
              <Input
                value={localContent.textColor || '#ffffff'}
                onChange={(e) => handleContentUpdate('textColor', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>
          
          <div>
            <Label>Background Color</Label>
            <div className="mt-2">
              <Input
                value={localContent.backgroundColor || '#1a1a1a'}
                onChange={(e) => handleContentUpdate('backgroundColor', e.target.value)}
                placeholder="#1a1a1a"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-content">Content</Label>
        <Textarea
          id="text-content"
          value={localContent.content || ''}
          onChange={(e) => handleContentUpdate('content', e.target.value)}
          placeholder="Enter your text content here..."
          rows={6}
        />
      </div>
      
      <div>
        <Label>Text Alignment</Label>
        <Select 
          value={localContent.textAlign || 'left'} 
          onValueChange={(value) => handleContentUpdate('textAlign', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <Input
          id="text-color"
          value={localContent.textColor || '#333333'}
          onChange={(e) => handleContentUpdate('textColor', e.target.value)}
          placeholder="#333333"
        />
      </div>
      
      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <Input
          id="bg-color"
          value={localContent.backgroundColor || 'transparent'}
          onChange={(e) => handleContentUpdate('backgroundColor', e.target.value)}
          placeholder="transparent"
        />
      </div>
      
      <div>
        <Label htmlFor="font-size">Font Size</Label>
        <Input
          id="font-size"
          value={localContent.fontSize || '16px'}
          onChange={(e) => handleContentUpdate('fontSize', e.target.value)}
          placeholder="16px"
        />
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-url">Image URL</Label>
        <Input
          id="image-url"
          value={localContent.imageUrl || ''}
          onChange={(e) => handleContentUpdate('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div>
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          value={localContent.alt || ''}
          onChange={(e) => handleContentUpdate('alt', e.target.value)}
          placeholder="Describe the image"
        />
      </div>
      
      <div>
        <Label htmlFor="image-caption">Caption</Label>
        <Input
          id="image-caption"
          value={localContent.caption || ''}
          onChange={(e) => handleContentUpdate('caption', e.target.value)}
          placeholder="Optional image caption"
        />
      </div>
      
      <div>
        <Label>Alignment</Label>
        <Select 
          value={localContent.alignment || 'center'} 
          onValueChange={(value) => handleContentUpdate('alignment', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="image-width">Width</Label>
        <Input
          id="image-width"
          value={localContent.width || '100%'}
          onChange={(e) => handleContentUpdate('width', e.target.value)}
          placeholder="100%"
        />
      </div>
    </div>
  );

  const renderVideoEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-url">Video URL</Label>
        <Input
          id="video-url"
          value={localContent.videoUrl || ''}
          onChange={(e) => handleContentUpdate('videoUrl', e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </div>
      
      <div>
        <Label htmlFor="video-poster">Poster Image</Label>
        <Input
          id="video-poster"
          value={localContent.poster || ''}
          onChange={(e) => handleContentUpdate('poster', e.target.value)}
          placeholder="https://example.com/poster.jpg"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="video-autoplay"
          checked={localContent.autoplay || false}
          onCheckedChange={(checked) => handleContentUpdate('autoplay', checked)}
        />
        <Label htmlFor="video-autoplay">Autoplay</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="video-controls"
          checked={localContent.controls !== false}
          onCheckedChange={(checked) => handleContentUpdate('controls', checked)}
        />
        <Label htmlFor="video-controls">Show Controls</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="video-loop"
          checked={localContent.loop || false}
          onCheckedChange={(checked) => handleContentUpdate('loop', checked)}
        />
        <Label htmlFor="video-loop">Loop</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="video-muted"
          checked={localContent.muted || false}
          onCheckedChange={(checked) => handleContentUpdate('muted', checked)}
        />
        <Label htmlFor="video-muted">Muted</Label>
      </div>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Gallery Layout</Label>
        <Select 
          value={localContent.layout || 'grid'} 
          onValueChange={(value) => handleContentUpdate('layout', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="masonry">Masonry</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Columns</Label>
        <Slider
          value={[localContent.columns || 3]}
          onValueChange={(value) => handleContentUpdate('columns', value[0])}
          max={6}
          min={1}
          step={1}
          className="mt-2"
        />
        <p className="text-sm text-gray-600 mt-1">
          {localContent.columns || 3} columns
        </p>
      </div>
      
      <div>
        <Label htmlFor="gallery-spacing">Spacing</Label>
        <Input
          id="gallery-spacing"
          value={localContent.spacing || '10px'}
          onChange={(e) => handleContentUpdate('spacing', e.target.value)}
          placeholder="10px"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="gallery-captions"
          checked={localContent.showCaptions !== false}
          onCheckedChange={(checked) => handleContentUpdate('showCaptions', checked)}
        />
        <Label htmlFor="gallery-captions">Show Captions</Label>
      </div>
      
      <div>
        <Label>Gallery Images</Label>
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Image management coming soon
          </p>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (block.blockType) {
      case 'hero':
        return renderHeroEditor();
      case 'text':
        return renderTextEditor();
      case 'image':
        return renderImageEditor();
      case 'video':
        return renderVideoEditor();
      case 'gallery':
        return renderGalleryEditor();
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>No editor available for this block type</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {block.blockType === 'hero' && <Layout className="w-5 h-5" />}
          {block.blockType === 'text' && <Type className="w-5 h-5" />}
          {block.blockType === 'image' && <Image className="w-5 h-5" />}
          {block.blockType === 'video' && <Video className="w-5 h-5" />}
          {block.blockType === 'gallery' && <Layout className="w-5 h-5" />}
          <span className="capitalize">{block.blockType} Block</span>
          <Badge variant="outline">{block.position + 1}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="block-visible"
              checked={block.isVisible}
              onCheckedChange={(checked) => onUpdate({ isVisible: checked })}
            />
            <Label htmlFor="block-visible">Visible</Label>
          </div>
          
          <Separator />
          
          <ScrollArea className="h-96">
            {renderEditor()}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}