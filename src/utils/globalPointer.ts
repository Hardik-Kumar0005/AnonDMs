type Point = { x: number; y: number };

const listeners = new Set<(p: Point) => void>();
const pointer: Point = { x: 0, y: 0 };

function handlePointer(e: PointerEvent) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  listeners.forEach((l) => l(pointer));
}

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", handlePointer, { passive: true });
}

export function subscribeToGlobalPointer(cb: (p: Point) => void) {
  listeners.add(cb);
  cb(pointer);
  return () => {
    listeners.delete(cb);
  };
}

export function getGlobalPointer() {
  return pointer;
}

export type { Point };
