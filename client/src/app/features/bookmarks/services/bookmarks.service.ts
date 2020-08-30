import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Bookmark } from '@models/bookmark.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  constructor(private http: HttpClient) {}

  fetchBookmarks(page: number, limit: number) {
    return this.http
      .get<{ bookmarks: Bookmark[] }>('/api/bookmarks')
      .pipe(map(resp => resp.bookmarks));
  }
}
