import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { bool } from "three/src/nodes/TSL.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.x = -1;
pointLight.position.y = 3;
pointLight.position.z = -4;
pointLight.visible = true;
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const guiPointLightFolder = gui.addFolder("PointLight");
guiPointLightFolder.add(pointLight.position, "x").min(-5).max(5).step(0.5);
guiPointLightFolder.add(pointLight.position, "y").min(-5).max(5).step(0.5);
guiPointLightFolder.add(pointLight.position, "z").min(-5).max(5).step(0.5);

const directionalLight = new THREE.DirectionalLight(0xff91c499, 2.5);
directionalLight.position.set(2, 1, 2);

scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

const guiDirectionalLigthFolder = gui.addFolder("Directional Light");

guiDirectionalLigthFolder
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.5);

guiDirectionalLigthFolder
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.5);

guiDirectionalLigthFolder
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.5);

/**
 * Objects
 */
// Material

const loader = new GLTFLoader();
loader.load(
  "models/LeePerrySmith.glb", // or .glb
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    model.scale.set(0.5, 0.5, 0.5);
    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    const skeleton = new THREE.SkeletonHelper(model);
    skeleton.material.linewidth = 5;
    skeleton.visible = true;
    scene.add(skeleton);
  },
  function (xhr) {
    // Optional progress callback: called while the model is loading
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    // Optional error callback: called if there's an error loading the model
    console.error("An error occurred loading the model:", error);
  }
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
