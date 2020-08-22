import { Tag } from './tag.model';

export interface Bookmark {
  id: string;
  title: string;
  description: string;
  image: string | null;
  /* author: string; */
  type: string | null;
  url: string;
  canonicalUrl: string;
  followsRedirect: boolean;
  user_id: string;
  contentInMarkdown: string;
  tags?: Tag[];
}
