import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthStateModel } from '../store/auth/auth.state';
import { filter, tap } from 'rxjs';
import { AddJwtBearer } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const token = this.store.selectSnapshot<string>(
      (state: { auth: AuthStateModel }) => state.auth.jwtBearer
    );
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      filter((event) => event instanceof HttpResponse),
      tap((res: HttpResponse<unknown>) => {
        const jwtToken = res.headers.get('X-Access-Token');
        if (jwtToken) {
          this.store.dispatch(new AddJwtBearer(jwtToken));
        }
      })
    );
  }
}
