import { HttpInterceptorFn, HttpResponse } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { delay } from 'rxjs/operators'
import { PollutionDeclaration } from '../models/pollution.model'

// Simple in-memory user model for mock API
export interface UserRecord {
  id: number
  nom: string
  prenom: string
  email: string
  nomUtilisateur: string
  dateCreation?: string
  dateModification?: string
  motDePasse?: string
}

const userStore: UserRecord[] = [
  {
    id: 1,
    nom: 'Durand',
    prenom: 'Alice',
    email: 'alice@example.com',
    nomUtilisateur: 'alice_durand',
    dateCreation: '2024-01-01',
    motDePasse: 'password123',
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Bob',
    email: 'bob@example.com',
    nomUtilisateur: 'bob_martin',
    dateCreation: '2024-01-02',
    motDePasse: 'password456',
  },
  {
    id: 3,
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie@example.com',
    nomUtilisateur: 'marie_d',
    dateCreation: '2024-02-15',
    motDePasse: 'password789',
  },
]

let nextUserId = 4

const pollutionStore: PollutionDeclaration[] = [
  {
    id: 1,
    titre: 'Déversement chimique',
    type: 'Chimique',
    description: 'Déversement de produits chimiques dans la rivière',
    dateObservation: '2024-01-15',
    lieu: 'Rivière Seine, Paris',
    niveau: 'Élevé',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: 2,
    titre: 'Pollution plastique',
    type: 'Plastique',
    description: 'Accumulation de déchets plastiques sur la plage',
    dateObservation: '2024-01-20',
    lieu: 'Plage de Nice',
    niveau: 'Moyen',
    latitude: 43.6961,
    longitude: 7.2661,
  },
  {
    id: 3,
    titre: 'Pollution atmosphérique',
    type: 'Air',
    description: "Niveau élevé de particules fines dans l'air",
    dateObservation: '2024-02-01',
    lieu: 'Centre-ville Lyon',
    niveau: 'Faible',
    latitude: 45.764,
    longitude: 4.8357,
  },
]

