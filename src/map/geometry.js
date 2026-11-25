export const WIDTH = 1600;
export const HEIGHT = 1000;
export const fitScale = size => Math.max(0.0001, Math.min(size.width / WIDTH, size.height / HEIGHT));
export function constrain(view, size) {
  const bound = (offset, extent, available) => extent <= available ? (available - extent) / 2 : Math.min(0, Math.max(available - extent, offset));
  return { scale: view.scale, x: bound(view.x, WIDTH * view.scale, size.width), y: bound(view.y, HEIGHT * view.scale, size.height) };
}
export function fitted(size) { return constrain({ x: 0, y: 0, scale: fitScale(size) }, size); }
export function zoomAt(view, size, factor, point) {
  const fit = fitScale(size);
  const scale = Math.min(fit * 5, Math.max(fit, view.scale * factor));
  return constrain({ scale, x: point.x - (point.x - view.x) * scale / view.scale, y: point.y - (point.y - view.y) * scale / view.scale }, size);
}
