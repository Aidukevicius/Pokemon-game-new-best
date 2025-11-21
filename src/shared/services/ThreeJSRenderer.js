
// THREE.JS 3D MODEL RENDERER
// Handles loading and rendering 3D Pokemon models using Three.js

export class ThreeJSRenderer {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.animationId = null;
  }

  async initialize() {
    // Dynamically import Three.js from CDN
    if (!window.THREE) {
      await this.loadThreeJS();
    }

    const THREE = window.THREE;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8fafc);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 3;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Start animation loop
    this.animate();
  }

  async loadThreeJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
      script.onload = () => {
        // Also load GLTFLoader
        const loaderScript = document.createElement('script');
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js';
        loaderScript.onload = resolve;
        loaderScript.onerror = reject;
        document.head.appendChild(loaderScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadModel(modelPath) {
    const THREE = window.THREE;
    const loader = new THREE.GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        (gltf) => {
          // Remove old model if exists
          if (this.model) {
            this.scene.remove(this.model);
          }

          this.model = gltf.scene;
          
          // Center and scale the model
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          this.model.scale.setScalar(scale);
          
          this.model.position.sub(center.multiplyScalar(scale));
          
          this.scene.add(this.model);
          resolve();
        },
        undefined,
        reject
      );
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate model slowly
    if (this.model) {
      this.model.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
