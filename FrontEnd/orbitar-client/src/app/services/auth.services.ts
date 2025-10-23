import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {

    const initialStatus = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(initialStatus);
  }

  signIn(): void {

    console.log('Signing in...');
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('isLoggedIn', 'true');
    alert('Signed In! (This is a mock sign-in)');
  }

  signOut(): void {

    console.log('Signing out...');
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isLoggedIn');
  }

  checkInitialAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
