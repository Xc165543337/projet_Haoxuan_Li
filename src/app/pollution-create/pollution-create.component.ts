import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { PollutionDeclaration } from '../models/pollution.model'
import { PollutionService } from '../services/pollution.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-pollution-create',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, PollutionFormComponent],
  templateUrl: './pollution-create.component.html',
  styleUrls: ['./pollution-create.component.less'],
})
export class PollutionCreateComponent {
  private readonly pollutionService = inject(PollutionService)
  private readonly toastService = inject(ToastService)
  private readonly router = inject(Router)

  newPollution: PollutionDeclaration = {
    id: 0,
    titre: '',
    type: 'Air',
    description: '',
    dateObservation: new Date().toISOString().split('T')[0],
    lieu: '',
    niveau: 'Faible',
    latitude: 0,
    longitude: 0,
  }

  onSave(pollution: PollutionDeclaration): void {
    this.pollutionService.create(pollution).subscribe({
      next: () => {
        this.toastService.show('Pollution créée avec succès', 'success')
        this.router.navigate(['/pollutions/list'])
      },
      error: error => {
        this.toastService.show('Erreur lors de la création', 'error')
        console.error('Error creating pollution:', error)
      },
    })
  }

  onCancel(): void {
    this.router.navigate(['/pollutions/list'])
  }
}
