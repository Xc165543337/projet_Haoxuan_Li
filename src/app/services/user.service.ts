import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = `${environment.apiBaseUrl}/users`

  getAll(q?: string): Observable<User[]> {
    const url = q ? `${this.baseUrl}?q=${encodeURIComponent(q)}` : this.baseUrl
    try {
      // eslint-disable-next-line no-console
      console.debug('[UserService] GET', url)
    } catch {
      /* ignore */
    }
    return this.http.get<User[]>(url)
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`)
  }

  update(id: number, payload: Partial<Omit<User, 'id'>>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, payload)
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
  }
}
