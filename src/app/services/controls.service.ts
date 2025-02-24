import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { SceneService } from './camera-scene.service';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

@Injectable()
export class ControlsService {
  private orbitControls!: OrbitControls;
  private readonly transformControlsMap: Map<THREE.Object3D, TransformControls> =
    new Map();
  private currentTransformTarget: THREE.Object3D | null = null;

  constructor(private readonly sceneService: SceneService) { }

  initializeOrbitControls(): OrbitControls {
    this.orbitControls = new OrbitControls(
      this.sceneService.camera,
      this.sceneService.renderer.domElement,
    );
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = true;
    return this.orbitControls;
  }

  disableOrbitControls(): void {
    if (this.orbitControls) {
      this.orbitControls.enabled = false;
    }
  }

  enableOrbitControls(): void {
    if (this.orbitControls) {
      this.orbitControls.enabled = true;
    }
  }

  registerTransformChangeCallback(callback: () => void): void {
    this.transformControlsMap.forEach((controls) => {
      controls.addEventListener('change', callback);
    });
  }

  createTransformControls(target: THREE.Object3D): TransformControls {
    const transformControls = new TransformControls(
      this.sceneService.camera,
      this.sceneService.renderer.domElement,
    );

    transformControls.attach(target);
    const helper = transformControls.getHelper()
    if (helper) {
      this.sceneService.scene.add(helper)
      helper.visible = false
    }

    this.transformControlsMap.set(target, transformControls);

    transformControls.addEventListener('dragging-changed', (event) => {
      this.orbitControls.enabled = !event.value;
    });

    transformControls.addEventListener('change', () => {
      this.sceneService.render();
    });

    return transformControls;
  }

  setTransformMode(
    target: THREE.Object3D,
    mode: 'translate' | 'rotate' | 'scale',
  ): void {
    const controls = this.transformControlsMap.get(target);
    if (controls) {
      controls.setMode(mode);
    }
  }

  createBoundingBox(position: THREE.Vector3, geometry: { x: number, y: number, z: number } = { x: 2, y: 2, z: 2 }): THREE.LineSegments {
    const boxGeometry = new THREE.BoxGeometry(geometry.x, geometry.y, geometry.z);
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const boundingBox = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    boundingBox.position.copy(position);

    const invisibleMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const invisibleMesh = new THREE.Mesh(boxGeometry, invisibleMaterial);
    boundingBox.add(invisibleMesh);
    return boundingBox;
  }

  selectBoundingBox(boundingBox: THREE.Object3D): void {
    if (this.currentTransformTarget === boundingBox) return;

    this.deselectBoundingBox();

    const transformControls = this.transformControlsMap.get(boundingBox);
    if (transformControls) {
      transformControls.attach(boundingBox);
      const helper = transformControls.getHelper()
      if (helper) {
        this.sceneService.scene.add(helper)
      }
      this.currentTransformTarget = boundingBox;
    }
  }

  deselectBoundingBox(): void {
    if (this.currentTransformTarget) {
      const transformControls = this.transformControlsMap.get(
        this.currentTransformTarget,
      );
      if (transformControls) {
        transformControls.detach();
        const helper = transformControls.getHelper()
        if (helper) {
          helper.visible = false
        }
      }
      this.currentTransformTarget = null;
      this.orbitControls.enabled = true; // Re-enable orbit controls
    }
  }

  hideTransformHelpers(): void {
    this.transformControlsMap.forEach((controls) => {
      const helper = controls.getHelper()
      if (helper) {
        helper.visible = false
      }
    });
  }

  showTransformHelperForModel(model: THREE.Object3D): void {
    const controls = this.transformControlsMap.get(model);
    if (!controls) {
      console.warn('No transform controls found for this model');
      return;
    }
    const helper = controls.getHelper()
    if (helper) {
      this.sceneService.scene.add(helper)
      helper.visible = true
    }
  }

  disposeAllControls(): void {
    this.transformControlsMap.forEach((controls, target) => {
      controls.detach();
      const helper = controls.getHelper()
      if (helper) {
        helper.visible = false
      }
      controls.dispose();
    });
    this.transformControlsMap.clear();
    this.orbitControls.dispose();
  }
}
