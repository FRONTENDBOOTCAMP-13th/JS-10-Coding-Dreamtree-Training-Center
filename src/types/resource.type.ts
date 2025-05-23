export interface Resource {
  id: number;
  title: string;
  tags: string[];
  description: string;
  difficulty: string;
  category: string;
  dateAdded: string;
  resourceUrl: string;
  author: string;
  isBookmarked: boolean;
  language: string; // 반드시 포함!
}
