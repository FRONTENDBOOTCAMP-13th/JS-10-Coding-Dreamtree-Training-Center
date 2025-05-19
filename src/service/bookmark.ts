import { isAuthenticated } from './auth';
import type { Bookmark } from '../types/bookmark.type';

// 북마크 데이터를 로컬스토리지에서 가져오는 함수
function getBookmarks(): Bookmark[] {
  const bookmarks = localStorage.getItem('bookmarks');
  return bookmarks ? JSON.parse(bookmarks) : [];
}

// 북마크 데이터를 로컬스토리지에 저장하는 함수
function setBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// 현재 로그인한 사용자의 이메일을 가져오는 함수
function getCurrentUserEmail(): string | null {
  return localStorage.getItem('loginUser');
}

// 특정 리소스가 북마크되어 있는지 확인하는 함수
export function isBookmarked(resourceId: number): boolean {
  if (!isAuthenticated()) return false;

  const bookmarks = getBookmarks();
  const userEmail = getCurrentUserEmail();

  return bookmarks.some(
    (bookmark) => bookmark.userId === userEmail && bookmark.resourceId === resourceId,
  );
}

// 북마크 추가하는 함수
export function addBookmark(resourceId: number): boolean {
  if (!isAuthenticated()) return false;

  const bookmarks = getBookmarks();
  const userEmail = getCurrentUserEmail();

  if (!userEmail) return false;

  // 이미 북마크되어 있는지 확인
  if (isBookmarked(resourceId)) return false;

  const newBookmark: Bookmark = {
    id: crypto.randomUUID(),
    userId: userEmail,
    resourceId,
    createdAt: new Date().toISOString(),
  };

  bookmarks.push(newBookmark);
  setBookmarks(bookmarks);
  return true;
}

// 북마크를 제거하는 함수
export function removeBookmark(resourceId: number): boolean {
  if (!isAuthenticated()) return false;

  const bookmarks = getBookmarks();
  const userEmail = getCurrentUserEmail();

  if (!userEmail) return false;

  const filteredBookmarks = bookmarks.filter(
    (bookmark) => !(bookmark.userId === userEmail && bookmark.resourceId === resourceId),
  );

  setBookmarks(filteredBookmarks);
  return true;
}

// 사용자의 북마크 목록을 가져오는 함수
export function getUserBookmarks(): Bookmark[] {
  if (!isAuthenticated()) return [];

  const bookmarks = getBookmarks();
  const userEmail = getCurrentUserEmail();

  if (!userEmail) return [];

  return bookmarks.filter((bookmark) => bookmark.userId === userEmail);
}
