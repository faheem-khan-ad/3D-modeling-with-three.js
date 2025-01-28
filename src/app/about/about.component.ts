import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { CustomUppercasePipe } from '../pipes/custom-uppercase.pipe';

@Component({
  selector: 'app-about',
  imports: [CommonModule, CustomUppercasePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  currentDate = new Date(); 
  message: string = 'all in lowercase'
}
