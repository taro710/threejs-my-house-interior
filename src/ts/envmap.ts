import * as THREE from "three";
import { useTextureLoader } from "../script";

const { textureLoader } = useTextureLoader();

// /**
//  * Environment map
//  */
export const environmentMap = textureLoader.load("environment/environment.jpg");
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

export const environmentMap2 = textureLoader.load(
  "environment/environment2.jpg"
);
environmentMap2.mapping = THREE.EquirectangularReflectionMapping;
environmentMap2.colorSpace = THREE.SRGBColorSpace;
