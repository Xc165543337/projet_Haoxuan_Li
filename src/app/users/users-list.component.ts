import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { User } from '../models/user.model'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.less',
})
export class UsersListComponent implements OnInit {
  private readonly userService = inject(UserService)

  users = signal<User[]>([])
  loading = signal(true)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.loading.set(true)
    this.error.set(null)

    this.userService.getAll().subscribe({
      next: users => {
        this.users.set(users)
        this.loading.set(false)
      },
      error: err => {
        this.error.set(err?.error?.message || 'Impossible de charger les utilisateurs')
        this.loading.set(false)
      },
    })
  }
}
