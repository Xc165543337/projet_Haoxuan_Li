import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { Store } from '@ngxs/store'
import { PollutionDeclaration } from './models/pollution.model'
import { Logout } from './store/auth.actions'
import { AuthState } from './store/auth.state'
import { BookmarkState } from './store/bookmark.state'
import { ToastContainerComponent } from './toast/toast-container.component'

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('TP5 - Déclaration de Pollution')
  showForm = signal(true)
  declaration = signal<PollutionDeclaration | null>(null)
  private readonly router = inject(Router)
  private readonly store = inject(Store)

  // Convert NGXS observables to signals
  user = toSignal(this.store.select(AuthState.user))
  isAuthenticated = toSignal(this.store.select(AuthState.isAuthenticated), { initialValue: false })
  bookmarkCount = toSignal(this.store.select(BookmarkState.bookmarkCount), { initialValue: 0 })

  constructor() {
    // Ensure example data exists for the mock backend (localStorage key used by interceptor)
    try {
      const key = 'mock_pollutions'
      if (!localStorage.getItem(key)) {
        const demo = [
          {
            id: 1,
            titre: 'Déversement d’huile près du ruisseau',
            type: 'Chimique',
            description: 'Taches huileuses visibles sur le courant.',
            dateObservation: '2025-10-20',
            lieu: 'Rivière des Prés',
            latitude: 48.8566,
            longitude: 2.3522,
          },
          {
            id: 2,
            titre: 'Accumulation de plastique sur la plage',
            type: 'Plastique',
            description: 'Sacs et bouteilles le long du rivage.',
            dateObservation: '2025-09-15',
            lieu: 'Plage du Nord',
            latitude: 43.2965,
            longitude: 5.3698,
          },
          {
            id: 3,
            titre: 'Mauvaise odeur industrielle',
            type: 'Air',
            description: 'Forte odeur chimique près de l’usine.',
            dateObservation: '2025-10-01',
            lieu: 'Zone Industrielle',
            latitude: 45.764,
            longitude: 4.8357,
          },
        ]
        localStorage.setItem(key, JSON.stringify(demo))
      }
    } catch {
      // ignore localStorage errors
    }
  }

  onFormSubmitted(declaration: PollutionDeclaration): void {
    this.declaration.set(declaration)
    this.showForm.set(false)
  }

  resetForm(): void {
    this.declaration.set(null)
    this.showForm.set(true)
  }

  logout(): void {
    this.store.dispatch(new Logout())
    void this.router.navigateByUrl('/login')
  }
}
