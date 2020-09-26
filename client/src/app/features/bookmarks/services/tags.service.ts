import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tag } from '@models/tag.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TagsService {
  constructor(private http: HttpClient) {}

  fetchAll() {
    return this.http
      .get<{ tags: Tag[] }>('/api/tags')
      .pipe(map(resp => resp.tags));
  }

  saveTags(tags: string[]) {
    return this.http.post<{ tags: Tag[] }>('/api/tags', {
      tags,
    });
  }
}
