import { useRef, useState } from 'react';
import { useMapNavigation } from './hooks/useMapNavigation.js';
import { MapCanvas } from './components/MapCanvas.jsx';
import { MapControls, MiniMap } from './components/MapControls.jsx';
import { PlaceSearch } from './components/PlaceSearch.jsx';
import { PlaceDetail } from './components/PlaceDetail.jsx';

export function App() {
  const nav = useMapNavigation();
  const [selected, setSelected] = useState(null);
  const helpRef = useRef(null);
  function select(place) { setSelected(place); }
  function find(place) { select(place); nav.centerOn(place); }
  return <>
    <header><div className="brand"><span className="ring" aria-hidden="true">✧</span><div><span className="eyebrow">UM ATLAS DA TERCEIRA ERA</span><h1>Terra-média</h1></div></div><div className="header-right"><span className="era">✦ &nbsp; TERCEIRA ERA</span><button className="ghost" type="button" aria-label="Como navegar" title="Como navegar" onClick={() => helpRef.current.showModal()}>?</button></div></header>
    <main><section ref={nav.viewportRef} id="viewport" aria-label="Mapa interativo da Terra-média" tabIndex={0} className={[nav.space && 'space', nav.dragging && 'dragging'].filter(Boolean).join(' ')}
      onPointerDown={nav.onPointerDown} onPointerMove={nav.onPointerMove} onPointerUp={nav.onPointerEnd} onPointerCancel={nav.onPointerEnd} onLostPointerCapture={nav.onPointerEnd} onKeyDown={nav.onKeyDown}>
      <MapCanvas view={nav.view} selected={selected} onSelect={select} canSelect={nav.canSelect} />
      <div className="map-shade" aria-hidden="true" />
      <PlaceSearch onSelect={find} />
      <MapControls view={nav.view} size={nav.size} zoom={nav.zoom} reset={nav.reset} />
      <PlaceDetail place={selected} onClose={() => setSelected(null)} />
      <div className="legend"><span>✧ &nbsp; Localidade</span><span>⛰ &nbsp; Montanhas</span><span>♠ &nbsp; Florestas</span></div>
      <div className="hint"><kbd>ESPAÇO</kbd> + arraste <span>·</span> Rodinha para zoom</div>
      <MiniMap view={nav.view} size={nav.size} />
    </section></main>
    <footer><span>ARDA ATLAS &nbsp; / &nbsp; PROJETO DE FÃ</span><span>Cartografia ilustrativa · não oficial</span></footer>
    <dialog ref={helpRef} aria-labelledby="help-title"><h2 id="help-title">Explore a Terra-média</h2><p>Segure Espaço e arraste com o botão esquerdo do mouse para mover o mapa. Use a rodinha ou os botões + e − para aproximar e afastar.</p><p>Em telas sensíveis ao toque, arraste com um dedo e use dois dedos para ampliar. Selecione um local para descobrir sua história. As setas também movem o mapa quando ele está em foco.</p><button type="button" onClick={() => helpRef.current.close()}>Começar a explorar</button></dialog>
  </>;
}
