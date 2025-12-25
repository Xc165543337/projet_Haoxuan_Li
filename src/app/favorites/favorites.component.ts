import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { PollutionDeclaration } from '../models/pollution.model'
import { ClearBookmarks, RemoveBookmark } from '../store/bookmark.actions'
import { BookmarkState } from '../store/bookmark.state'

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.less'],
})
export class FavoritesComponent implements OnInit {
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  bookmarks$!: Observable<PollutionDeclaration[]>

  ngOnInit(): void {
    this.bookmarks$ = this.store.select(BookmarkState.bookmarks)
  }

  removeBookmark(pollutionId: number): void {
    this.store.dispatch(new RemoveBookmark(pollutionId))
  }

  clearAll(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      this.store.dispatch(new ClearBookmarks())
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/pollutions/detail', id])
  }
}
