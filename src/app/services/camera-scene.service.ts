import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { CANVAS_VIEWER } from '../constants';

@Injectable()
export class SceneService {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  initializeScene(container: ElementRef): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);

    const aspectRatio =
      container.nativeElement.clientWidth /
      container.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.01, 3000);
    this.camera.position.set(0, 2, 5);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false,
      depth: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.setSize(
      container.nativeElement.clientWidth,
      container.nativeElement.clientHeight,
    );
    container.nativeElement.appendChild(this.renderer.domElement);

    this.addLights();
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(
      CANVAS_VIEWER.AMBIENT_LIGHT_COLOR,
      0.7,
    );
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      CANVAS_VIEWER.AMBIENT_LIGHT_COLOR,
      0.5,
    );
    this.scene.add(directionalLight);
  }

  handleResize(container: ElementRef): void {
    const width = container.nativeElement.clientWidth;
    const height = container.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  addObjectToScene(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  centerObject(
    obj: THREE.Object3D,
    zoomFactor?: number,
    isPcoLoad: boolean = false,
  ): void {
    obj.updateMatrixWorld(true);
    let boundingBox: THREE.Box3;

    if (isPcoLoad && obj.children[0]) {
      boundingBox = new THREE.Box3().setFromObject(obj.children[0]);
    } else {
      boundingBox = new THREE.Box3().setFromObject(obj);
    }

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const boundingBoxSize = new THREE.Vector3();
    boundingBox.getSize(boundingBoxSize);
    const maxDimension = Math.max(
      boundingBoxSize.x,
      boundingBoxSize.y,
      boundingBoxSize.z,
    );

    const distance = zoomFactor
      ? (maxDimension /
        Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5))) *
      zoomFactor
      : maxDimension /
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));

    this.camera.position.set(center.x, center.y - distance, center.z);
    this.camera.lookAt(center);
    this.camera.near = maxDimension / CANVAS_VIEWER.CAMERA_SIZING_FACTOR;
    this.camera.far = maxDimension * CANVAS_VIEWER.CAMERA_SIZING_FACTOR;
    this.camera.updateProjectionMatrix();
  }
}
