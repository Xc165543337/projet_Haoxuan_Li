import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { PollutionDeclaration } from '../models/pollution.model'
import { PollutionService } from '../services/pollution.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-pollution-edit',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, PollutionFormComponent],
  templateUrl: './pollution-edit.component.html',
  styleUrls: ['./pollution-edit.component.less'],
})
export class PollutionEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly pollutionService = inject(PollutionService)
  private readonly toastService = inject(ToastService)

  pollution: PollutionDeclaration | null = null
  loading = true

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) {
      this.loadPollution(id)
    }
  }

  loadPollution(id: number): void {
    this.pollutionService.getById(id).subscribe({
      next: data => {
        this.pollution = data
        this.loading = false
      },
      error: error => {
        this.toastService.show('Erreur lors du chargement', 'error')
        this.loading = false
        console.error('Error loading pollution:', error)
      },
    })
  }

  onSave(pollution: PollutionDeclaration): void {
    this.pollutionService.update(pollution.id, pollution).subscribe({
      next: () => {
        this.toastService.show('Pollution mise à jour avec succès', 'success')
        this.router.navigate(['/pollutions/list'])
      },
      error: error => {
        this.toastService.show('Erreur lors de la mise à jour', 'error')
        console.error('Error updating pollution:', error)
      },
    })
  }

  onCancel(): void {
    this.router.navigate(['/pollutions/list'])
  }
}
