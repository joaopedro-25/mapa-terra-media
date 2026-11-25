import { useState } from 'react';
import { places } from '../data/places.js';
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function PlaceSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const term = normalize(query.trim());
  const matches = term ? places.filter(p => normalize(p.name).includes(term)) : [];
  function choose(place) { setQuery(place.name); setOpen(false); onSelect(place); }
  return <div className="search-box">
    <label htmlFor="search">EXPLORE ARDA</label>
    <div className="search-input"><span aria-hidden="true">⌕</span><input id="search" type="search" autoComplete="off" placeholder="Buscar um lugar..." value={query} onChange={e => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); if (e.key === 'Enter' && matches[0]) { e.preventDefault(); choose(matches[0]); } }} /></div>
    {open && term && <div id="results">{matches.length ? matches.map(place => <button key={place.name} type="button" onClick={() => choose(place)}>{place.name}</button>) : <p>Nenhum local encontrado.</p>}</div>}
  </div>;
}
