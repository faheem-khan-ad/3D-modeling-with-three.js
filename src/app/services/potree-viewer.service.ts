import {
  ClipMode,
  PointCloudOctree,
  PointSizeType,
  Potree,
} from '@pnext/three-loader';
import { Injectable } from '@angular/core';
import { PotreeData } from '../interfaces';
import { ModelConfig } from '../constants';
import { BufferGeometry, Vector3, Box3 } from 'three';

@Injectable({
  providedIn: 'root',
})
export class PotreeViewer {
  private readonly potreeViewer = new Potree('v2');
  private readonly pointClouds: PointCloudOctree[] = [];

  async loadData(urls: PotreeData) {
    this.injectPresignedUrls(urls);

    return this.potreeViewer
      .loadPointCloud(
        'metadata.json',
        (fileName: any) => `${urls.metadata}${fileName}`,
      )
      .then((pco: PointCloudOctree) => {
        this.pointClouds.push(pco);
        pco.material.size = ModelConfig.defaultPointSize;
        pco.material.pointSizeType = PointSizeType.ADAPTIVE;
        pco.material.clipMode = ClipMode.CLIP_HORIZONTALLY;
        pco.material.clipExtent = [0.0, 0.0, 1.0, 1.0];
        return pco;
      });
  }

  updateData(camera: any, renderer: any) {
    this.potreeViewer.updatePointClouds(this.pointClouds, camera, renderer);
  }

  injectPresignedUrls(urls: PotreeData) {
    const nativeFetch = window.fetch;
    window.fetch = function (...args) {
      if (typeof args[0] === 'string') {
        if (args[0].toString().includes('hierarchy.bin')) {
          args[0] = urls.hierarchy;
        } else if (args[0].toString().includes('octree.bin')) {
          args[0] = urls.octree;
        } else if (args[0].toString().includes('metadata.json')) {
          args[0] = urls.metadata;
        }
      }
      return nativeFetch.apply(window, args);
    };
  }

  labelUrl(files: string[]) {
    let potreeDataUrls: any = {};
    files.forEach((file) => {
      if (file.includes('hierarchy.bin')) {
        potreeDataUrls['hierarchy'] = file;
      } else if (file.includes('octree.bin')) {
        potreeDataUrls['octree'] = file;
      } else if (file.includes('metadata.json')) {
        potreeDataUrls['metadata'] = file;
      }
    });
    return potreeDataUrls;
  }

  incrementPointSize() {
    if (this.pointClouds[0]) {
      this.pointClouds[0].material.size += ModelConfig.pointSizeChangeFactor;
    }
  }

  decrementPointSize() {
    if (
      this.pointClouds[0] &&
      this.pointClouds[0].material.size > ModelConfig.minimumPointSize
    )
      this.pointClouds[0].material.size -= ModelConfig.pointSizeChangeFactor;
  }

  getBoundingBox(geometry: BufferGeometry, position: Vector3): Box3 {
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    if (!boundingBox) {
      return new Box3();
    }
    boundingBox.max = boundingBox.max.clone().addScaledVector(position, 1);
    boundingBox.min = boundingBox.min.clone().addScaledVector(position, 1);
    return boundingBox;
  }
}