let nextId = 4

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req

  // Match routes for users
  if (url.includes('/api/users')) {
    // GET all users
    if (method === 'GET' && url === '/api/users') {
      // Return users without passwords - eslint-disable-next-line @typescript-eslint/no-unused-vars
      const safeUsers = userStore.map(({ motDePasse: _motDePasse, ...user }) => user)
      return of(new HttpResponse({ status: 200, body: safeUsers })).pipe(delay(100))
    }

    // GET single user by ID
    const getUserMatch = /\/api\/users\/(\d+)$/.exec(url)
    if (method === 'GET' && getUserMatch) {
      const id = Number.parseInt(getUserMatch[1], 10)
      const user = userStore.find(u => u.id === id)
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { motDePasse: _motDePasse, ...safeUser } = user
        return of(new HttpResponse({ status: 200, body: safeUser })).pipe(delay(100))
      }
      return throwError(() => ({ status: 404, error: 'User not found' }))
    }

    // PUT - Update user
    const putUserMatch = /\/api\/users\/(\d+)$/.exec(url)
    if (method === 'PUT' && putUserMatch) {
      const id = Number.parseInt(putUserMatch[1], 10)
      const idx = userStore.findIndex(u => u.id === id)
      if (idx !== -1) {
        const payload = body as Partial<UserRecord>
        userStore[idx] = {
          ...userStore[idx],
          ...payload,
          id, // Keep original ID
          dateModification: new Date().toISOString().slice(0, 10),
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { motDePasse: _motDePasse, ...safeUser } = userStore[idx]
        return of(new HttpResponse({ status: 200, body: safeUser })).pipe(delay(100))
      }
      return throwError(() => ({ status: 404, error: 'User not found' }))
    }

    // DELETE user
    const deleteUserMatch = /\/api\/users\/(\d+)$/.exec(url)
    if (method === 'DELETE' && deleteUserMatch) {
      const id = Number.parseInt(deleteUserMatch[1], 10)
      const idx = userStore.findIndex(u => u.id === id)
      if (idx !== -1) {
        userStore.splice(idx, 1)
        return of(
          new HttpResponse({ status: 200, body: { message: 'User deleted successfully' } })
        ).pipe(delay(100))
      }
      return throwError(() => ({ status: 404, error: 'User not found' }))
    }

    // POST - Register new user
    if (method === 'POST' && url === '/api/users/register') {
      const payload = body as {
        nom: string
        prenom: string
        email: string
        nomUtilisateur: string
        motDePasse: string
      }
      const created: UserRecord = {
        id: nextUserId++,
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        nomUtilisateur: payload.nomUtilisateur,
        motDePasse: payload.motDePasse,
        dateCreation: new Date().toISOString().slice(0, 10),
      }
      userStore.push(created)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { motDePasse: _motDePasse, ...safeUser } = created
      return of(new HttpResponse({ status: 201, body: safeUser })).pipe(delay(100))
    }

    // POST - Login user
    if (method === 'POST' && url === '/api/users/login') {
      const payload = body as { identifiant: string; motDePasse: string }
      const user = userStore.find(
        u =>
          (u.email === payload.identifiant || u.nomUtilisateur === payload.identifiant) &&
          u.motDePasse === payload.motDePasse
      )
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { motDePasse: _motDePasse, ...safeUser } = user
        return of(new HttpResponse({ status: 200, body: safeUser })).pipe(delay(100))
      }
      return throwError(() => ({
        status: 401,
        error: { message: 'Identifiants incorrects' },
      }))
    }
  }

  // Match routes for pollutions
  if (url.includes('/api/pollutions')) {
    // GET all pollutions
    if (method === 'GET' && url === '/api/pollutions') {
      return of(new HttpResponse({ status: 200, body: pollutionStore })).pipe(delay(100))
    }

    // GET single pollution by ID
    const getMatch = /\/api\/pollutions\/(\d+)$/.exec(url)
    if (method === 'GET' && getMatch) {
      const id = Number.parseInt(getMatch[1], 10)
      const pollution = pollutionStore.find(p => p.id === id)
      if (pollution) {
        return of(new HttpResponse({ status: 200, body: pollution })).pipe(delay(100))
      }
      return throwError(() => ({ status: 404, error: 'Pollution not found' }))
    }

    // POST - Create new pollution
    if (method === 'POST' && url === '/api/pollutions') {
      const payload = body as Omit<PollutionDeclaration, 'id'>
      const created: PollutionDeclaration = {
        ...payload,
        id: nextId++,
      }
      pollutionStore.push(created)
      return of(new HttpResponse({ status: 201, body: created })).pipe(delay(100))
    }

    // PUT - Update pollution
    const putMatch = /\/api\/pollutions\/(\d+)$/.exec(url)
    if (method === 'PUT' && putMatch) {
      const id = Number.parseInt(putMatch[1], 10)
      const idx = pollutionStore.findIndex(p => p.id === id)
      if (idx !== -1) {
        const payload = body as Omit<PollutionDeclaration, 'id'>
        pollutionStore[idx] = {
          ...payload,
          id,
        }
        return of(new HttpResponse({ status: 200, body: pollutionStore[idx] })).pipe(delay(100))
      }
      return throwError(() => ({ status: 404, error: 'Pollution not found' }))
    }

    // DELETE pollution
    const deleteMatch = /\/api\/pollutions\/(\d+)$/.exec(url)
    if (method === 'DELETE' && deleteMatch) {
      const id = Number.parseInt(deleteMatch[1], 10)
      const idx = pollutionStore.findIndex(p => p.id === id)
      if (idx !== -1) {
        pollutionStore.splice(idx, 1)
        return of(new HttpResponse({ status: 204 })).pipe(delay(100))
      }
      return throwError(() => ({ status: 404, error: 'Pollution not found' }))
    }
  }

  // Pass through for all other requests
  return next(req)
}
