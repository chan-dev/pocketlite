import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Bookmark } from '@models/bookmark.model';
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
}
