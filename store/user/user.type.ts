export type User = {
  id: string;
  //email: string;
  //phone?: string | null;
  name?: string;
  //country?: string;
  //cin?: string;
  //adresse?: string;
  first_name?: string;
  //createdAt?: string; // ou Date
};

export type AuthPayload = {
  user: User;
  token?: string; // si tu utilises JWT/cookie + header côté client
};

export type UserStore = {
  user: User | null;
  token?: string | null;

  // Selectors
  isAuthenticated: () => boolean;

  // Actions
  login: (payload: AuthPayload) => void;      // set user + token
  logout: () => void;                         // clear everything
  setUser: (user: User | null) => void;       // replace
  updateUser: (patch: Partial<User>) => void; // shallow merge
  setToken: (token: string | null) => void;
};