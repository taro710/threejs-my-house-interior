import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';
import tvVertexShader from './shaders/tv/vertex.glsl';
import tvFragmentShader from './shaders/tv/fragment.glsl';
import overlayVertexShader from './shaders/overlay/vertex.glsl';
import overlayFragmentShader from './shaders/overlay/fragment.glsl';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
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
camera.position.x = -2;
camera.position.y = 6.5;
camera.position.z = 4;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
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
      camera.position.x = -3.07;
      camera.position.y = 0.93;
      camera.position.z = 3.41;

      gsap.to(camera.position, {
        duration: 1,
        x: -3.6,
        delay: 0.3,
      });
      gsap.to(camera.position, {
        duration: 1,
        y: 2.2,
        delay: 0.3,
      });
      gsap.to(camera.position, {
        duration: 1,
        z: 5.2,
        delay: 0.3,
      });

      controls.target.set(-0.5, 1.2, 0);
    } else {
      camera.position.x = -3.07;
      camera.position.y = 0.93;
      camera.position.z = 3.41;

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

      controls.target.set(-1, 1.2, 0);
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
const environmentMap = textureLoader.load('environment/environment.jpg');
const environmentMap2 = textureLoader.load('environment/environment2.jpg');
const backGroundEnvironment = textureLoader.load('environment/night_skyscraper.jpg');
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
const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Lights
 */
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
const pointLight1 = new THREE.PointLight(0xf68b1f, 0.5, 1);
directionalLight1.position.set(0, 4, -2);
directionalLight2.position.set(-4, 1, 2);
pointLight1.position.set(-1.15, 0.81, 3.48);
scene.add(directionalLight1);
scene.add(directionalLight2);
scene.add(pointLight1);

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

// やや暖色寄りの反射
const metalMaterial1 = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 0.9,
  transmission: 0.95,
  opacity: 1,
  ior: 1,
  envMap: environmentMap,
  side: THREE.DoubleSide,
});

// シルバー寄りの反射
const metalMaterial2 = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 0.9,
  transmission: 0.95,
  opacity: 1,
  ior: 1,
  envMap: environmentMap2,
  side: THREE.DoubleSide,
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

const sofaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x534719,
  roughness: 0.5,
});

const lightBulbMaterial1 = new THREE.MeshBasicMaterial({ color: 0xfedcbd });
const lightBulbMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffa500 });

const particlesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
  },
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const tvMonitorMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: tvVertexShader,
  fragmentShader: tvFragmentShader,
  side: THREE.DoubleSide,
});

const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 1.0 },
  },
  vertexShader: overlayVertexShader,
  fragmentShader: overlayFragmentShader,
});

/**
 * Physics
 */
// const world = new CANNON.World();
// const setGravity = () => {
//   world.gravity.set(0, -9.82, -0.5);
// };
// setTimeout(setGravity, 4000);
// setTimeout(() => {
//   console.log('Allow sleep');
//   world.allowSleep = true;
// }, 5000);

// world.broadphase = new CANNON.SAPBroadphase(world);
// world.allowSleep = false;
// world.gravity.set(0, 0, 0);
// // Default material
// const defaultMaterial = new CANNON.Material('default');
// const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
//   friction: 0,
//   restitution: 0.3,
// });
// world.defaultContactMaterial = defaultContactMaterial;
// // Floor
// const floorShape = new CANNON.Plane();
// const floorBody = new CANNON.Body();
// floorBody.mass = 0;
// floorBody.position.set(0, 0, 0);
// floorBody.addShape(floorShape);
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// world.addBody(floorBody);
// const wallBody = new CANNON.Body();
// wallBody.mass = 0;
// wallBody.position.set(0, 0, -3);
// wallBody.addShape(new CANNON.Plane());
// wallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0);
// world.addBody(wallBody);
// const cannonDebugger = new CannonDebugger(scene, world);

// // Create box
// const boxGeometry = new THREE.BoxGeometry(1.1, 2, 0.05);
// const boxMaterial = new THREE.MeshStandardMaterial({
//   metalness: 0.3,
//   roughness: 0.4,
//   envMapIntensity: 0.5,
//   map: bakedTexture,
// });
// const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
// mesh.castShadow = true;
// // mesh.position.set(-6, 0, 0.94);
// scene.add(mesh);
// const objectsToUpdate = [];
// const body = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(-4, 1.55, -2.94),
//   shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.025)),
//   material: defaultMaterial,
//   quaternion: new CANNON.Quaternion(0, 0, 0.01),
// });

// world.addBody(body);
// objectsToUpdate.push({ mesh, body });

/**
 * Custom Models
 */
let mixer: THREE.AnimationMixer;
let akabeko: THREE.Object3D[];
let headAction: THREE.AnimationAction;
gltfLoader.load('myroom.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    const mesh = child as THREE.Mesh;

    mesh.material = (() => {
      if (['TVReg', 'SofaReg', 'DiningTableReg', 'StepWire'].includes(mesh.name)) return metalMaterial2;
      if (['BarcelonaBack', 'BarcelonaSeat'].includes(mesh.name)) return sofaMaterial;
      if (['CoffeeTable', 'BottledGlass', 'FlowerBottle'].includes(mesh.name)) return glassMaterial;
      if (['LampBulb', 'BottledLight'].includes(mesh.name)) return lightBulbMaterial1;
      if (['BarcelonaReg'].includes(mesh.name)) return metalMaterial1;
      if (['XtalMetal'].includes(mesh.name)) return copperMaterial;
      if (['XtalLight'].includes(mesh.name)) return lightBulbMaterial2;
      if (['Xtal'].includes(mesh.name)) return glassMaterial2;
      return bakedMaterial;
    })();

    akabeko = [gltf.scene.getObjectByName('AkabekoHead'), gltf.scene.getObjectByName('AkabekoBody')].filter((object) => object) as THREE.Object3D[];
  });

  // Animation
  mixer = new THREE.AnimationMixer(gltf.scene);
  headAction = mixer.clipAction(gltf.animations[0]);
});

const akabekoAnimation = (state: 'start' | 'stop') => {
  if (state === 'stop' && !headAction.isRunning()) {
    headAction.stop();
    return;
  }
  if (headAction.isRunning()) return;
  headAction.loop = THREE.LoopOnce;
  headAction.play();
};

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 100;
const positionArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);
for (let i = 0; i < particlesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
  scaleArray[i] = Math.random();
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.z = -5;
particles.position.y = 0.8;
scene.add(particles);

/**
 * TV Monitor
 */
const tVGeometry = new THREE.PlaneGeometry(0.82, 0.48, 1, 1);
const tv = new THREE.Mesh(tVGeometry, tvMonitorMaterial);
tv.position.set(-1.39, 0.95, -2.59);
tv.rotateY(0.5235988354713379);
scene.add(tv);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  tvMonitorMaterial.uniforms.uTime.value = elapsedTime;
  particlesMaterial.uniforms.uTime.value = elapsedTime;

  raycaster.setFromCamera(mouse, camera);
  if (akabeko) {
    const modelIntersects = raycaster.intersectObjects(akabeko);

    if (modelIntersects.length) {
      akabekoAnimation('start');
    } else {
      akabekoAnimation('stop');
    }
  }

  if (mixer) mixer.update(deltaTime);

  // // Update physics
  // world.step(1 / 60, deltaTime, 3);
  // for (const object of objectsToUpdate) {
  //   object.mesh.position.copy(object.body.position);
  //   object.mesh.quaternion.copy(object.body.quaternion);
  // }
  // cannonDebugger.update();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
