export class WebauthnAuthenticationBeginDto {
  username: string;
}

export class WebauthnAuthenticationCompleteDto {
  username: string;
  id: string;
  rawId: string;
  type: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string;
  };
}