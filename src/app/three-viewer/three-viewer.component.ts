import * as THREE from 'three';
import { CommonModule } from '@angular/common';
import { ControlsService } from '../services/controls.service';
import { SceneService } from '../services/camera-scene.service';
import { PotreeViewer } from '../services/potree-viewer.service';
import { ModelLoaderService } from '../services/model-loader.service';
import { InteractionService } from '../services/interaction.service';
import { ScriptLoaderService } from '../services/script-loader.service';
import { CANVAS_MODEL_TYPES, MODEL_URL, ModelConfig } from '../constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-three-viewer',
  templateUrl: './three-viewer.component.html',
  styleUrls: ['./three-viewer.component.css'],
  imports: [CommonModule],
  providers: [
    InteractionService,
    SceneService,
    ControlsService,
    ModelLoaderService,
  ],
})
export class ThreeViewerComponent implements OnInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  private boundingBoxes: THREE.LineSegments[] = [];
  private selectedBoundingBox: THREE.LineSegments | null = null;
  private nexusObjectGroup!: THREE.Group;
  private transformObj!: TransformControls;
  private interactObject!: THREE.Object3D;
  private controls!: OrbitControls;
  private animationId!: number;
  private objModel!: THREE.Object3D;
  isBoundingBoxSelected = false;
  loadedScriptRef: any[] = [];
  externalJSFiles: string[] = ['js/nexus/nexus.js', 'js/nexus/nexus_three.js'];

  constructor(
    private ngZone: NgZone,
    private sceneService: SceneService,
    private controlsService: ControlsService,
    private modelLoader: ModelLoaderService,
    private interactionService: InteractionService,
    private potreeService: PotreeViewer,
    private scriptLoaderService: ScriptLoaderService,
    private cameraScene: SceneService,
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.loadScripts();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.handleResize());
    this.scriptLoaderService.unloadScripts(this.loadedScriptRef);
    cancelAnimationFrame(this.animationId);
    this.controlsService.disposeAllControls();
  }

  private initScene(): void {
    this.sceneService.initializeScene(this.rendererContainer);
    this.controls = this.controlsService.initializeOrbitControls();
    this.setupEventListeners();
    this.loadModels();
    this.animate();
  }

  private loadModels(): void {
    this.loadOBJModel('assets/APXBL06B_43-CT5.obj');
    this.loadModelFiles([MODEL_URL]);
  }

  private setupEventListeners(): void {
    const container = this.rendererContainer.nativeElement;

    container.addEventListener('mousedown', (event: MouseEvent) =>
      this.handleMouseDown(event),
    );
    container.addEventListener('mousemove', (event: MouseEvent) =>
      this.interactionService.handleMouseMove(event, this.rendererContainer),
    );
    container.addEventListener('wheel', (event: WheelEvent) =>
      this.handleMouseWheel(event),
    );
    container.addEventListener('dblclick', (event: MouseEvent) =>
      this.deselectBoundingBox(),
    );

    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  private handleResize(): void {
    this.sceneService.handleResize(this.rendererContainer);
  }

  private handleMouseDown(event: MouseEvent): void {
    const intersects = this.interactionService.handleMouseDown(
      event,
      this.rendererContainer,
    );

    for (const intersect of intersects) {
      let currentObj: THREE.Object3D | null = intersect.object;
      // Traverse parent hierarchy to find bounding box
      while (currentObj) {
        const boundingBox = this.boundingBoxes.find((bb) => bb === currentObj);
        if (boundingBox) {
          this.selectBoundingBox(boundingBox);
          this.isBoundingBoxSelected = true;
          this.selectedBoundingBox = boundingBox;
          return;
        }
        currentObj = currentObj.parent ?? null;
      }
    }
  }

  private handleMouseWheel(event: WheelEvent): void {
    const zoomSpeed = 0.5;
    this.sceneService.camera.position.z += event.deltaY * zoomSpeed * 0.01;
    this.sceneService.camera.position.z = THREE.MathUtils.clamp(
      this.sceneService.camera.position.z,
      2,
      20,
    );
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.sceneService.render();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.objModel) return;
    switch (event.key.toLowerCase()) {
      case 't':
        this.controlsService.setTransformMode(this.objModel, 'translate');
        break;
      case 'r':
        this.controlsService.setTransformMode(this.objModel, 'rotate');
        break;
      case 's':
        this.controlsService.setTransformMode(this.objModel, 'scale');
        break;
      case 'q':
        this.controlsService.hideTransformHelpers();
        break;
      case 'w':
        this.controlsService.showTransformHelperForModel(this.objModel);
        break;
    }
  }

  updateTransformMode(mode: 'translate' | 'rotate' | 'scale'): void {
    this.controlsService.setTransformMode(
      this.selectedBoundingBox as THREE.Object3D,
      mode,
    );
  }

  private loadOBJModel(url: string): void {
    this.modelLoader
      .loadOBJModel(url)
      .then((object) => {
        this.objModel = object;
        this.transformObj =
          this.controlsService.createTransformControls(object);

        this.setupTransformControls();
      })
      .catch((error) => {
        console.error('Error loading OBJ model:', error);
      });
  }

  private setupTransformControls(): void {
    this.transformObj.addEventListener('mouseDown', () => {
      this.controlsService.disableOrbitControls();
    });

    this.transformObj.addEventListener('mouseUp', () => {
      this.controlsService.enableOrbitControls();
    });
  }

  addBoundingBox(): void {
    const boundingBox = this.sceneService.createBoundingBox();
    this.boundingBoxes.push(boundingBox);
    this.sceneService.addObjectToScene(boundingBox);
    this.controlsService.createTransformControls(boundingBox);
  }

  private selectBoundingBox(boundingBox: THREE.Object3D): void {
    this.controlsService.selectBoundingBox(boundingBox);
    this.isBoundingBoxSelected = true;
  }

  private deselectBoundingBox(): void {
    this.controlsService.deselectBoundingBox();
    this.isBoundingBoxSelected = false;
  }

  private loadModelFiles(files: string[]): void {
    const modelType = '3d';
    this.nexusObjectGroup = new THREE.Group();

    if (modelType === CANVAS_MODEL_TYPES.THREE_D_POINT_CLOUD) {
      this.loadPointCloud(files);
    } else {
      this.loadNexusModels(files);
    }

    this.sceneService.addObjectToScene(this.nexusObjectGroup);
  }

  private loadPointCloud(files: string[]): void {
    const potreeDataUrls = this.potreeService.labelUrl(files);
    this.potreeService.loadData(potreeDataUrls).then((pco) => {
      this.sceneService.addObjectToScene(pco);
      this.nexusObjectGroup.add(pco);
      this.centerObject(true);
    });
  }

  private loadNexusModels(files: string[]): void {
    let loadedObjects: THREE.Object3D[] = [];

    files.forEach((file) => {
      // @ts-ignore - NexusObject implementation
      new NexusObject(
        file,
        (o: THREE.Object3D) => {
          const bbox = new THREE.Box3().setFromObject(o);
          const center = bbox.getCenter(new THREE.Vector3());
          o.position.sub(center);
          loadedObjects.push(o);

          if (loadedObjects.length === files.length) {
            loadedObjects.forEach((obj) => this.nexusObjectGroup.add(obj));
            this.centerObject();
          }
        },
        () => {},
        this.cameraScene.renderer,
        false,
      );
    });
  }

  private centerObject(isPcoLoad: boolean = false): void {
    this.sceneService.centerObject(
      this.nexusObjectGroup,
      ModelConfig.centerObjZoomFactor,
      isPcoLoad,
    );
  }

  // Load the scripts requried
  loadScripts() {
    //@ts-ignore
    window['THREE'] = THREE;
    this.scriptLoaderService.loadScripts(
      this.externalJSFiles,
      (loadedScripts: any) => {
        this.loadedScriptRef = loadedScripts;
        this.initScene();
        this.controls.update();
        this.animate();
      },
    );
  }
}
