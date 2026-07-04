import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className = '' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalColor(value);
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i)) {
      onChange(value);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-2"
            style={{ backgroundColor: localColor }}
          >
            <span className="sr-only">Pick color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexColorPicker color={localColor} onChange={handleColorChange} />
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={localColor}
        onChange={handleInputChange}
        placeholder="#000000"
        className="font-mono text-sm"
      />
    </div>
  );
}