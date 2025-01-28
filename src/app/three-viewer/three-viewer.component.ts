import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

@Component({
  selector: 'app-three-viewer',
  templateUrl: './three-viewer.component.html',
  styleUrls: ['./three-viewer.component.css'],
  imports: [CommonModule],
})
export class ThreeViewerComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private boundingBoxes: THREE.LineSegments[] = [];
  private transformControlsMap: Map<THREE.LineSegments, TransformControls> = new Map();
  private raycaster!: THREE.Raycaster;
  private mouse!: THREE.Vector2;
  private controls!: OrbitControls;
  private selectedBoundingBox: THREE.LineSegments | null = null;

  isBoundingBoxSelected: boolean = false;

  constructor(private el: ElementRef, private renderer2: Renderer2) { }

  ngOnInit(): void {
    this.initScene();
    this.controls.update();
    this.animate();
  }

  private initScene(): void {
    const container = this.rendererContainer.nativeElement;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    // Camera
    const aspectRatio = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 2, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.scene.add(this.cube);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Raycaster and Mouse
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Event Listeners
    container.addEventListener('mousedown', (event: any) => this.onMouseDown(event));
    container.addEventListener('mousemove', (event: any) => this.onMouseMove(event));
    container.addEventListener('wheel', (event: WheelEvent) => this.onMouseWheel(event));

    // Resize Event
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onMouseDown(event: MouseEvent): void {
    const container = this.rendererContainer.nativeElement;
    const rect = container.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    for (let i = 0; i < this.boundingBoxes.length; i++) {
      const intersects = this.raycaster.intersectObject(this.boundingBoxes[i]);
      if (intersects.length > 0) {
        this.selectBoundingBox(this.boundingBoxes[i]);
        this.isBoundingBoxSelected = true;
        return;
      }
    }

    this.deselectBoundingBox();
  }

  private onMouseMove(event: MouseEvent): void {
    const container = this.rendererContainer.nativeElement;
    const rect = container.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
  }

  private onMouseWheel(event: WheelEvent): void {
    const zoomSpeed = 0.5;
    this.camera.position.z += event.deltaY * zoomSpeed * 0.01;
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, 2, 20);
  }

  private selectBoundingBox(boundingBox: THREE.LineSegments): void {
    if (this.selectedBoundingBox !== boundingBox) {
      if (this.selectedBoundingBox) {
        const prevTransformControls = this.transformControlsMap.get(this.selectedBoundingBox);
        if (prevTransformControls) {
          prevTransformControls.detach();
          const helper = prevTransformControls.getHelper();
          if (helper) {
            helper.visible = false;
          }
        }
      }

      this.selectedBoundingBox = boundingBox;
      const transformControls = this.transformControlsMap.get(boundingBox);
      if (transformControls) {
        transformControls.attach(boundingBox);
        const helper = transformControls.getHelper();
        if (helper) {
          helper.visible = true;
        }
      }
    }
  }

  private deselectBoundingBox(): void {
    if (this.selectedBoundingBox) {
      const transformControls = this.transformControlsMap.get(this.selectedBoundingBox);
      if (transformControls) {
        transformControls.detach();
        const helper = transformControls.getHelper();
        if (helper) {
          helper.visible = false;
        }
      }

      // Re-enable OrbitControls
      this.controls.enabled = true;

      this.selectedBoundingBox = null;
      this.isBoundingBoxSelected = false;
    }
  }


  // Add a new bounding box to the scene
  addBoundingBox(): void {
    const boxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const newBoundingBox = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    // Randomly position the bounding box
    newBoundingBox.position.set(
      Math.random() * 5 - 2.5,
      Math.random() * 5 - 2.5,
      Math.random() * 5 - 2.5
    );
    this.scene.add(newBoundingBox);
    this.boundingBoxes.push(newBoundingBox);

    // Initialize TransformControls for the bounding box
    const newTransformControls = new TransformControls(this.camera, this.renderer.domElement);
    newTransformControls.attach(newBoundingBox);
    newTransformControls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); // Re-render on change
    });
    newTransformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value; // Enable/disable OrbitControls
    });

    this.scene.add(newTransformControls.getHelper());
    this.transformControlsMap.set(newBoundingBox, newTransformControls);
  }


  setTransformMode(mode: 'translate' | 'rotate' | 'scale'): void {
    console.log('Changing mode to:', mode);

    if (this.selectedBoundingBox) {
      const transformControls = this.transformControlsMap.get(this.selectedBoundingBox);
      if (transformControls) {
        transformControls.setMode(mode);
        this.renderer.render(this.scene, this.camera); // Re-render the scene
      }
    }
  }

}
