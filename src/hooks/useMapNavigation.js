import { useCallback, useEffect, useRef, useState } from 'react';
import { constrain, fitted, fitScale, zoomAt } from '../map/geometry.js';

const isControl = target => target instanceof Element && !!target.closest('button,input,dialog,.search-box,#detail,.map-tools');
export function useMapNavigation() {
  const viewportRef = useRef(null);
  const sizeRef = useRef({ width: 1600, height: 1000 });
  const [size, setSize] = useState({ width: 1600, height: 1000 });
  const [view, setView] = useState(() => fitted({ width: 1600, height: 1000 }));
  const [space, setSpace] = useState(false);
  const [dragging, setDragging] = useState(false);
  const spaceRef = useRef(false);
  const pointers = useRef(new Map());
  const moved = useRef(false);
  const start = useRef(null);
  const reset = useCallback(() => setView(fitted(sizeRef.current)), []);
  const zoom = useCallback((factor, point) => {
    const bounds = sizeRef.current;
    setView(v => zoomAt(v, bounds, factor, point ?? { x: bounds.width / 2, y: bounds.height / 2 }));
  }, []);
  const centerOn = useCallback(point => {
    const bounds = sizeRef.current;
    setView(v => {
      const scale = Math.max(v.scale, fitScale(bounds) * 2.2);
      return constrain({ scale, x: bounds.width / 2 - point.x * scale, y: bounds.height / 2 - point.y * scale }, bounds);
    });
  }, []);
  const local = useCallback(event => {
    const el = viewportRef.current;
    const rect = el.getBoundingClientRect();
    return { x: event.clientX - rect.left - el.clientLeft, y: event.clientY - rect.top - el.clientTop };
  }, []);
  useEffect(() => {
    const el = viewportRef.current;
    const resize = () => {
      if (!el.clientWidth || !el.clientHeight) return;
      const next = { width: el.clientWidth, height: el.clientHeight };
      sizeRef.current = next; setSize(next); setView(fitted(next));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const wheel = event => {
      if (isControl(event.target)) return;
      event.preventDefault(); zoom(Math.exp(-event.deltaY * 0.0015), local(event));
    };
    el.addEventListener('wheel', wheel, { passive: false });
    const down = event => {
      if (event.code !== 'Space' || isControl(event.target) || document.querySelector('dialog[open]') || (event.target instanceof Element && event.target.closest('.place'))) return;
      event.preventDefault(); spaceRef.current = true; setSpace(true);
    };
    const up = event => { if (event.code === 'Space') { spaceRef.current = false; setSpace(false); } };
    const blur = () => { pointers.current.clear(); spaceRef.current = false; setSpace(false); setDragging(false); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
    return () => { observer.disconnect(); el.removeEventListener('wheel', wheel); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, [local, zoom]);

  function onPointerDown(event) {
    if (isControl(event.target)) return;
    if (!pointers.current.size) { moved.current = false; start.current = local(event); }
    if (event.pointerType === 'mouse' && !(spaceRef.current && event.button === 0) && event.button !== 1) return;
    // Preserve normal touch taps on place markers, but allow touch panning on the map.
    if (event.pointerType !== 'mouse' && event.target.closest?.('.place') && !pointers.current.size) return;
    event.preventDefault();
    if (event.pointerType === 'mouse') event.currentTarget.focus({ preventScroll: true });
    pointers.current.set(event.pointerId, local(event));
    if (pointers.current.size > 1) moved.current = true;
    event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
  }
  function onPointerMove(event) {
    const old = pointers.current.get(event.pointerId);
    if (!old) return;
    const point = local(event), dx = point.x - old.x, dy = point.y - old.y;
    if (start.current && Math.hypot(point.x - start.current.x, point.y - start.current.y) > 4) moved.current = true;
    const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1];
    if (other) {
      const distance = Math.hypot(old.x - other.x, old.y - other.y);
      const next = Math.hypot(point.x - other.x, point.y - other.y);
      const midpoint = { x: (point.x + other.x) / 2, y: (point.y + other.y) / 2 };
      setView(v => zoomAt({ ...v, x: v.x + dx / 2, y: v.y + dy / 2 }, sizeRef.current, distance > 0 ? next / distance : 1, midpoint));
    } else setView(v => constrain({ ...v, x: v.x + dx, y: v.y + dy }, sizeRef.current));
    pointers.current.set(event.pointerId, point);
  }
  function onPointerEnd(event) {
    pointers.current.delete(event.pointerId);
    if (!pointers.current.size) setDragging(false);
  }
  function onKeyDown(event) {
    if (event.target !== event.currentTarget) return;
    const shifts = { ArrowLeft: {x:70,y:0}, ArrowRight: {x:-70,y:0}, ArrowUp: {x:0,y:70}, ArrowDown: {x:0,y:-70} };
    const delta = shifts[event.key];
    if (delta) setView(v => constrain({ ...v, x: v.x + delta.x, y: v.y + delta.y }, sizeRef.current));
    else if (event.key === '+' || event.key === '=') zoom(1.3);
    else if (event.key === '-') zoom(1 / 1.3);
    else if (event.key === 'Home') reset();
    else return;
    event.preventDefault();
  }
  const canSelect = () => !moved.current && !spaceRef.current;
  return { viewportRef, view, size, space, dragging, canSelect, reset, zoom, centerOn, onPointerDown, onPointerMove, onPointerEnd, onKeyDown };
}
