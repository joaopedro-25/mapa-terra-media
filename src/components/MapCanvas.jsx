import { memo } from 'react';
import { mapImage } from '../map/artwork.js';
import { WIDTH, HEIGHT } from '../map/geometry.js';
import { places } from '../data/places.js';

const MapArtwork = memo(function MapArtwork() {
  return <img src={mapImage} alt="Cartografia ilustrativa da Terra-média" draggable={false} />;
});
export function MapCanvas({ view, selected, onSelect, canSelect }) {
  return <div id="world" style={{ transform: `translate(${view.x}px,${view.y}px) scale(${view.scale})` }}>
    <MapArtwork />
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-label="Localidades da Terra-média">
      {places.map(place => <g key={place.name} className={`place${selected === place ? ' selected' : ''}`} transform={`translate(${place.x} ${place.y})`}
        tabIndex={0} role="button" aria-label={place.name} aria-pressed={selected === place}
        onClick={() => { if (canSelect()) onSelect(place); }}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); onSelect(place); } }}>
        <circle className="halo" r="15" fill="#f4d28c" stroke="#7d5334" />
        <circle r="13" fill="transparent" />
        <path className="pin" d="M0 -7 7 0 0 7 -7 0Z" fill="#6a3928" stroke="#f1dba6" strokeWidth="1.6" />
        <circle r="2" fill="#f6dfb0" />
        <text x={place.x > 1250 ? -12 : 12} y={place.name === 'Abismo de Helm' ? 20 : place.name === 'Erebor' ? -9 : 4} textAnchor={place.x > 1250 ? 'end' : 'start'} fill="#332d20" fontWeight="bold" fontSize="14">{place.name}</text>
      </g>)}
    </svg>
  </div>;
}
