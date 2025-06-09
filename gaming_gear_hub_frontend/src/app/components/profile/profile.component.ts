import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule, MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        phoneNumber: currentUser.phoneNumber || ''
      });
    }
  }

  onCancel() {
    // Reset form to original values
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        phoneNumber: currentUser.phoneNumber || ''
      });
      this.profileForm.markAsPristine();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updatedProfile: Partial<UserProfile> = {
        name: this.profileForm.get('name')?.value,
        address: this.profileForm.get('address')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value
      };

      this.authService.updateUserProfile(updatedProfile).subscribe({
        next: (updatedProfile: UserProfile) => {
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully';
          this.profileForm.markAsPristine();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update profile. Please try again.';
          console.error('Profile update error:', error);
        }
      });
    }
  }
}
