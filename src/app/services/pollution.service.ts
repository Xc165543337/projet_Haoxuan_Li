import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, catchError, throwError } from 'rxjs'
import { environment } from '../../environments/environment'
import { PollutionDeclaration } from '../models/pollution.model'

export interface PollutionWithId extends PollutionDeclaration {
  id: number
}

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private readonly http = inject(HttpClient)
  // Backend route mounted at /api/pollution (singular) not /api/pollutions
  private readonly baseUrl = `${environment.apiBaseUrl}/pollution`

  getAll(type?: string): Observable<PollutionWithId[]> {
    const url = type ? `${this.baseUrl}?type=${encodeURIComponent(type)}` : this.baseUrl
    try {
      // eslint-disable-next-line no-console
      console.debug('[PollutionService] GET', url)
    } catch {
      /* ignore */
    }
    return this.http.get<PollutionWithId[]>(url).pipe(catchError(err => this.mapError(err)))
  }

  getById(id: number): Observable<PollutionWithId> {
    const url = `${this.baseUrl}/${id}`
    try {
      // eslint-disable-next-line no-console
      console.log('[PollutionService] GET', url)
    } catch {
      /* ignore */
    }
    return this.http.get<PollutionWithId>(url).pipe(catchError(err => this.mapError(err)))
  }

  create(payload: PollutionDeclaration): Observable<PollutionWithId> {
    return this.http
      .post<PollutionWithId>(this.baseUrl, payload)
      .pipe(catchError(err => this.mapError(err)))
  }

  // alias used by some components in the project
  add(payload: PollutionDeclaration): Observable<PollutionWithId> {
    return this.create(payload)
  }

  update(id: number, payload: PollutionDeclaration): Observable<PollutionWithId> {
    return this.http
      .put<PollutionWithId>(`${this.baseUrl}/${id}`, payload)
      .pipe(catchError(err => this.mapError(err)))
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(err => this.mapError(err)))
  }

  private mapError(err: unknown) {
    const anyErr = err as { error?: { message?: string } }
    const message = anyErr?.error?.message || 'Erreur API pollution'
    return throwError(() => ({ ...(anyErr as object), friendlyMessage: message }))
  }
}
