export interface Bookmark {
  id: string; // 북마크 고유 ID
  userId: string; // 북마크한 사용자 ID
  resourceId: number; // 리소스 ID
  createdAt: string; // 북마크 생성 시간
}

export interface BookmarkResource extends Bookmark {
  resource: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    tags: string[];
    dateAdded: string;
    resourceUrl: string;
    author: string;
  };
}
