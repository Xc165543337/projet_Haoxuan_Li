import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngxs/store'
import { ClearError, Register } from '../store/auth.actions'
import { AuthState } from '../store/auth.state'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    nomUtilisateur: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{3,50}$/)]],
  })

  // Convert store selectors to signals
  loading = toSignal(this.store.select(AuthState.loading), { initialValue: false })
  error = toSignal(this.store.select(AuthState.error), { initialValue: null })
  submitted = false

  ngOnInit(): void {
    // Clear any previous errors when component initializes
    this.store.dispatch(new ClearError())
  }

  async submit(): Promise<void> {
    this.submitted = true
    if (this.form.invalid) return

    const { nom, prenom, email, motDePasse, nomUtilisateur } = this.form.getRawValue()

    // Dispatch register action
    this.store
      .dispatch(new Register({ nom, prenom, email, motDePasse, nomUtilisateur }))
      .subscribe({
        next: () => {
          // Check if registration was successful
          const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated)
          if (isAuthenticated) {
            this.router.navigateByUrl('/pollutions')
          }
        },
        error: () => {
          // Error is already handled in the state
        },
      })
  }
}
