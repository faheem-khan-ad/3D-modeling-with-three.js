import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { SceneService } from './camera-scene.service';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

@Injectable()
export class ControlsService {
  private orbitControls!: OrbitControls;
  private transformControlsMap: Map<THREE.Object3D, TransformControls> =
    new Map();
  private currentTransformTarget: THREE.Object3D | null = null;

  constructor(private sceneService: SceneService) {}

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

    this.sceneService.scene.add(transformControls as unknown as THREE.Object3D);
    transformControls.attach(target);

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

  selectBoundingBox(boundingBox: THREE.Object3D): void {
    if (this.currentTransformTarget === boundingBox) return;

    this.deselectBoundingBox();

    const transformControls = this.transformControlsMap.get(boundingBox);
    if (transformControls) {
      transformControls.attach(boundingBox);
      this.sceneService.scene.add(
        transformControls as unknown as THREE.Object3D,
      );
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
        this.sceneService.scene.remove(
          transformControls as unknown as THREE.Object3D,
        );
      }
      this.currentTransformTarget = null;
      this.orbitControls.enabled = true; // Re-enable orbit controls
    }
  }

  hideTransformHelpers(): void {
    this.transformControlsMap.forEach((controls) => {
      this.sceneService.scene.remove(controls as unknown as THREE.Object3D);
    });
  }

  showTransformHelperForModel(model: THREE.Object3D): void {
    const controls = this.transformControlsMap.get(model);
    if (!controls) {
      console.warn('No transform controls found for this model');
      return;
    }
    this.sceneService.scene.add(controls as unknown as THREE.Object3D);
  }

  disposeAllControls(): void {
    this.transformControlsMap.forEach((controls, target) => {
      controls.detach();
      this.sceneService.scene.remove(controls as unknown as THREE.Object3D);
      controls.dispose();
    });
    this.transformControlsMap.clear();
    this.orbitControls.dispose();
  }
}
