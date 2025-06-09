import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../../services/admin.service';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.id ? 'Edit' : 'Add' }} Product</h2>
    <mat-dialog-content>
      <form #productForm="ngForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="product.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="product.description" name="description" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Price</mat-label>
          <input matInput type="number" [(ngModel)]="product.price" name="price" required min="0">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Stock</mat-label>
          <input matInput type="number" [(ngModel)]="product.stock" name="stock" required min="0">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="product.category" name="category" required>
            <mat-option value="MICE">Mice</mat-option>
            <mat-option value="MONITOR">Monitor</mat-option>
            <mat-option value="CPU">CPU</mat-option>
            <mat-option value="CONTROLLER">Controller</mat-option>
            <mat-option value="KEYBOARD">Keyboard</mat-option>
            <mat-option value="HEADSET">Headset</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput [(ngModel)]="product.imageUrl" name="imageUrl">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!productForm.form.valid">
        {{ data.id ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class ProductFormDialogComponent {
  product: Product;

  constructor(
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.product = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.product);
  }
}
