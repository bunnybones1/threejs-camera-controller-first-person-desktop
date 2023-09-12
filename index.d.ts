interface FPSControllerOptions {
  onChangedCallback: () => void;
  movementSpeed: number;
  movementRunSpeedScale: number;
  rotationSpeed: number;
  minFov: number;
  maxFov: number;
  zoomSpeed: number;
  yUp: boolean;
  rotateActive: boolean;
  rotateActiveOnlyInPointerLock: boolean;
  arrowKeysRotate: boolean;
}
class FPSController {
  lock: () => void;
  unlock: () => void;
  update: () => void;
  constructor(
    camera: THREE.PerspectiveCamera,
    element: HTMLElement,
    options: Partial<FPSControllerOptions>
  );
}
export default FPSController;
