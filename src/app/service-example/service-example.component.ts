import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-example.component.html',
})
export class ServiceExampleComponent implements OnInit {
  posts: any[] = [];

  constructor() {}

  ngOnInit() {
  }
}
