import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { SceneService } from './camera-scene.service';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable()
export class ModelLoaderService {
  private objLoader = new OBJLoader();

  constructor(private sceneService: SceneService) { }

  async loadOBJModel(url: string, boundingBoxObject: THREE.LineSegments): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.objLoader.load(
        url,
        (object) => {
          object.rotation.set(0, 0, 0);
          object.updateMatrixWorld(true);
  
          const boundingBoxMatrix = boundingBoxObject.matrixWorld;
  
          object.applyMatrix4(boundingBoxMatrix);
  
          const boundingBox = new THREE.Box3().setFromObject(boundingBoxObject);
          const objBoundingBox = new THREE.Box3().setFromObject(object);
  
          const boxCenter = new THREE.Vector3();
          boundingBox.getCenter(boxCenter);
          const objCenter = new THREE.Vector3();
          objBoundingBox.getCenter(objCenter);
  
          const positionOffset = new THREE.Vector3().subVectors(boxCenter, objCenter);
          object.position.add(positionOffset);
  
          const boxSize = new THREE.Vector3();
          boundingBox.getSize(boxSize);
          const objSize = new THREE.Vector3();
          objBoundingBox.getSize(objSize);
  
          const scaleFactor = Math.min(
            boxSize.x / objSize.x,
            boxSize.y / objSize.y,
            boxSize.z / objSize.z
          );
  
          object.scale.set(scaleFactor, scaleFactor, scaleFactor);
  
          objBoundingBox.setFromObject(object);
          const finalObjCenter = new THREE.Vector3();
          objBoundingBox.getCenter(finalObjCenter);
          const finalOffset = new THREE.Vector3().subVectors(boxCenter, finalObjCenter);
          object.position.add(finalOffset);
  
          this.sceneService.scene.add(object);
          resolve(object);
        },
        undefined,
        (error) => reject(error),
      );
    });
  }
}
