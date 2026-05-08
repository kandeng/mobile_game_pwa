import type { DroneState } from '../App';

interface HUDProps {
  droneState: DroneState;
}

export default function HUD({ droneState }: HUDProps) {
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 text-center">
        <p className="text-sm font-mono text-gray-700 leading-tight">
          x: {droneState.x.toFixed(1)}, y: {droneState.y.toFixed(1)}, z: {droneState.z.toFixed(1)}
        </p>
        <p className="text-sm font-mono text-gray-700 leading-tight">
          yaw: {Math.round(droneState.yaw)}, focal: {droneState.focal.toFixed(1)}
        </p>
      </div>
    </div>
  );
}
