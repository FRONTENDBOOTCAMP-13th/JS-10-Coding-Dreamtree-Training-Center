import type { BookmarkIntoCollection } from '../types/bookmark.type';
import type { Resource } from '../types/type';
import data from '../data/resource.json';
import { createBookmarkArticle } from './bookmarkRendering';

/**
 * 이메일 별로 Local Storage 에 저장된 Collections 를 화면에 렌더링하는 함수
 */
function renderCollectionsFromStorage(): void {
  const key = 'collections';
  const email = localStorage.getItem('loginUser');
  const stored = localStorage.getItem(key);
  const collectionsObj = stored ? JSON.parse(stored) : {};
  const userCollections: string[] = email && collectionsObj[email] ? collectionsObj[email] : [];

  collections!.innerHTML = ''; // 기존 컬렉션 초기화

  userCollections.forEach((name, idx) => {
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('name', 'collection');
    newInput.setAttribute('class', `appearance-none peer`);
    newInput.setAttribute('id', `collection${idx + 1}`);

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `collection${idx + 1}`);
    newLabel.setAttribute(
      'class',
      `text-quokka-tan flex w-fit items-center justify-center rounded-4xl bg-white px-3.5 py-2 text-xs font-medium peer-checked:bg-quokka-tan peer-checked:text-white`,
    );
    newLabel.textContent = name;

    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'contents');
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    collections?.appendChild(newDiv);
  });

  // collectionCount를 최신 값으로 맞춤
  collectionCount = userCollections.length + 1;
}

// 페이지 로드 시 컬렉션 렌더링
window.addEventListener('DOMContentLoaded', renderCollectionsFromStorage);

// 컬렉션 생성 버튼 클릭 시, 컬렉션을 생성하는 기능
const newCollectionBtn = document.querySelector('[data-roll="new-collection"]');
const collections = document.querySelector('[data-roll="collections"]');
let collectionCount = 1;

newCollectionBtn?.addEventListener('click', () => {
  // input 생성
  const newInput = document.createElement('input');
  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('name', 'collection');
  newInput.setAttribute('class', `appearance-none peer`);
  newInput.setAttribute('id', `collection${collectionCount}`);

  // label 생성
  const newLabel = document.createElement('label');
  newLabel.setAttribute('for', `collection${collectionCount}`);
  newLabel.setAttribute(
    'class',
    `text-quokka-tan flex w-fit items-center justify-center rounded-4xl bg-white px-3.5 py-2 text-xs font-medium peer-checked:bg-quokka-tan peer-checked:text-white`,
  );

  // 컬렉션 이름을 작성하기 위한 프롬프트 팝업
  const collectionName = prompt('컬렉션 이름을 5자 이내로 적어주세요.');
  if (collectionName !== null) {
    newLabel.textContent = `${collectionName.trim()}`;

    // 사용자 이메일 정보와 일치하는 Local Storage 에 컬렉션을 저장
    const key = 'collections';
    const email = localStorage.getItem('loginUser');
    if (email) {
      const stored = localStorage.getItem(key);
      const collectionsObj = stored ? JSON.parse(stored) : {};
      if (!collectionsObj[email]) collectionsObj[email] = [];
      collectionsObj[email].push(collectionName.trim());
      localStorage.setItem(key, JSON.stringify(collectionsObj));
    }
  } else {
    // 오류시 알람 팝업 후 종료
    alert('잘못 입력하셨습니다.');
    return;
  }

  // 부모-자식 연결
  const newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'contents');

  newDiv.appendChild(newInput);
  newDiv.appendChild(newLabel);
  collections?.appendChild(newDiv);

  // 카운트 증가(id 값)
  collectionCount++;

  // 컬렉션 추가 후, 다시 렌더링
  renderCollectionsFromStorage();
});

// 함수
function renderFilteredArticles(filteredBookmarks: BookmarkIntoCollection[]) {
  const bookmarkList = document.querySelector('[data-roll="allBookmark"]');
  if (!bookmarkList) return;

  // resourceId만 추출
  const filteredResourceIds = filteredBookmarks.map((b) => b.resourceId);

  // resource.json에서 해당 리소스만 추출
  const filteredResources = (data as Resource[]).filter((resource) =>
    filteredResourceIds.includes(resource.id),
  );

  // article 렌더링
  if (filteredResources.length === 0) {
    bookmarkList.innerHTML = `
      <div class="text-center text-quokka-gray py-10">
        해당 컬렉션에 북마크된 리소스가 없습니다.
      </div>
    `;
    return;
  }

  bookmarkList.innerHTML = filteredResources.map(createBookmarkArticle).join('');
}

// 필터링하는 기능
collections?.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;

  // 체크되었을 때 실행하는 내용
  if (target.name === 'collection' && target.checked) {
    // 체크된 컬렉션 이름 e.g. '컬렉션 1'
    const selectedCollection = target.nextElementSibling?.textContent || target.value;

    // bookmarks에서 해당 컬렉션만 필터링
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    // 배열이면 include 로, 문자열이면 === 로 이름과 일치하는지 확인
    const filtered = bookmarks.filter((bookmark: { collection: string | string[] }) => {
      if (Array.isArray(bookmark.collection)) {
        console.log(bookmark.collection.includes(selectedCollection));
        return bookmark.collection.includes(selectedCollection);
      } else {
        console.log(bookmark.collection === selectedCollection);
        return bookmark.collection === selectedCollection;
      }
    });

    // 필터링된 데이터를 화면에서 다시 렌더링하는 기능
    renderFilteredArticles(filtered);
  }
});
