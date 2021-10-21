import { Component } from '@angular/core';
import { OAuth2Client } from '@byteowls/capacitor-oauth2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'baneverywhere-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  public async login() {
    const result = await OAuth2Client.authenticate(environment.oauth);
    console.log(result);
  }
}
