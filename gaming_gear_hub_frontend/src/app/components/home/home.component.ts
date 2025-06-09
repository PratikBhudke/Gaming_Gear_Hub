import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Category {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('categoriesSection') categoriesSection!: ElementRef;

  categories: Category[] = [
    {
      id: 'KEYBOARD',
      name: 'Gaming Keyboards',
      description: 'High-performance mechanical and optical keyboards',
      backgroundImage: 'assets/images/keyboard/keyboard1.jpg'
    },
    {
      id: 'MICE',
      name: 'Gaming Mice',
      description: 'Precision gaming mice with advanced sensors',
      backgroundImage: 'assets/images/mice/mouse1.jpg'
    },
    {
      id: 'HEADSET',
      name: 'Gaming Headsets',
      description: 'Immersive audio with crystal clear communication',
      backgroundImage: 'assets/images/headset/headset1.jpg'
    },
    {
      id: 'MONITOR',
      name: 'Gaming Monitors',
      description: 'High refresh rate displays for competitive gaming',
      backgroundImage: 'assets/images/monitor/monitor1.jpg'
    },
    {
      id: 'CPU',
      name: 'Gaming CPUs',
      description: 'Powerful processors for maximum gaming performance',
      backgroundImage: 'assets/images/cpu/cpu1.jpg'
    },
    {
      id: 'CONTROLLER',
      name: 'Game Controllers',
      description: 'Precision controllers for console-style gaming',
      backgroundImage: 'assets/images/controller/controller1.jpg'
    }
  ];

  constructor(private router: Router) {}

  navigateToCategory(categoryId: string) {
    this.router.navigate(['/category', categoryId]);
  }

  scrollToCategories() {
    if (this.categoriesSection) {
      this.categoriesSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
}
