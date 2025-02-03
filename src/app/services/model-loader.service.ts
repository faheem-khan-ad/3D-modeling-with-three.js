import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { SceneService } from './camera-scene.service';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable()
export class ModelLoaderService {
  private objLoader = new OBJLoader();

  constructor(private sceneService: SceneService) {}

  async loadOBJModel(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.objLoader.load(
        url,
        (object) => {
          object.scale.set(0.5, 0.5, 0.5);
          this.sceneService.scene.add(object);
          resolve(object);
        },
        undefined,
        (error) => reject(error),
      );
    });
  }
}
