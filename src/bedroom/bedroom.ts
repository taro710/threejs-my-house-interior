import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import overlayVertexShader from '../shaders/overlay/vertex.glsl';
import overlayFragmentShader from '../shaders/overlay/fragment.glsl';
import gsap from 'gsap';

/**
 * Base
 */
const canvas = (document.querySelector('canvas.webgl') || undefined) as HTMLCanvasElement | undefined;

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 4;
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

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.addEventListener('change', () => {
  const distance = camera.position.distanceTo(new THREE.Vector3(-1.4, 0.18, 0.07));
  camera.fov = distance * 10;
  camera.updateProjectionMatrix();
});

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

/**
 * Loaders
 */
const loadingElement = document.querySelector('.loading');
const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.to(overlayMaterial.uniforms.uAlpha, {
      duration: 1,
      value: 0,
      delay: 0.3,
    });

    if (window.innerWidth > 768) {
      gsap.to(camera.position, {
        duration: 1,
        x: 1,
        delay: 0.3,
      });
      gsap.to(camera.position, {
        duration: 1,
        y: 2.5,
        delay: 0.3,
      });
      gsap.to(camera.position, {
        duration: 1,
        z: 4.5,
        delay: 0.3,
      });

      controls.target.set(1, 2.3, 2);
    } else {
      gsap.to(camera.position, {
        duration: 1,
        x: -1.0,
        delay: 0.3,
      });
      gsap.to(camera.position, {
        duration: 1,
        y: 3.0,
        delay: 0.3,
      });
      gsap.to(camera.position, {
        duration: 1,
        z: 7.2,
        delay: 0.3,
      });

      controls.target.set(-1, 1.2, 1);
    }

    if (!loadingElement) return;
    setTimeout(() => {
      loadingElement.remove();
    }, 3000);
  },
  // Progress
  (_, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    if (!loadingElement) return;
    loadingElement.innerHTML = `${Math.round(progressRatio * 100)}%`;
  }
);

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager).setDRACOLoader(new DRACOLoader().setDecoderPath('draco/'));

/**
 * Environment map
 */
const environmentMap = textureLoader.load('/threejs-my-house-interior/environment/environment.jpg');
const environmentMap2 = textureLoader.load('/threejs-my-house-interior/environment/environment2.jpg');
const backGroundEnvironment = textureLoader.load('/threejs-my-house-interior/environment/night_skyscraper.jpg');
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;
environmentMap2.mapping = THREE.EquirectangularReflectionMapping;
environmentMap2.colorSpace = THREE.SRGBColorSpace;
backGroundEnvironment.mapping = THREE.EquirectangularReflectionMapping;
backGroundEnvironment.colorSpace = THREE.SRGBColorSpace;
scene.background = backGroundEnvironment;

/**
 * Textures
 */
const bakedTexture = textureLoader.load('/threejs-my-house-interior/bedroomBaked.jpg');
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

const glassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  transmission: 0.95,
  opacity: 1,
  ior: 1.95,
  envMap: environmentMap2,
});

const glassMaterial2 = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  envMapIntensity: 1,
  transmission: 0.95,
  transparent: true,
  ior: 1.75,
  envMap: environmentMap,
  side: THREE.DoubleSide,
  color: 0x555555, // ダークグレー
  opacity: 1,
});

const copperMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 1,
  transmission: 1,
  ior: 1.75,
  envMap: environmentMap2,
  color: 0xffa500,
  side: THREE.DoubleSide,
});

const lightBulbMaterial1 = new THREE.MeshBasicMaterial({ color: 0xfedcbd });
const lightBulbMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffa500 });

const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 1.0 },
  },
  vertexShader: overlayVertexShader,
  fragmentShader: overlayFragmentShader,
});

/**
 * Custom Models
 */
gltfLoader.load('/threejs-my-house-interior/bedroom.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    const mesh = child as THREE.Mesh;

    mesh.material = (() => {
      if (['TableGlass', 'BottledGlass'].includes(mesh.name)) return glassMaterial;
      if (['BottledLight'].includes(mesh.name)) return lightBulbMaterial1;
      if (['XtalMetal'].includes(mesh.name)) return copperMaterial;
      if (['XtalLight'].includes(mesh.name)) {
        console.log(mesh.position);
        return lightBulbMaterial2;
      }
      if (['Xtal'].includes(mesh.name)) return glassMaterial2;
      return bakedMaterial;
    })();
  });
});

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  raycaster.setFromCamera(mouse, camera);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
