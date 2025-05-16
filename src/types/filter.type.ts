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
}

export interface FilterCriteria {
  category?: string;
  stack?: string;
  difficulty?: string;
  language?: string; // 실제 데이터에 없으면 무시
}
