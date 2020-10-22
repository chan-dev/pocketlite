import { TestBed, async, inject } from '@angular/core/testing';

import { BookmarkMustExistGuard } from './bookmark-must-exist.guard';

describe('BookmarkMustExistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookmarkMustExistGuard]
    });
  });

  it('should ...', inject([BookmarkMustExistGuard], (guard: BookmarkMustExistGuard) => {
    expect(guard).toBeTruthy();
  }));
});
