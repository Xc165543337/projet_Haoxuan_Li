import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import {
  PollutionDeclaration,
  PollutionStats,
  POLLUTION_LEVELS,
  POLLUTION_TYPES,
} from '../models/pollution.model'
import { PollutionService } from '../services/pollution.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-recap.component.html',
  styleUrls: ['./pollution-recap.component.less'],
})
export class PollutionRecapComponent implements OnInit {
  private readonly pollutionService = inject(PollutionService)
  private readonly toastService = inject(ToastService)

  pollutions: PollutionDeclaration[] = []
  stats: PollutionStats = {
    totalDeclarations: 0,
    declarationsByType: {
      Plastique: 0,
      Chimique: 0,
      'Dépôt sauvage': 0,
      Eau: 0,
      Air: 0,
      Autre: 0,
    },
    declarationsBySeverity: {
      Faible: 0,
      Moyen: 0,
      Élevé: 0,
    },
  }
  pollutionLevel = [...POLLUTION_LEVELS]
  pollutionType = [...POLLUTION_TYPES]

  ngOnInit(): void {
    this.loadPollutions()
  }

  loadPollutions(): void {
    this.pollutionService.getAll().subscribe({
      next: data => {
        this.pollutions = data
        this.calculateStats()
      },
      error: error => {
        this.toastService.show('Erreur lors du chargement', 'error')
        console.error('Error loading pollutions:', error)
      },
    })
  }

  calculateStats(): void {
    this.stats.totalDeclarations = this.pollutions.length
    this.stats.declarationsBySeverity = {
      Faible: this.pollutions.filter(p => p.niveau === 'Faible').length,
      Moyen: this.pollutions.filter(p => p.niveau === 'Moyen').length,
      Élevé: this.pollutions.filter(p => p.niveau === 'Élevé').length,
    }
    this.stats.declarationsByType = {
      Plastique: this.pollutions.filter(p => p.type === 'Plastique').length,
      Chimique: this.pollutions.filter(p => p.type === 'Chimique').length,
      'Dépôt sauvage': this.pollutions.filter(p => p.type === 'Dépôt sauvage').length,
      Eau: this.pollutions.filter(p => p.type === 'Eau').length,
      Air: this.pollutions.filter(p => p.type === 'Air').length,
      Autre: this.pollutions.filter(p => p.type === 'Autre').length,
    }
  }
}
