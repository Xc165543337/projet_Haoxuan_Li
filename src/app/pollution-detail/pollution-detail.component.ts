import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PollutionDeclaration } from '../models/pollution.model'
import { PollutionService } from '../services/pollution.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-detail.component.html',
  styleUrls: ['./pollution-detail.component.less'],
})
export class PollutionDetailComponent implements OnInit {
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

  deletePollution(): void {
    if (this.pollution && confirm('Êtes-vous sûr de vouloir supprimer cette déclaration ?')) {
      this.pollutionService.delete(this.pollution.id).subscribe({
        next: () => {
          this.toastService.show('Déclaration supprimée avec succès', 'success')
          this.router.navigate(['/pollutions/list'])
        },
        error: error => {
          this.toastService.show('Erreur lors de la suppression', 'error')
          console.error('Error deleting pollution:', error)
        },
      })
    }
  }
}
