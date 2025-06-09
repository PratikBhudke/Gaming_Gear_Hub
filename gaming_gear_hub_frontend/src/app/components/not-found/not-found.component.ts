import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <button mat-raised-button color="primary" routerLink="/">
          Return to Home
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .not-found-content {
      text-align: center;
      padding: 2rem;

      h1 {
        font-size: 6rem;
        color: #1976d2;
        margin: 0;
        line-height: 1;
      }

      h2 {
        font-size: 2rem;
        color: #333;
        margin: 1rem 0;
      }

      p {
        color: #666;
        margin-bottom: 2rem;
      }
    }
  `]
})
export class NotFoundComponent {}
