import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceExampleComponent } from './service-example/service-example.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServiceExampleComponent },
  { path: 'feature', loadChildren: () => import('./features/feature/feature.module').then(m => m.FeatureModule) },
  { path: '**', redirectTo: '' }, // Wildcard route for 404
];
