import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FlakesTexture } from "three/addons/textures/FlakesTexture.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let scene,
  camera,
  renderer,
  controls,
  prismMesh,
  light1,
  light2,
  light3,
  light4;

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 100, 450);
  controls = new OrbitControls(camera, renderer.domElement);

  const sphere = new THREE.SphereGeometry(0.5, 16, 8);

  light1 = new THREE.PointLight(0xffffff, 1, 10);
  light1.add(
    new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 }))
  );
  scene.add(light1);

  // axe helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  axesHelper.position.set(10);

  // light2 = new THREE.PointLight(0x0040ff, 2, 50);
  // light2.add(
  //   new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0040ff }))
  // );
  // scene.add(light2);

  // light3 = new THREE.PointLight(0x80ff80, 2, 50);
  // light3.add(
  //   new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x80ff80 }))
  // );
  // scene.add(light3);

  // light4 = new THREE.PointLight(0xffaa00, 2, 50);
  // light4.add(
  //   new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffaa00 }))
  // );
  // scene.add(light4);

  // const light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);

  let envmaploader = new THREE.PMREMGenerator(renderer);

  new RGBELoader()
    .setPath("textures/")
    .load("whale_skeleton_4k.hdr", function (hdrmap) {
      let envmap = envmaploader.fromCubemap(hdrmap);
      let texture = new THREE.CanvasTexture(new FlakesTexture());
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 100;
      texture.repeat.y = 60;

      const prismMaterial = {
        clearcoat: 0.075,
        metalness: 1,
        roughness: 1,
        color: 0x000000,
        opacity: 0.2,
        transmission: 0,
        ior: 1,
        thickness: 1,
        specularIntensity: 0.2,
        specularColor: 0xffffff,
        envMapIntensity: 1,
        normalMap: texture,
        normalScale: new THREE.Vector2(0.15, 0.15),
        envMap: envmap.texture,
      };

      const prismGeo = new THREE.ConeGeometry(100, 175, 4);
      const prismMat = new THREE.MeshPhysicalMaterial(prismMaterial);
      prismMesh = new THREE.Mesh(prismGeo, prismMat);
      scene.add(prismMesh);

      animate();
    });
}

function animate() {
  requestAnimationFrame(animate);

  prismMesh.rotation.y += 0.0025;

  // if (prismMesh.position.z < 200) {
  //   prismMesh.position.z += 0.55;
  //   prismMesh.position.y += 0.3;
  // }

  controls.update();

  // console.log(prismMesh.position);
  renderer.render(scene, camera);
}

init();
