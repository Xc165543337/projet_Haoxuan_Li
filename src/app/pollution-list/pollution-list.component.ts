import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Store } from '@ngxs/store'
import { POLLUTION_LEVELS, POLLUTION_TYPES, PollutionDeclaration } from '../models/pollution.model'
import { PollutionService } from '../services/pollution.service'
import { ToastService } from '../services/toast.service'
import { AddBookmark, RemoveBookmark } from '../store/bookmark.actions'
import { BookmarkState } from '../store/bookmark.state'

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pollution-list.component.html',
  styleUrls: ['./pollution-list.component.less'],
})
export class PollutionListComponent implements OnInit {
  private readonly pollutionService = inject(PollutionService)
  private readonly toastService = inject(ToastService)
  private readonly store = inject(Store)

  pollutions: PollutionDeclaration[] = []
  filteredPollutions: PollutionDeclaration[] = []

  // Filter properties
  searchText = ''
  selectedType = ''
  selectedLevel = ''
  dateFrom = ''
  dateTo = ''

  pollutionTypes = [...POLLUTION_TYPES]
  pollutionLevels = [...POLLUTION_LEVELS]

  ngOnInit(): void {
    this.loadPollutions()
  }

  isBookmarked(pollutionId: number): boolean {
    return this.store.selectSnapshot(BookmarkState.isBookmarked)(pollutionId)
  }

  toggleBookmark(pollution: PollutionDeclaration, event: Event): void {
    event.stopPropagation()
    event.preventDefault()

    if (this.isBookmarked(pollution.id)) {
      this.store.dispatch(new RemoveBookmark(pollution.id))
      this.toastService.show('Retiré des favoris', 'info')
    } else {
      this.store.dispatch(new AddBookmark(pollution))
      this.toastService.show('Ajouté aux favoris', 'success')
    }
  }

  loadPollutions(): void {
    this.pollutionService.getAll().subscribe({
      next: data => {
        this.pollutions = data
        this.filteredPollutions = data
      },
      error: error => {
        this.toastService.show('Erreur lors du chargement des pollutions', 'error')
        console.error('Error loading pollutions:', error)
      },
    })
  }

  applyFilters(): void {
    this.filteredPollutions = this.pollutions.filter(pollution => {
      // Text search
      const matchesSearch =
        !this.searchText ||
        pollution.titre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        pollution.lieu.toLowerCase().includes(this.searchText.toLowerCase())

      // Type filter
      const matchesType = !this.selectedType || pollution.type === this.selectedType

      // Level filter
      const matchesLevel = !this.selectedLevel || pollution.niveau === this.selectedLevel

      // Date range filter
      const pollutionDate = new Date(pollution.dateObservation)
      const matchesDateFrom = !this.dateFrom || pollutionDate >= new Date(this.dateFrom)
      const matchesDateTo = !this.dateTo || pollutionDate <= new Date(this.dateTo)

      return matchesSearch && matchesType && matchesLevel && matchesDateFrom && matchesDateTo
    })
  }

  deletePollution(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.pollutionService.delete(id).subscribe({
        next: () => {
          this.toastService.show('Pollution supprimée avec succès', 'success')
          this.loadPollutions()
        },
        error: error => {
          this.toastService.show('Erreur lors de la suppression', 'error')
          console.error('Error deleting pollution:', error)
        },
      })
    }
  }
}
