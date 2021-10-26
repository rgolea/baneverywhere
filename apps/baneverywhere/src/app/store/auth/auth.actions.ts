
export class AddAccessToken {
  static readonly type = '[AUTH] Add Access Token'
  constructor(public access_token: string){}
}

export class AddJwtBearer {
  static readonly type = '[AUTH] AddJwtBearer';
  constructor(public jwtBearer: string) {}
}

export class Logout {
  static readonly type = '[AUTH] Logout'
}
