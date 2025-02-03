import { Injectable } from '@angular/core';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private assetUrlPipe = new AssetUrlPipe();

  loadScripts(files: string[], callback: Function): void {
    const loadedScripts: any[] = [];

    files.forEach((file, index) => {
      const script = document.createElement('script');
      script.src = this.assetUrlPipe.transform(file);
      script.onload = () => {
        loadedScripts.push(script);
        if (loadedScripts.length === files.length) {
          callback(loadedScripts);
        }
      };
      document.body.appendChild(script);
    });
  }

  unloadScripts(loadedScripts: any[]): void {
    loadedScripts.forEach((script) => {
      document.body.removeChild(script);
    });
  }
}
