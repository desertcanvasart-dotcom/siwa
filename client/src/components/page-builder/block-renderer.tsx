import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { PageBlock } from '@shared/schema';

interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
  onSelect?: () => void;
}

export function BlockRenderer({ block, isEditing = false, onSelect }: BlockRendererProps) {
  const content = useMemo(() => {
    if (typeof block.content === 'string') {
      try {
        return JSON.parse(block.content);
      } catch {
        return block.content;
      }
    }
    return block.content;
  }, [block.content]);

  const handleClick = () => {
    if (isEditing && onSelect) {
      onSelect();
    }
  };

  const renderBlock = () => {
    switch (block.blockType) {
      case 'hero':
        return (
          <div 
            className="relative min-h-screen flex items-center justify-center text-white"
            style={{
              backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
              backgroundColor: content.backgroundColor || '#1a1a1a',
            }}
          >
            {content.backgroundImage && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: content.overlayOpacity || 0.5 }}
              />
            )}
            {content.backgroundVideo && (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                src={content.backgroundVideo}
              />
            )}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
              <h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                style={{ color: content.textColor || '#ffffff' }}
              >
                {content.title || 'Hero Title'}
              </h1>
              {content.subtitle && (
                <p 
                  className="text-xl md:text-2xl mb-8 opacity-90"
                  style={{ color: content.textColor || '#ffffff' }}
                >
                  {content.subtitle}
                </p>
              )}
              {content.buttonText && (
                <Button
                  size="lg"
                  className="px-8 py-3"
                  onClick={() => {
                    if (content.buttonLink && content.buttonLink !== '#') {
                      window.open(content.buttonLink, '_blank');
                    }
                  }}
                >
                  {content.buttonText}
                </Button>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div 
            className="py-8"
            style={{
              backgroundColor: content.backgroundColor || 'transparent',
              textAlign: content.textAlign || 'left',
            }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <div
                className="prose prose-lg max-w-none"
                style={{
                  color: content.textColor || '#333333',
                  fontSize: content.fontSize || '16px',
                }}
                dangerouslySetInnerHTML={{ __html: content.content || '<p>Your content here...</p>' }}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div 
            className="py-8"
            style={{ textAlign: content.alignment || 'center' }}
          >
            <div className="max-w-4xl mx-auto px-4">
              {content.imageUrl ? (
                <div className="space-y-4">
                  <img
                    src={content.imageUrl}
                    alt={content.alt || ''}
                    className="rounded-lg shadow-lg"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: content.width || '100%',
                      height: content.height || 'auto',
                      margin: content.alignment === 'center' ? '0 auto' : undefined,
                    }}
                  />
                  {content.caption && (
                    <p className="text-sm text-gray-600 italic text-center">
                      {content.caption}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                  <p className="text-gray-500">No image selected</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="py-8">
            <div className="max-w-6xl mx-auto px-4">
              {content.images && content.images.length > 0 ? (
                <div 
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${content.columns || 3}, 1fr)`,
                    gap: content.spacing || '10px',
                  }}
                >
                  {content.images.map((image: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={image.url}
                        alt={image.alt || ''}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                        loading="lazy"
                        decoding="async"
                      />
                      {content.showCaptions && image.caption && (
                        <p className="text-sm text-gray-600 text-center">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                  <p className="text-gray-500">No images in gallery</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              {content.videoUrl ? (
                <video
                  className="w-full rounded-lg shadow-lg"
                  controls={content.controls !== false}
                  autoPlay={content.autoplay || false}
                  loop={content.loop || false}
                  muted={content.muted || false}
                  poster={content.poster || undefined}
                >
                  <source src={content.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                  <p className="text-gray-500">No video selected</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  Unknown block type: {block.blockType}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {renderBlock()}
    </div>
  );
}