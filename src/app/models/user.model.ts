export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  nomUtilisateur: string
  dateCreation?: string
  dateModification?: string
}

export interface RegisterUser {
  nom: string
  prenom: string
  email: string
  motDePasse: string
  nomUtilisateur: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
}

export interface RefreshTokenResponse {
  accessToken: string
  accessTokenExpiresIn: string
}
