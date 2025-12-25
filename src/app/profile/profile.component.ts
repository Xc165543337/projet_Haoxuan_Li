import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngxs/store'
import { User } from '../models/user.model'
import { ToastService } from '../services/toast.service'
import { UserService } from '../services/user.service'
import { Logout, UpdateProfile } from '../store/auth.actions'
import { AuthState } from '../store/auth.state'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less',
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly store = inject(Store)
  private readonly userService = inject(UserService)
  private readonly toast = inject(ToastService)
  private readonly router = inject(Router)

  user = toSignal(this.store.select(AuthState.user))
  editMode = signal(false)
  loading = signal(false)
  error = signal<string | null>(null)

  form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    nomUtilisateur: ['', [Validators.required, Validators.minLength(3)]],
  })

  ngOnInit(): void {
    const currentUser = this.store.selectSnapshot(AuthState.user)
    if (!currentUser) {
      this.router.navigateByUrl('/login')
      return
    }
    // Initialize form with current user data
    this.form.patchValue({
      nom: currentUser.nom,
      prenom: currentUser.prenom,
      email: currentUser.email,
      nomUtilisateur: currentUser.nomUtilisateur,
    })
  }

  toggleEditMode(): void {
    if (this.editMode()) {
      // Cancel edit - reset form
      const currentUser = this.store.selectSnapshot(AuthState.user)
      if (currentUser) {
        this.form.patchValue({
          nom: currentUser.nom,
          prenom: currentUser.prenom,
          email: currentUser.email,
          nomUtilisateur: currentUser.nomUtilisateur,
        })
      }
    }
    this.editMode.set(!this.editMode())
    this.error.set(null)
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return

    const currentUser = this.store.selectSnapshot(AuthState.user)
    if (!currentUser) return

    this.loading.set(true)
    this.error.set(null)

    const formData = this.form.getRawValue()

    this.userService.update(currentUser.id, formData).subscribe({
      next: (updatedUser: User) => {
        // Update the user in store
        this.store.dispatch(new UpdateProfile(updatedUser))
        this.loading.set(false)
        this.editMode.set(false)
        this.toast.show('Profil mis à jour avec succès', 'success')
      },
      error: err => {
        this.error.set(
          err?.error?.message || 'Échec de la mise à jour du profil. Veuillez réessayer.'
        )
        this.loading.set(false)
      },
    })
  }

  deleteAccount(): void {
    const currentUser = this.store.selectSnapshot(AuthState.user)
    if (!currentUser) return

    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    )
    if (!confirmed) return

    this.loading.set(true)
    this.userService.delete(currentUser.id).subscribe({
      next: () => {
        this.toast.show('Compte supprimé avec succès', 'info')
        this.store.dispatch(new Logout())
        this.router.navigateByUrl('/')
      },
      error: err => {
        this.error.set(err?.error?.message || 'Échec de la suppression du compte.')
        this.loading.set(false)
      },
    })
  }
}
