import { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut, Info, Navigation, Map } from 'lucide-react';

interface VirtualTourProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  scenes: TourScene[];
}

interface TourScene {
  id: string;
  title: string;
  image: string;
  pitch?: number;
  yaw?: number;
  hotSpots?: HotSpot[];
}

interface HotSpot {
  pitch: number;
  yaw: number;
  type: 'scene' | 'info';
  text?: string;
  sceneId?: string;
  title?: string;
  description?: string;
}

export function VirtualTour({ isOpen, onClose, title, scenes }: VirtualTourProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumRef = useRef<any>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isOpen && viewerRef.current && scenes.length > 0) {
      // Load Pannellum CSS
      if (!document.querySelector('link[href*="pannellum"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);
      }

      // Load Pannellum JS
      if (!(window as any).pannellum) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.onload = () => initializeTour();
        document.body.appendChild(script);
      } else {
        initializeTour();
      }
    }

    return () => {
      if (pannellumRef.current) {
        try {
          pannellumRef.current.destroy();
        } catch (e) {
          // Handle cleanup errors silently
        }
      }
    };
  }, [isOpen, scenes]);

  const initializeTour = () => {
    if (!viewerRef.current || !scenes.length) return;

    const scene = scenes[currentScene];
    
    try {
      pannellumRef.current = (window as any).pannellum.viewer(viewerRef.current, {
        type: 'equirectangular',
        panorama: scene.image,
        autoLoad: true,
        pitch: scene.pitch || 0,
        yaw: scene.yaw || 0,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        showControls: false,
        hotSpots: scene.hotSpots || [],
        onLoad: () => {
          setIsLoading(false);
        },
        onError: (error: any) => {
          console.error('Pannellum error:', error);
          setIsLoading(false);
        }
      });

      // Add hot spot click handlers
      if (scene.hotSpots) {
        scene.hotSpots.forEach((hotSpot, index) => {
          if (hotSpot.type === 'scene' && hotSpot.sceneId) {
            pannellumRef.current.on('hotSpotClick', (event: any) => {
              if (event.hotSpotId === `hotspot_${index}`) {
                const sceneIndex = scenes.findIndex(s => s.id === hotSpot.sceneId);
                if (sceneIndex !== -1) {
                  changeScene(sceneIndex);
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize virtual tour:', error);
      setIsLoading(false);
    }
  };

  const changeScene = (sceneIndex: number) => {
    if (sceneIndex >= 0 && sceneIndex < scenes.length && sceneIndex !== currentScene) {
      setCurrentScene(sceneIndex);
      setIsLoading(true);
      
      if (pannellumRef.current) {
        const scene = scenes[sceneIndex];
        pannellumRef.current.loadScene(scene.id, scene.pitch || 0, scene.yaw || 0);
      }
    }
  };

  const resetView = () => {
    if (pannellumRef.current) {
      const scene = scenes[currentScene];
      pannellumRef.current.setPitch(scene.pitch || 0);
      pannellumRef.current.setYaw(scene.yaw || 0);
      pannellumRef.current.setHfov(100);
    }
  };

  const zoomIn = () => {
    if (pannellumRef.current) {
      const currentHfov = pannellumRef.current.getHfov();
      pannellumRef.current.setHfov(Math.max(currentHfov - 10, 50));
    }
  };

  const zoomOut = () => {
    if (pannellumRef.current) {
      const currentHfov = pannellumRef.current.getHfov();
      pannellumRef.current.setHfov(Math.min(currentHfov + 10, 120));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">{title}</h2>
            <p className="text-white/80">{scenes[currentScene]?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* 360° Viewer */}
      <div 
        ref={viewerRef}
        className="w-full h-full"
        style={{ cursor: 'grab' }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading virtual tour...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3">
        <button
          onClick={resetView}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={zoomIn}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          title="Show Info"
        >
          <Info className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scene Navigation */}
      {scenes.length > 1 && (
        <div className="absolute bottom-6 right-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Scenes</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => changeScene(index)}
                  className={`text-xs p-2 rounded transition-colors ${
                    index === currentScene
                      ? 'bg-solei-gold text-solei-navy'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {scene.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-6 bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-sm">
          <h3 className="text-white font-semibold mb-2">How to Navigate</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Drag to look around</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Click hotspots to explore</li>
            <li>• Use controls to reset view</li>
          </ul>
        </div>
      )}
    </div>
  );
}