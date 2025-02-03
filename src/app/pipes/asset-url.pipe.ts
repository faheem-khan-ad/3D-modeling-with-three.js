import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'assetUrl', standalone: true })
export class AssetUrlPipe implements PipeTransform {
  transform(value: string): string {
    const assetUrl = (url: string): string => {
      // @ts-ignore
      const urlPrefix = url.startsWith('/') ? '' : '/';
      return `https://fe-assets-prod.dronos.ai/assets/assets/digital-twin${urlPrefix}${url}`;
    };
    return assetUrl(value);
  }
}
