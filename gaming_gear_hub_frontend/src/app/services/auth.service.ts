import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  address: string;
  phoneNumber: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  address: string;
  phoneNumber: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl + '/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private isBrowser: boolean;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    const savedUser = this.isBrowser ? this.getStoredUser() : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private setStoredUser(user: User | null): void {
    if (!this.isBrowser) return;
    
    try {
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_KEY);
      }
    } catch {
      console.warn('Failed to access localStorage');
    }
  }

  private setStoredToken(token: string | null): void {
    if (!this.isBrowser) return;
    
    try {
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch {
      console.warn('Failed to access localStorage');
    }
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    console.log('Attempting login with:', loginData);
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginData).pipe(
      tap(response => {
        console.log('Login response:', response);
        this.setStoredToken(response.token);
        this.setStoredUser(response.user);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(registerData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/register`, registerData).pipe(
      tap(response => {
        this.setStoredToken(response.token);
        this.setStoredUser(response.user);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_URL}/profile`, profile).pipe(
      tap(updatedProfile => {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updatedProfile };
          this.setStoredUser(updatedUser);
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  logout(): void {
    // Clear auth state
    this.setStoredToken(null);
    this.setStoredUser(null);
    this.currentUserSubject.next(null);

    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }

    // Redirect to home and reload to clear all states
    window.location.href = '/';
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    return this.getCurrentUser()?.id || null;
  }

  updateCurrentUser(user: User): void {
    this.setStoredUser(user);
    this.currentUserSubject.next(user);
  }
}
