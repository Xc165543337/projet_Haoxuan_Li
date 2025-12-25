import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin'
import { provideStore } from '@ngxs/store'
import { jwtInterceptor } from './interceptors/jwt.interceptor'
import { AuthState } from './store/auth.state'
import { BookmarkState } from './store/bookmark.state'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Register HttpClient with JWT interceptor
    provideHttpClient(withInterceptors([jwtInterceptor])),
    // Configure NGXS store with AuthState and BookmarkState, with storage plugin for persistence
    provideStore(
      [AuthState, BookmarkState],
      withNgxsStoragePlugin({
        keys: ['auth', 'bookmarks'], // Persist the auth and bookmarks state
      })
    ),
  ],
}
