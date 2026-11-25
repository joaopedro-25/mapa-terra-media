import test from 'node:test';
import assert from 'node:assert/strict';
import { fitted, constrain, zoomAt } from '../src/map/geometry.js';
const size = {width: 800, height: 500};
test('fits full map', () => assert.deepEqual(fitted(size), {x:0,y:0,scale:0.5}));
test('limits zoom', () => {
 const v = zoomAt(fitted(size),size,100,{x:400,y:250});
 assert.equal(v.scale,2.5);
 assert.deepEqual(zoomAt(v,size,0.001,{x:400,y:250}),fitted(size));
});
test('clamps dragging to map bounds', () => assert.deepEqual(constrain({x:999,y:-999,scale:1},size),{x:0,y:-500,scale:1}));
test('keeps zoom anchored', () => assert.deepEqual(zoomAt(fitted(size),size,2,{x:400,y:250}),{x:-400,y:-250,scale:1}));
