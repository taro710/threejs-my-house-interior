import * as THREE from 'three';
import { GUI } from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module.js';

/**
 * Base
 */
const canvas = (document.querySelector('canvas.webgl') || undefined) as HTMLCanvasElement | undefined;

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
renderer.shadowMap.enabled = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 1, 0);
directionalLight2.position.set(0, -1, 0);
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLight2);

const params = {
  boxCount: 2000,
};

const meshList: THREE.Mesh[] = [];
const Sphere = new THREE.BoxGeometry(0.08, 0.08, 0.08);
const meshInit = (boxCount: number) => {
  for (let i = 0; i < boxCount; i++) {
    const color = [0xfe4365, 0x556270, 0x3fb8af, 0xffd8d8, 0x556270][Math.floor(Math.random() * 5)];
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(Sphere, material);
    mesh.position.set(5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5));
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    meshList.push(mesh);
    scene.add(mesh);
  }
};
meshInit(params.boxCount);
const gui = new GUI();
gui
  .add(params, 'boxCount')
  .min(0)
  .max(10000)
  .step(10)
  .onFinishChange((value: number) => {
    meshList.forEach((mesh) => {
      scene.remove(mesh);
    });
    meshList.length = 0;
    meshInit(value);
  });

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
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.position.x = 12 * Math.cos(elapsedTime * 0.5);
  camera.position.z = 12 * Math.sin(elapsedTime * 0.5);
  camera.position.y = 12 * Math.sin(elapsedTime * 0.5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

renderer.render(scene, camera);
