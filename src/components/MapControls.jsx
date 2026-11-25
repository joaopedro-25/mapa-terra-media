import { land } from '../map/artwork.js';
import { WIDTH, HEIGHT, fitScale } from '../map/geometry.js';
export function MapControls({ view, size, zoom, reset }) {
  const fit = fitScale(size);
  return <div className="map-tools" aria-label="Controles de zoom">
    <button type="button" aria-label="Aumentar zoom" title="Aumentar zoom" disabled={view.scale >= fit * 5 - 0.00001} onClick={() => zoom(1.3)}>+</button>
    <span aria-live="polite">{Math.round(view.scale / fit * 100)}%</span>
    <button type="button" aria-label="Diminuir zoom" title="Diminuir zoom" disabled={view.scale <= fit + 0.00001} onClick={() => zoom(1 / 1.3)}>−</button>
    <button id="reset" type="button" aria-label="Ver mapa inteiro" title="Ver mapa inteiro" onClick={reset}>⌂</button>
  </div>;
}
export function MiniMap({ view, size }) {
  const left = Math.max(0, -view.x / view.scale), top = Math.max(0, -view.y / view.scale);
  return <div className="minimap"><svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true">
    <path d={land} fill="#b7a16e" stroke="#dfcda3" strokeWidth="7" />
    <rect x={left} y={top} width={Math.min(WIDTH - left, size.width / view.scale)} height={Math.min(HEIGHT - top, size.height / view.scale)} fill="#e6d3a3" fillOpacity=".2" stroke="#fff2cb" strokeWidth="15" />
    </svg><span>VISÃO GERAL</span></div>;
}
