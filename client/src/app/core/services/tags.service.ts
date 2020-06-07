import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tag } from '../types/tag';

@Injectable({ providedIn: 'root' })
export class TagsService {
  constructor(private http: HttpClient) {}

  fetchAll() {
    const url = '/api/tags';
    return this.http.get<Tag[]>(url);
  }
}
