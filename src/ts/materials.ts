import * as THREE from "three";
import { environmentMap, environmentMap2 } from "./envmap";

/**
 * Materials
 */
// Baked material
// export const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

export const tableMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  transmission: 0.95,
  opacity: 1,
  ior: 1.95,
  envMap: environmentMap2,
});

// やや暖色寄りの反射
export const metalMaterial = new THREE.MeshPhysicalMaterial({
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
export const metalMaterial2 = new THREE.MeshPhysicalMaterial({
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

export const xtalMaterial = new THREE.MeshPhysicalMaterial({
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

export const xtalMetalMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0,
  envMapIntensity: 1,
  transmission: 1,
  ior: 1.75,
  envMap: environmentMap2,
  color: 0xffa500,
  side: THREE.DoubleSide,
});

export const xtalBulb = new THREE.MeshBasicMaterial({ color: 0xffa500 });

// sofaMaterial オリーブグリーン
export const sofaMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x534719,
  roughness: 0.5,
});

// 淡いオレンジ
export const lightBulb = new THREE.MeshBasicMaterial({ color: 0xfedcbd });

// // Material
// export const particlesMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     uTime: { value: 0 },
//     uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
//     uSize: { value: 100 },
//   },
//   vertexShader: particlesVertexShader,
//   fragmentShader: particlesFragmentShader,
//   transparent: true,
//   blending: THREE.AdditiveBlending,
//   depthWrite: false,
// });
