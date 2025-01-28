import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThreeViewerComponent } from './three-viewer/three-viewer.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, ThreeViewerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dummy-app';
}
