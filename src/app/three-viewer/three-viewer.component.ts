import * as THREE from 'three';
import { CommonModule } from '@angular/common';
import { ControlsService } from '../services/controls.service';
import { SceneService } from '../services/camera-scene.service';
import { PotreeViewer } from '../services/potree-viewer.service';
import { ModelLoaderService } from '../services/model-loader.service';
import { InteractionService } from '../services/interaction.service';
import { ScriptLoaderService } from '../services/script-loader.service';
import { BOUNDING_BOX_SIZE, CANVAS_MODEL_TYPES, MODEL_URL, ModelConfig, OBJMODELSDATA } from '../constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ChangeDetectorRef,
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

  private readonly boundingBoxes: THREE.LineSegments[] = [];
  private selectedBoundingBox: THREE.LineSegments | null = null;
  private nexusObjectGroup!: THREE.Group;
  private controls!: OrbitControls;
  private animationId!: number;
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  public isBoundingBoxSelected: boolean = false;
  loadedScriptRef: any[] = [];
  externalJSFiles: string[] = ['js/nexus/nexus.js', 'js/nexus/nexus_three.js'];
  isAddingCube: boolean = false;
  isAddingModel: boolean = false;
  selectedModel: any = null;
  objModelsData = OBJMODELSDATA;

  constructor(
    private readonly ngZone: NgZone,
    private readonly sceneService: SceneService,
    private readonly controlsService: ControlsService,
    private readonly modelLoader: ModelLoaderService,
    private readonly interactionService: InteractionService,
    private readonly potreeService: PotreeViewer,
    private readonly scriptLoaderService: ScriptLoaderService,
    private readonly cameraScene: SceneService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.loadScripts();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.sceneService.handleResize(this.rendererContainer));
    this.scriptLoaderService.unloadScripts(this.loadedScriptRef);
    cancelAnimationFrame(this.animationId);
    this.controlsService.disposeAllControls();
  }

  private initScene(): void {
    this.sceneService.initializeScene(this.rendererContainer);
    this.controls = this.controlsService.initializeOrbitControls();
    this.setupEventListeners();
    this.loadModelFiles([MODEL_URL])
    this.animate();
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
      this.interactionService.handleMouseWheel(event),
    );
    container.addEventListener('dblclick', (event: MouseEvent) =>
      this.handleDoubleClick(event)
    );

    window.addEventListener('resize', () => this.sceneService.handleResize(this.rendererContainer));
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

  private handleDoubleClick(event: MouseEvent): void {
    if (this.isAddingCube || this.isAddingModel) {
      const intersectionPoint = this.get3dPosition(event)
      if (intersectionPoint) {
        this.addObjectToScene(intersectionPoint);
      }
    } else {
      this.isBoundingBoxSelected = false;
      this.controlsService.deselectBoundingBox();
      this.cdr.detectChanges();
    }
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.sceneService.render();
  }

  updateTransformMode(mode: 'translate' | 'rotate' | 'scale'): void {
    this.controlsService.setTransformMode(
      this.selectedBoundingBox as THREE.Object3D,
      mode,
    );
  }

  addObjectToScene(position: THREE.Vector3): void {
    let geometry = BOUNDING_BOX_SIZE
    if (this.isAddingModel && this.selectedModel) geometry = this.selectedModel?.geometry
    const boundingBox = this.controlsService.createBoundingBox(position, geometry);
    this.boundingBoxes.push(boundingBox);
    this.sceneService.addObjectToScene(boundingBox);
    this.controlsService.createTransformControls(boundingBox);
    if (this.isAddingModel && this.selectedModel) {
      this.modelLoader.loadOBJModel(this.selectedModel?.path, boundingBox)
      this.selectedModel = null
      this.isAddingModel = false
      this.cdr.detectChanges();
    }
  }

  toogleAddButton(): void {
    this.isAddingModel = false
    this.isAddingCube = !this.isAddingCube
    this.selectedModel = null
  }

  onModelSelect(event: Event) {
    this.isAddingCube = false
    this.isAddingModel = true
    const selectedName = (event.target as HTMLSelectElement).value;
    this.selectedModel = this.objModelsData.find(model => model?.name === selectedName) || null;
  }

  private selectBoundingBox(boundingBox: THREE.Object3D): void {
    this.isBoundingBoxSelected = true;
    this.controlsService.selectBoundingBox(boundingBox);
    this.cdr.detectChanges();
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
      //@ts-ignore
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
        () => { },
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

  get3dPosition(event: MouseEvent): THREE.Vector3 | false {
    const canvas = this.sceneService.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.sceneService.camera);
    const intersects = this.raycaster.intersectObjects(this.nexusObjectGroup.children, true);

    if (intersects.length === 0) {
      return false;
    }

    return intersects[0].point;
  }
}
