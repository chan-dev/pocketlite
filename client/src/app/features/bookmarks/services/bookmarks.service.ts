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
}
