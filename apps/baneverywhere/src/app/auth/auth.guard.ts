import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { AuthState } from '../store/auth/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthState.isLoaded).pipe(
      filter(Boolean),
      switchMap(() => this.store.select(AuthState.isAuthenticated)),
      tap(isAuthenticated => {
        if(!isAuthenticated) this.router.navigateByUrl('/auth');
      })
    );
  }
}
