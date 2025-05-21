import type { BookmarkIntoCollection } from '../types/bookmark.type';
import type { Resource } from '../types/resource.type';
import data from '../data/resource.json';
import { createBookmarkArticle, renderBookmarkedResources } from './bookmarkRendering';
import { createCollectionModal } from './collectionModal';
import { removeBookmark } from '../service/bookmark';

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
      `text-quokka-tan flex w-fit items-center justify-center rounded-4xl bg-white px-3.5 py-2 text-xs font-medium peer-checked:bg-quokka-tan peer-checked:text-white cursor-pointer`,
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

/**
 * 필터링된 결과를 다시 렌더링하여 브라우저에 노출시키는 기능
 * @param filteredBookmarks
 */
function renderFilteredArticles(filteredBookmarks: BookmarkIntoCollection[]): void {
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

  // 북마크 제거 버튼 이벤트 핸들러
  const removeButtons = bookmarkList.querySelectorAll<HTMLButtonElement>(
    'button[data-resource-id]',
  );
  removeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const resourceId = Number(this.getAttribute('data-resource-id'));
      const success = removeBookmark(resourceId);

      if (success) {
        // 북마크 제거 후 페이지 새로고침
        window.location.reload();
      }
    });
  });

  // 방문 버튼 이벤트 핸들러
  const visitButtons = bookmarkList.querySelectorAll<HTMLButtonElement>(
    'button[data-resource-url]',
  );
  visitButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const url = this.getAttribute('data-resource-url');
      if (url) {
        window.open(url, '_blank');
      }
    });
  });

  // 컬렉션 추가 버튼 이벤트 핸들러
  const addCollectionButtons = bookmarkList.querySelectorAll<HTMLButtonElement>(
    '[data-roll="into-collection"]',
  );
  addCollectionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const resourceId = button
        .closest('[data-roll="bookmark article"]')
        ?.getAttribute('data-index');
      if (resourceId) {
        createCollectionModal(resourceId);
      }
    });
  });
}

// 필터링하는 기능
collections?.addEventListener('change', () => {
  // 모든 체크된 컬렉션 이름을 배열로 수집
  const checkeCollections = collections.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"][name="collection"]:checked',
  );
  const checkedCollectionName = Array.from(checkeCollections).map(
    (input) => input.nextElementSibling?.textContent || input.value,
  );

  // 하나 이상 체크된 경우: 해당 컬렉션에 속한 모든 북마크를 필터링
  if (checkedCollectionName.length > 0) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    // 여러 컬렉션 중 하나라도 포함되면 필터링
    const filtered = bookmarks.filter((bookmark: { collection: string | string[] }) => {
      if (Array.isArray(bookmark.collection)) {
        return bookmark.collection.some((col) => checkedCollectionName.includes(col));
      } else {
        return checkedCollectionName.includes(bookmark.collection);
      }
    });

    renderFilteredArticles(filtered);
  } else {
    // 아무것도 체크 안 된 경우 전체 북마크 렌더링
    renderBookmarkedResources();
  }
});
