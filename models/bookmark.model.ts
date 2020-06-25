import { Tag } from './tag.model';

export interface Bookmark {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  type: string;
  url: string;
  user_id: string;
  tags: Tag[];
}
