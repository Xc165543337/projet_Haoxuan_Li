import { PollutionDeclaration } from '../models/pollution.model'

export class AddBookmark {
  static readonly type = '[Bookmark] Add Bookmark'
  constructor(public pollution: PollutionDeclaration) {}
}

export class RemoveBookmark {
  static readonly type = '[Bookmark] Remove Bookmark'
  constructor(public pollutionId: number) {}
}

export class ClearBookmarks {
  static readonly type = '[Bookmark] Clear All Bookmarks'
}
