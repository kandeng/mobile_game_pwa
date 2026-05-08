import { useState, useRef, useCallback } from 'react';
import ThreeScene from './components/ThreeScene';
import Joystick from './components/Joystick';
import ChatPanel from './components/ChatPanel';
import HUD from './components/HUD';

export interface EntityState {
  x: number;
  y: number;
  z: number;
  yaw: number;
  focal: number;
}

function App() {
  const [entityState, setEntityState] = useState<EntityState>({
    x: 0,
    y: 0,
    z: 2.4,
    yaw: 180,
    focal: 2.0,
  });

  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [chatHeight, setChatHeight] = useState(30); // vh percentage
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(30);
  const isDraggingPanel = useRef(false);

  const velocityRef = useRef({ vx: 0, vy: 0, vyaw: 0, vz: 0, vf: 0 });
  const animFrameRef = useRef<number>(0);

  // Persistent movement loop
  const startLoop = useCallback(() => {
    if (animFrameRef.current) return;
    const tick = () => {
      const { vx, vy, vyaw, vz, vf } = velocityRef.current;
      if (vx !== 0 || vy !== 0 || vyaw !== 0 || vz !== 0 || vf !== 0) {
        setEntityState((prev) => ({
          ...prev,
          x: parseFloat((prev.x + vx * 0.016).toFixed(2)),
          y: parseFloat((prev.y + vy * 0.016).toFixed(2)),
          yaw: (prev.yaw + vyaw * 0.016 + 360) % 360,
          z: Math.max(0.5, Math.min(10, parseFloat((prev.z + vz * 0.016).toFixed(2)))),
          focal: Math.max(1, Math.min(10, parseFloat((prev.focal + vf * 0.016).toFixed(1)))),
        }));
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAll = useCallback(() => {
    velocityRef.current = { vx: 0, vy: 0, vyaw: 0, vz: 0, vf: 0 };
  }, []);

  const setVelocity = useCallback(
    (vx: number, vy: number) => {
      velocityRef.current.vx = vx;
      velocityRef.current.vy = vy;
      startLoop();
    },
    [startLoop]
  );

  const setYawVelocity = useCallback(
    (vyaw: number) => {
      velocityRef.current.vyaw = vyaw;
      startLoop();
    },
    [startLoop]
  );

  const setHeightVelocity = useCallback(
    (vz: number) => {
      velocityRef.current.vz = vz;
      startLoop();
    },
    [startLoop]
  );

  const setFocalVelocity = useCallback(
    (vf: number) => {
      velocityRef.current.vf = vf;
      startLoop();
    },
    [startLoop]
  );

  const handlePanelDragStart = useCallback((e: React.TouchEvent) => {
    isDraggingPanel.current = true;
    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = chatHeight;
  }, [chatHeight]);

  const handlePanelDragMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingPanel.current) return;
    const deltaY = dragStartY.current - e.touches[0].clientY;
    const deltaVh = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(15, Math.min(60, dragStartHeight.current + deltaVh));
    setChatHeight(newHeight);
  }, []);

  const handlePanelDragEnd = useCallback(() => {
    if (!isDraggingPanel.current) return;
    isDraggingPanel.current = false;
    // Snap to nearest position: 15, 30, or 50
    setChatHeight((h) => {
      if (h < 22) return 15;
      if (h < 40) return 30;
      return 50;
    });
  }, []);

  const viewportHeight = `h-[${100 - chatHeight}vh]`;
  const chatHeightStyle = `${chatHeight}vh`;

  return (
    <div className="flex flex-col w-screen overflow-hidden bg-gray-100 select-none" style={{ height: '100dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Main Viewport */}
      <div
        className="relative w-full flex-shrink-0 touch-none"
        style={{ height: `${100 - chatHeight}vh` }}
      >
        {/* 3D Scene background */}
        <ThreeScene entityState={entityState} />

        {/* Telemetry HUD overlay */}
        <HUD entityState={entityState} />

        {/* Joystick overlay */}
        <Joystick
          onMove={setVelocity}
          onRotate={setYawVelocity}
          onHeight={setHeightVelocity}
          onFocal={setFocalVelocity}
          onStop={stopAll}
        />
      </div>

      {/* Chat & Toolbox Panel */}
      <div
        className="relative w-full flex-grow overflow-hidden"
        style={{ height: `${chatHeight}vh` }}
        onTouchStart={handlePanelDragStart}
        onTouchMove={handlePanelDragMove}
        onTouchEnd={handlePanelDragEnd}
      >
        <ChatPanel
          toolboxOpen={toolboxOpen}
          onToggleToolbox={() => setToolboxOpen(!toolboxOpen)}
        />
      </div>
    </div>
  );
}

export default App;
