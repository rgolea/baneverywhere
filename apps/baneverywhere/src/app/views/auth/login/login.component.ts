import { Component } from '@angular/core';
import { OAuth2Client } from '@byteowls/capacitor-oauth2';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'baneverywhere-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private readonly http: HttpClient
  ){}

  public async login() {
    const response = await OAuth2Client.authenticate(environment.oauth);
    const code = response.authorization_response.code;
    const loggedUser = await this.http.get(`http://localhost:3333/auth/twitch/callback?code=${code}`).toPromise();

    console.log('User logged in!', loggedUser);
  }
}
