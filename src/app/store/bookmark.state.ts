import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { PollutionDeclaration } from '../models/pollution.model'
import { AddBookmark, ClearBookmarks, RemoveBookmark } from './bookmark.actions'

export interface BookmarkStateModel {
  bookmarks: PollutionDeclaration[]
}

@State<BookmarkStateModel>({
  name: 'bookmarks',
  defaults: {
    bookmarks: [],
  },
})
@Injectable()
export class BookmarkState {
  @Selector()
  static bookmarks(state: BookmarkStateModel): PollutionDeclaration[] {
    return state.bookmarks
  }

  @Selector()
  static bookmarkCount(state: BookmarkStateModel): number {
    return state.bookmarks.length
  }

  @Selector()
  static isBookmarked(state: BookmarkStateModel) {
    return (pollutionId: number): boolean => {
      return state.bookmarks.some(p => p.id === pollutionId)
    }
  }

  @Action(AddBookmark)
  addBookmark(ctx: StateContext<BookmarkStateModel>, action: AddBookmark) {
    const state = ctx.getState()
    // Check if already bookmarked
    if (!state.bookmarks.some(p => p.id === action.pollution.id)) {
      ctx.patchState({
        bookmarks: [...state.bookmarks, action.pollution],
      })
    }
  }

  @Action(RemoveBookmark)
  removeBookmark(ctx: StateContext<BookmarkStateModel>, action: RemoveBookmark) {
    const state = ctx.getState()
    ctx.patchState({
      bookmarks: state.bookmarks.filter(p => p.id !== action.pollutionId),
    })
  }

  @Action(ClearBookmarks)
  clearBookmarks(ctx: StateContext<BookmarkStateModel>) {
    ctx.patchState({
      bookmarks: [],
    })
  }
}
