import * as THREE from 'three';
import { SceneService } from './camera-scene.service';
import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class InteractionService {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(private sceneService: SceneService) {}

  handleMouseDown(
    event: MouseEvent,
    container: ElementRef,
  ): THREE.Intersection[] {
    this.updateMousePosition(event, container);
    this.raycaster.params.Line.threshold = 1;
    this.raycaster.setFromCamera(this.mouse, this.sceneService.camera);
    return this.raycaster.intersectObjects(
      this.sceneService.scene.children,
      true,
    );
  }

  handleMouseMove(event: MouseEvent, container: ElementRef): void {
    this.updateMousePosition(event, container);
  }

  private updateMousePosition(event: MouseEvent, container: ElementRef): void {
    const rect = container.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  handleMouseWheel(event: WheelEvent, camera: THREE.PerspectiveCamera): void {
    const zoomSpeed = 0.5;
    camera.position.z += event.deltaY * zoomSpeed * 0.01;
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, 2, 20);
  }
}
