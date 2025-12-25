import { Injectable, signal } from '@angular/core'
import { User } from '../models/user.model'

const USER_STORAGE_KEY = 'auth.user'
const ACCESS_TOKEN_KEY = 'auth.accessToken'
const REFRESH_TOKEN_KEY = 'auth.refreshToken'

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _user = signal<User | null>(null)
  private readonly _accessToken = signal<string | null>(null)
  private readonly _refreshToken = signal<string | null>(null)

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const rawUser = localStorage.getItem(USER_STORAGE_KEY)
      if (rawUser) this._user.set(JSON.parse(rawUser))

      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (accessToken) this._accessToken.set(accessToken)

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (refreshToken) this._refreshToken.set(refreshToken)
    } catch {
      /* ignore */
    }
  }

  user = this._user.asReadonly()
  accessToken = this._accessToken.asReadonly()
  refreshToken = this._refreshToken.asReadonly()

  setUser(user: User | null): void {
    this._user.set(user)
    try {
      if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(USER_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  setAccessToken(token: string | null): void {
    this._accessToken.set(token)
    try {
      if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token)
      else localStorage.removeItem(ACCESS_TOKEN_KEY)
    } catch {
      /* ignore */
    }
  }

  setRefreshToken(token: string | null): void {
    this._refreshToken.set(token)
    try {
      if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token)
      else localStorage.removeItem(REFRESH_TOKEN_KEY)
    } catch {
      /* ignore */
    }
  }

  setTokens(accessToken: string | null, refreshToken: string | null): void {
    this.setAccessToken(accessToken)
    this.setRefreshToken(refreshToken)
  }

  clear(): void {
    this.setUser(null)
    this.setTokens(null, null)
  }

  isAuthenticated(): boolean {
    return !!this._user() && !!this._accessToken()
  }

  getAccessToken(): string | null {
    return this._accessToken()
  }

  getRefreshToken(): string | null {
    return this._refreshToken()
  }
}
