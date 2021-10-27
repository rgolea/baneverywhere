import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuth2Client } from '@byteowls/capacitor-oauth2';
import { Store } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { AddAccessToken } from '../store/auth/auth.actions';

@Component({
  selector: 'baneverywhere-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  constructor(
    private readonly store: Store,
    private readonly router: Router
  ){}

  public async login() {
    const { access_token }: { access_token: string } =
      await OAuth2Client.authenticate(environment.oauth);
    this.store.dispatch(new AddAccessToken(access_token));
    this.router.navigate(['/admin']);
  }
}
