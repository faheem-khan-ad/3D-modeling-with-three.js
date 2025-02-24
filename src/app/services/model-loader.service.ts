import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { SceneService } from './camera-scene.service';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable()
export class ModelLoaderService {
  private readonly objLoader = new OBJLoader();

  constructor(private readonly sceneService: SceneService) { }

  loadOBJModel(url: string, boundingBoxObject: THREE.Object3D): void {
    this.objLoader.load(
      url,
      (object) => {
        object.position.set(0, 0, 0);
        object.rotation.set(0, 0, 0);
        object.scale.set(1, 1, 1);
        object.updateMatrixWorld(true);

        const objBoundingBox = new THREE.Box3().setFromObject(object);
        const objSize = new THREE.Vector3();
        objBoundingBox.getSize(objSize);

        boundingBoxObject.updateMatrixWorld(true);

        const worldBoundingBox = new THREE.Box3().setFromObject(boundingBoxObject);
        const worldSize = new THREE.Vector3();
        worldBoundingBox.getSize(worldSize);

        const scaleFactor = Math.min(
          worldSize.x / objSize.x,
          worldSize.y / objSize.y,
          worldSize.z / objSize.z
        );

        object.scale.set(scaleFactor, scaleFactor, scaleFactor);
        object.updateMatrixWorld(true);

        boundingBoxObject.add(object);

        const objCenter = new THREE.Vector3();
        objBoundingBox.setFromObject(object);
        objBoundingBox.getCenter(objCenter);

        boundingBoxObject.worldToLocal(objCenter);

        object.position.sub(objCenter);
        object.updateMatrixWorld(true);

        if (!this.sceneService.scene.children.includes(boundingBoxObject)) {
          this.sceneService.scene.add(boundingBoxObject);
        }
      }
    );
  }
}