import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module.js';

/**
 * Base
 */
const canvas = (document.querySelector('canvas.webgl') || undefined) as HTMLCanvasElement | undefined;

const offscreenCanvas = canvas.transferControlToOffscreen();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const params = {
  boxCount: 1000,
};

// Workerを作成し、OffscreenCanvasを渡す
const worker = new Worker('./worker.ts');
worker.postMessage({ canvas: offscreenCanvas, sizes, params: { boxCount: params.boxCount } }, [offscreenCanvas]);

const btn = document.getElementById('btn');
let clicked = false;
if (!btn) throw new Error('Button not found');

btn.addEventListener('click', () => {
  if (clicked) {
    btn.classList.remove('clicked');
  } else {
    btn.classList.add('clicked');
  }
  clicked = !clicked;
});

const gui = new GUI();
gui
  .add(params, 'boxCount')
  .min(0)
  .max(10000)
  .step(10)
  .onFinishChange((value: number) => {
    worker.postMessage({ type: 'update', params: { boxCount: value } });
  });

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * AnimationFrame
 */
const tick = () => {
  stats.update();
  window.requestAnimationFrame(tick);
};

tick();
