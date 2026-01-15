import { Injectable, inject } from '@angular/core'
import { Store } from '@ngxs/store'
import { firstValueFrom } from 'rxjs'
import { LoginSuccess } from '../store/auth.actions'
import { AuthService } from './auth.service'

/**
 * Service to initialize authentication state on app startup.
 *
 * Attempts to restore the session using the HttpOnly refresh token cookie.
 * If the cookie is valid, a new access token is obtained and the session is restored.
 */
@Injectable({ providedIn: 'root' })
export class AuthInitService {
  private readonly authService = inject(AuthService)
  private readonly store = inject(Store)

  /**
   * Try to restore the session using the refresh token cookie.
   * Called during app initialization.
   */
  async initializeAuth(): Promise<void> {
    try {
      // Attempt to refresh - if HttpOnly cookie exists and is valid,
      // we'll get a new access token and user data
      const response = await firstValueFrom(this.authService.refreshToken())

      // Restore the session in the store
      this.store.dispatch(
        new LoginSuccess(response.user, response.accessToken, response.accessTokenExpiresIn)
      )
    } catch {
      // No valid refresh token cookie - user needs to log in
      // This is expected for new users or expired sessions
      console.error('No valid session to restore')
    }
  }
}
