interface AllAuthUser {
  id: number;
  display: string;
  has_usable_password: boolean;
  email: string;
}

interface AllAuthResponse {
  status: number;
}

export interface AllAuthSessionResponse extends AllAuthResponse {
  data: {
    user?: AllAuthUser;
    methods?: any;
    flows?: any;
  };
  meta: {
    is_authenticated: boolean;
  };
}

export interface AllAuthLoginRespones extends AllAuthResponse {
  user?: AllAuthUser;
  methods?: any;
  meta: {
    is_authenticated: boolean;
  };
}
