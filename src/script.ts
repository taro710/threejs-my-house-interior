import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import tvVertexShader from "./shaders/tv/vertex.glsl";
import tvFragmentShader from "./shaders/tv/fragment.glsl";
import overlayVertexShader from "./shaders/overlay/vertex.glsl";
import overlayFragmentShader from "./shaders/overlay/fragment.glsl";
import gsap from "gsap";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -2;
camera.position.y = 6.5;
camera.position.z = 4;

scene.add(camera);

// const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
//   type: THREE.FloatType,
// });
// const cubeCamera = new THREE.CubeCamera(1, 100, cubeRenderTarget);
// scene.add(cubeCamera);
// cubeCamera.renderTarget.mapping = THREE.CubeRefractionMapping;

// cubeCamera.layers.set(1);

// scene.environment = cubeRenderTarget.texture;
// scene.environment = environmentMap;
// scene.background = environmentMap;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(-0.5, 1.2, 0);

/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.to(overlayMaterial.uniforms.uAlpha, {
      duration: 1,
      value: 0,
      delay: 0.3,
    });

    gsap.to(camera.position, {
      duration: 1,
      x: -4.0,
      delay: 0.3,
    });
    gsap.to(camera.position, {
      duration: 1,
      y: 1.8,
      delay: 0.3,
    });
    gsap.to(camera.position, {
      duration: 1,
      z: 3.2,
      delay: 0.3,
    });

    camera.position.x = -3.0788130905774542;
    camera.position.y = 0.9351603234032935;
    camera.position.z = 3.41923123799197;
    console.log("Loading complete");
  },
  () => {
    console.log("Loading is in progress");
  }
);

// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

// /**
//  * Environment map
//  */
const environmentMap = textureLoader.load("environment/environment.jpg");
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

const environmentMap2 = textureLoader.load("environment/environment2.jpg");
environmentMap2.mapping = THREE.EquirectangularReflectionMapping;
environmentMap2.colorSpace = THREE.SRGBColorSpace;

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

const tableMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  transmission: 0.95,
  opacity: 1,
  ior: 1.95,
  envMap: environmentMap2,
});

// やや暖色寄りの反射
const metalMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 0.9,
  clearcoat: 1,
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
  clearcoat: 1,
  transmission: 0.95,
  opacity: 1,
  ior: 1,
  envMap: environmentMap2,
  side: THREE.DoubleSide,
});

const xtalMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  envMapIntensity: 1,
  transmission: 0.95,
  transparent: true,
  ior: 1.75,
  envMap: environmentMap,
  side: THREE.DoubleSide,
  // ダークグレー
  color: 0x555555,
  opacity: 1,
});

const xtalMetalMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 1,
  transmission: 1,
  ior: 1.75,
  envMap: environmentMap2,
  color: 0xffa500,
  side: THREE.DoubleSide,
});

const xtalBulb = new THREE.MeshBasicMaterial({ color: 0xffa500 });

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8, 200);
directionalLight1.position.set(0, 4, -2);
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8, 200);
directionalLight2.position.set(-4, 1, 2);
scene.add(directionalLight2);

// sofaMaterial オリーブグリーン
const sofaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x534719,
  roughness: 0.5,
});

// 淡いオレンジ
const lightBulb = new THREE.MeshBasicMaterial({ color: 0xffffff });

const pointLight1 = new THREE.PointLight(0xf68b1f, 0.5, 1);
pointLight1.position.set(-1.15, 0.81, 3.48);
scene.add(pointLight1);

// TVモニター
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: tvVertexShader,
  fragmentShader: tvFragmentShader,
  side: THREE.DoubleSide,
});

const tVGeometry = new THREE.PlaneGeometry(0.82, 0.48, 1, 1);
const tv = new THREE.Mesh(tVGeometry, shaderMaterial);
tv.position.set(-1.39, 0.95, -2.59);
tv.rotateY(0.5235988354713379);
scene.add(tv);

// Overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 1.0 },
  },
  vertexShader: overlayVertexShader,
  fragmentShader: overlayFragmentShader,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Model
 */
gltfLoader.load("myroom.glb", (gltf) => {
  scene.add(gltf.scene);

  gltf.scene.traverse((child) => {
    if (["CoffeeTable"].includes(child.name)) {
      child.material = tableMaterial;
    } else if (["BarcelonaReg"].includes(child.name)) {
      child.material = metalMaterial;
    } else if (
      ["TVReg", "SofaReg", "DiningTableReg", "StepWire"].includes(child.name)
    ) {
      child.material = metalMaterial2;
    } else if (["BarcelonaBack", "BarcelonaSeat"].includes(child.name)) {
      child.material = sofaMaterial;
    } else if (["LampBulb"].includes(child.name)) {
      child.material = lightBulb;
    } else if (["Xtal"].includes(child.name)) {
      child.material = xtalMaterial;
    } else if (["XtalMetal"].includes(child.name)) {
      child.material = xtalMetalMaterial;
    } else if (["XtalLight"].includes(child.name)) {
      child.material = xtalBulb;
    } else {
      child.material = bakedMaterial;
    }
  });
});

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

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
particlesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

// Material
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

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.z = -5;
particles.position.y = 0.8;

scene.add(particles);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  particlesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  shaderMaterial.uniforms.uTime.value = elapsedTime;
  particlesMaterial.uniforms.uTime.value = elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
