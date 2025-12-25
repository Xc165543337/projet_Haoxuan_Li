import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngxs/store'
import { ClearError, Login } from '../store/auth.actions'
import { AuthState } from '../store/auth.state'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  form = this.fb.nonNullable.group({
    identifiant: ['', [Validators.required]], // email or nomUtilisateur
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
  })

  // Convert store selectors to signals
  loading = toSignal(this.store.select(AuthState.loading), { initialValue: false })
  error = toSignal(this.store.select(AuthState.error), { initialValue: null })

  ngOnInit(): void {
    // Clear any previous errors when component initializes
    this.store.dispatch(new ClearError())
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return

    const { identifiant, motDePasse } = this.form.getRawValue()

    // Dispatch login action
    this.store.dispatch(new Login(identifiant, motDePasse)).subscribe({
      next: () => {
        // Check if login was successful
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
