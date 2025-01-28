import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feature',
  imports: [],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {

  constructor(private router: Router){

  }

  backToHome () {
    this.router.navigateByUrl('/')
  }

}
