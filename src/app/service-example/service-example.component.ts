import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-example.component.html',
})
export class ServiceExampleComponent implements OnInit {
  posts: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPosts().subscribe((data) => {
      this.posts = data.slice(0, 15); 
    });
  }
}
