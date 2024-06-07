// Workerでの処理に必要な外部スクリプトを読み込む
importScripts('https://unpkg.com/three@0.158.0/build/three.js');

let canvas: OffscreenCanvas & { style: { width: number; height: number } };
let sizes: { width: number; height: number };
let renderer: WebGLRenderer;
const meshList = [];
// onmessageイベントハンドラーでメインスレッドからのメッセージを受け取る
onmessage = (event) => {
  // FIXME:
  if (event.data.type !== 'update') {
    canvas = event.data.canvas;
    sizes = event.data.sizes;
    canvas.style = { width: sizes.width, height: sizes.height };
    renderer = new THREE.WebGLRenderer({ canvas });
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  scene.add(camera);

  renderer.setSize(sizes.width, sizes.height);

  renderer.shadowMap.enabled = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 1, 0);
  directionalLight2.position.set(0, -1, 0);
  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(directionalLight2);

  const params = event.data.params;

  const Sphere = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const meshInit = (boxCount: number) => {
    meshList.forEach((mesh) => scene.remove(mesh));
    meshList.length = 0;

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

  /**
   * AnimationFrame
   */
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    camera.position.x = 12 * Math.cos(elapsedTime * 0.5);
    camera.position.z = 12 * Math.sin(elapsedTime * 0.5);
    camera.position.y = 12 * Math.sin(elapsedTime * 0.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
};
