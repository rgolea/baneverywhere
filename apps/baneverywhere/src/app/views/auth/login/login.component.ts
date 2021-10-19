import { Component } from '@angular/core';
import { OAuth2Client } from '@byteowls/capacitor-oauth2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'baneverywhere-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public async login() {
    const result = await OAuth2Client.authenticate(environment.oauth);
    console.log(result);
  }
}
