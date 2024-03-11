import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

/**
 * Environment map
 */
// scene.backgroundBlurriness = 0;
// scene.backgroundIntensity = 1;

// const environmentMap = textureLoader.load("/environmentMaps/environment.jpeg");
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// environmentMap.colorSpace = THREE.SRGBColorSpace;

// scene.background = environmentMap;

// const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
//   type: THREE.FloatType,
// });

// scene.environment = cubeRenderTarget.texture;
// scene.environment = environmentMap;
// scene.background = environmentMap;

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
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
  ior: 0.95,
});

const metalMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 0.9,
  clearcoat: 1,
  transmission: 0.95,
  opacity: 1,
  ior: 0.95,
});

const pointLight1 = new THREE.DirectionalLight(0xffffff, 1, 200);
pointLight1.position.set(0, 4, -2);
scene.add(pointLight1);
const pointLight2 = new THREE.DirectionalLight(0xffffff, 2, 200);
pointLight2.position.set(-4, 1, 2);
scene.add(pointLight2);

// sofaMaterial オリーブグリーン
const sofaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x534719,
  roughness: 0.5,
});

/**
 * Model
 */
gltfLoader.load("myroom.glb", (gltf) => {
  scene.add(gltf.scene);
  //   console.log(gltf.scene.children);

  gltf.scene.traverse((child) => {
    if (child.name === "Cube004") {
      child.material = tableMaterial;
    } else if (
      child.name === "Cube009" ||
      child.name === "Cube010" ||
      child.name === "Cylinder018" ||
      child.name === "TV_reg1" ||
      child.name === "TV_reg2"
    ) {
      child.material = metalMaterial;
    } else if (child.name === "Cylinder013") {
      child.material.side = THREE.DoubleSide;
    } else if (child.name === "Cube007" || child.name === "Cube008") {
      child.material = sofaMaterial;
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

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -5.0477398991704545;
camera.position.y = 3.9258751767715205;
camera.position.z = 3.584292949472373;
camera.rotation.x = -0.37661660296961064;
camera.rotation.y = -0.7826405636482832;
camera.rotation.z = -0.271974320982447;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;

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

  particlesMaterial.uniforms.uTime.value = elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();