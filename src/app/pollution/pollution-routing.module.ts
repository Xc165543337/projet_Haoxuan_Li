import { Routes } from '@angular/router'

export const POLLUTION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../pollution-list/pollution-list.component').then(m => m.PollutionListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../pollution-create/pollution-create.component').then(
        m => m.PollutionCreateComponent
      ),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('../pollution-detail/pollution-detail.component').then(
        m => m.PollutionDetailComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../pollution-edit/pollution-edit.component').then(m => m.PollutionEditComponent),
  },
  {
    path: 'recap',
    loadComponent: () =>
      import('../pollution-recap/pollution-recap.component').then(m => m.PollutionRecapComponent),
  },
]
