import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { filter, tap } from 'rxjs';
import { AddJwtBearer } from '../store/auth/auth.actions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const accessToken = this.store.selectSnapshot(AuthState.accessToken);
    const jwtToken = this.store.selectSnapshot(AuthState.jwtToken);

    if (req.url.includes('twitch') && accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': environment.oauth.appId,
        },
      });
    } else if (!req.url.includes('twitch') && jwtToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
          'Client-Id': environment.oauth.appId,
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
