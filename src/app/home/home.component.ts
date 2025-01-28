import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  divColor: string = 'red';
  isDivPresent: boolean = true;
  name: string = ""

  toggleColor() {
    this.divColor = this.divColor === 'red' ? 'green' : 'red';
  }
  showDiv() {
    this.isDivPresent = true
  }
  hideDiv() {
    this.isDivPresent = false
  }
}
