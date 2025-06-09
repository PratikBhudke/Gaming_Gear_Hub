import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, LoginRequest, LoginResponse } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  selectedTabIndex = 0;
  error: string | null = null;
  selectedRole: string = 'USER';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({ email: rememberedEmail });
    }
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    this.selectedRole = index === 0 ? 'USER' : 'ADMIN';
    this.loginForm.reset({
      email: '',
      password: '',
      rememberMe: false
    });
    this.error = null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form values:', this.loginForm.value);
      
      const loginData: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      console.log('Login request:', loginData);

      // Store email if remember me is checked
      if (this.loginForm.get('rememberMe')?.value) {
        localStorage.setItem('rememberedEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      this.authService.login(loginData).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful:', response);
          
          // Store the token
          localStorage.setItem('token', response.token);
          
          // Set user role in local storage
          localStorage.setItem('userRole', response.user.role);
          
          // Show success message
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });

          // Navigate based on role
          if (response.user.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Login error details:', {
            error,
            status: error?.status,
            message: error?.error?.message,
            fullError: error?.error
          });
          
          this.snackBar.open(error?.error?.message || 'Invalid email or password', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
