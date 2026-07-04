import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { BlockRenderer } from './block-renderer';
import type { PageBlock } from '@shared/schema';

interface SortableBlockProps {
  block: PageBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SortableBlock({ block, isSelected, onSelect, onDelete }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card 
        className={`relative transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } ${!block.isVisible ? 'opacity-50' : ''}`}
        onClick={onSelect}
      >
        {/* Control Bar */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white rounded-lg shadow-md p-1">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Toggle visibility would go here
            }}
          >
            {block.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Block Type Label */}
        <div className="absolute top-2 left-2 z-10 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
          {block.blockType}
        </div>

        <CardContent className="p-0">
          <BlockRenderer block={block} isEditing={true} onSelect={onSelect} />
        </CardContent>
      </Card>
    </div>
  );
}