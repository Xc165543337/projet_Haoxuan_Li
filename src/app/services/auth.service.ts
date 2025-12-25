import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { LoginResponse, RefreshTokenResponse, User } from '../models/user.model'
import { AuthStateService } from './auth-state.service'

export type RegisterResponse = LoginResponse

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly state = inject(AuthStateService)
  private readonly baseUrl = `${environment.apiBaseUrl}/users`

  login(identifiant: string, motDePasse: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { identifiant, motDePasse })
  }

  register(payload: {
    nom: string
    prenom: string
    email: string
    motDePasse: string
    nomUtilisateur: string
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, payload)
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.state.getRefreshToken()
    return this.http.post<RefreshTokenResponse>(`${this.baseUrl}/refresh-token`, { refreshToken })
  }

  setSession(user: User, accessToken: string, refreshToken: string): void {
    this.state.setUser(user)
    this.state.setTokens(accessToken, refreshToken)
  }

  updateAccessToken(accessToken: string): void {
    this.state.setAccessToken(accessToken)
  }

  setSessionUser(user: User | null): void {
    this.state.setUser(user)
  }

  logout(): void {
    this.state.clear()
  }

  getAccessToken(): string | null {
    return this.state.getAccessToken()
  }

  getRefreshToken(): string | null {
    return this.state.getRefreshToken()
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated()
  }
}
