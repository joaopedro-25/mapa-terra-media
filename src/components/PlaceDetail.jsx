export function PlaceDetail({ place, onClose }) {
  if (!place) return null;
  return <aside id="detail" aria-label={place.name} aria-live="polite">
    <button id="close" type="button" onClick={onClose} aria-label="Fechar detalhes">×</button>
    <span className="eyebrow">{place.kind}</span><h2>{place.name}</h2><p>{place.description}</p>
  </aside>;
}
