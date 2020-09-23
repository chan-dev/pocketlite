import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  constructor(private http: HttpClient) {}

  fetchBookmarks(page: number, limit: number) {
    return this.http
      .get<{ bookmarks: Bookmark[] }>(
        `/api/bookmarks?page=${page}&limit=${limit}`
      )
      .pipe(map(resp => resp.bookmarks));
  }

  saveBookmark(url: string) {
    return this.http
      .post<{ bookmark: Bookmark }>('/api/bookmarks', { url })
      .pipe(map(resp => resp.bookmark));
  }

  searchBookmarks(query: string) {
    return this.http
      .get<{ bookmarks: Bookmark[] }>(`/api/bookmarks/search?q=${query}`)
      .pipe(map(resp => resp.bookmarks));
  }

  deleteBookmark(id: string) {
    return this.http
      .delete<{ id: string }>(`/api/bookmarks/${id}`)
      .pipe(map(resp => resp.id));
  }

  archiveBookmark(id: string) {
    return this.http
      .put<{ bookmark: Bookmark }>(`/api/bookmarks/archive/${id}`, {})
      .pipe(map(resp => resp.bookmark));
  }

  restoreBookmark(id: string) {
    return this.http
      .put<{ bookmark: Bookmark }>(`/api/bookmarks/archive/${id}/restore`, {})
      .pipe(map(resp => resp.bookmark));
  }

  getArchivedBookmarks() {
    return this.http
      .get<{ bookmarks: Bookmark[] }>(`/api/bookmarks/archives`)
      .pipe(map(res => res.bookmarks));
  }

  getBookmarkFavorited() {
    return this.http
      .get<{ favorites: BookmarkFavorite[] }>(`/api/bookmarks/favorited`)
      .pipe(map(res => res.favorites));
  }

  favoriteBookmark(bookmarkId: string) {
    return this.http
      .post<{ favorite: BookmarkFavorite }>(`/api/bookmarks/favorite`, {
        bookmarkId,
      })
      .pipe(map(res => res.favorite));
  }

  unfavoriteBookmark(bookmarkFavoriteId: string) {
    return this.http
      .delete<{ favorite: BookmarkFavorite }>(
        `/api/bookmarks/favorite/${bookmarkFavoriteId}`
      )
      .pipe(map(res => res.favorite));
  }
}
