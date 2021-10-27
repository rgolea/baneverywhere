import { Component } from '@angular/core';
import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../store/auth/auth.state';

@Component({
  selector: 'baneverywhere-card-profile',
  templateUrl: './card-profile.component.html',
})
export class CardProfileComponent {

  @Select(AuthState.profilePicture) profilePicture$: Observable<string>;
  @Select(AuthState.profile) profile$: Observable<TwitchUserProfile>;

}
