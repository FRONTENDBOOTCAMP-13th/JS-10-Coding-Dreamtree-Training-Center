import { getUserBookmarks, removeBookmark } from '../service/bookmark';
import { isAuthenticated } from '../service/auth';
import data from '../../src/data/resource.json';
import { type Resource } from '../types/type';
import type { Bookmark, BookmarkIntoCollection } from '../types/bookmark.type';

/**
 * 북마크된 리소스 정보를 가져오는 함수
 * @returns Promise<Resource[]>
 */
async function getBookmarkedResources(): Promise<Resource[]> {
  if (!isAuthenticated()) {
    alert('로그인 후 이용해주세요.');
    window.location.href = '/src/pages/login.html';
    return [];
  }

  const bookmarks = getUserBookmarks();
  return data.filter((resource) =>
    bookmarks.some((bookmark) => bookmark.resourceId === resource.id),
  );
}

/**
 * 북마크된 리소스 아티클을 생성하는 함수
 * @param resource Resource
 * @returns string
 */
function createBookmarkArticle(resource: Resource): string {
  return `
    <div class="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4" data-roll="bookmakr article" data-index="${resource.id}">
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-semibold">${resource.title}</h3>
        <p class="text-quokka-gray text-xs font-semibold">
          ${resource.description}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="text-quokka-blue border-quokka-mint bg-quokka-snow flex justify-between w-fit items-center gap-2.5 rounded-4xl border border-dashed px-3 py-1.5 text-xs font-semibold"
          data-roll="into-collection"
        >
          <svg
                width="11"
                height="10"
                viewBox="0 0 11 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="self-center"
                aria-hidden="true"
              >
                <path
                  d="M5.5 1V9M9.5 5L1.5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
          컬렉션에 추가
        </button>
        <button
          type="button"
          class="text-quokka-blue border-quokka border-quokka-gray bg-quokka-snow flex justify-between gap-2.5 rounded-4xl border px-3 py-1.5 text-xs font-semibold"
          data-resource-url="${resource.resourceUrl}"
        >
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="self-center"
          >
            <path
              d="M6.83333 3.16667H2.25C1.55964 3.16667 1 3.72631 1 4.41667V10.25C1 10.9404 1.55964 11.5 2.25 11.5H8.08333C8.77369 11.5 9.33333 10.9404 9.33333 10.25V5.66667M3.5 9L11 1.5M11 1.5L8.08333 1.5M11 1.5V4.41667"
              stroke="#64B5F6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          방문
        </button>
        <button
          type="button"
          class="text-quokka-red border-quokka border-quokka-gray bg-quokka-snow flex justify-between gap-2.5 rounded-4xl border px-3 py-1.5 text-xs font-semibold"
          data-resource-id="${resource.id}"
        >
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="self-center"
          >
            <path
              d="M7.66084 4.80769L7.45105 9.88462M4.54895 9.88462L4.33916 4.80769M10.3804 2.99724C10.5877 3.02638 10.7942 3.05755 11 3.09073M10.3804 2.99724L9.73321 10.8281C9.67856 11.4894 9.08614 12 8.37359 12H3.62641C2.91386 12 2.32144 11.4894 2.26679 10.8281L1.61961 2.99724M10.3804 2.99724C9.68559 2.89958 8.98273 2.82479 8.27273 2.77372M1 3.09073C1.2058 3.05755 1.41235 3.02638 1.61961 2.99724M1.61961 2.99724C2.31441 2.89958 3.01727 2.82479 3.72727 2.77372M8.27273 2.77372V2.25693C8.27273 1.59164 7.72082 1.03623 7.00642 1.01496C6.67226 1.00501 6.33676 1 6 1C5.66324 1 5.32774 1.00501 4.99359 1.01496C4.27918 1.03623 3.72727 1.59164 3.72727 2.25693V2.77372M8.27273 2.77372C7.52276 2.71978 6.76483 2.69231 6 2.69231C5.23517 2.69231 4.47724 2.71978 3.72727 2.77372"
              stroke="#C25048"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          제거
        </button>
      </div>
    </div>
  `;
}

/**
 * 북마크된 리소스들을 렌더링하는 함수
 */
async function renderBookmarkedResources(): Promise<void> {
  const bookmarkList = document.querySelector('[data-roll="allBookmark"]');
  if (!bookmarkList) return;

  const bookmarkedResources = await getBookmarkedResources();

  if (bookmarkedResources.length === 0) {
    bookmarkList.innerHTML = `
      <div class="text-center text-quokka-gray py-10">
        북마크한 리소스가 없습니다.<br/>
        <a href="/src/pages/resource.html" class="mt-4 inline-block px-4 py-2 rounded-2xl border text-sm">
          리소스 둘러보기
        </a>
      </div>
    `;
    return;
  }

  bookmarkList.innerHTML = bookmarkedResources.map(createBookmarkArticle).join('');

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

  /**
   * '컬렉션에 추가' 버튼을 클릭하면 모달이 팝업된다.
   * 모달 창에는 Local Storage 에 저장된 로그인 아이디의 하위 컬렉션 리스트가 나온다.
   * 하위 컬렉션 리스트는 input type="checkbox"로 구현된다.
   * checkbox 를 선택하면 체크된 상태는 유지되며, 유지된 상태로 렌더링한다. (즉, 모달창을 다시 열어도 체크된 상태가 유지된다.)
   * 해당 컬렉션에 체크한 경우, Local Storage 의 Bookmark 에 collection 속성의 값으로 기록한다.
   */
  const addCollectionButtons = bookmarkList.querySelectorAll<HTMLButtonElement>(
    '[data-roll="into-collection"]',
  );
  addCollectionButtons.forEach((button: HTMLButtonElement) => {
    button.addEventListener('click', () => {
      // 모달 생성
      const collectionModal = document.createElement('div');
      collectionModal.style.position = 'fixed';
      collectionModal.style.top = '0';
      collectionModal.style.left = '0';
      collectionModal.style.width = '100vw';
      collectionModal.style.height = '100vh';
      collectionModal.style.background = 'rgba(0,0,0,0.3)';
      collectionModal.style.display = 'flex';
      collectionModal.style.alignItems = 'center';
      collectionModal.style.justifyContent = 'center';
      collectionModal.style.zIndex = '9999';

      // 모달 내부 콘텐츠
      const collectionModalContent = document.createElement('div');
      collectionModalContent.style.background = '#fff';
      collectionModalContent.style.padding = '2rem';
      collectionModalContent.style.borderRadius = '1rem';
      collectionModalContent.style.minWidth = '250px';
      collectionModalContent.style.boxShadow = '0 2px 16px rgba(0,0,0,0.15)';

      collectionModal.appendChild(collectionModalContent);

      // 모달 내부 타이틀
      const collectionModalTitle = document.createElement('p');
      collectionModalTitle.textContent = '컬렉션을 선택해주세요.';
      collectionModalTitle.style.marginBottom = '1rem';
      collectionModalTitle.style.fontSize = '1.2rem';

      collectionModalContent.appendChild(collectionModalTitle);

      // 🅾️ Local Storage 에 저장된 Collection 정보를 가져오기
      const email = localStorage.getItem('loginUser');
      const collectionsObj = JSON.parse(localStorage.getItem('collections') || '{}');
      const userCollections: string[] = email && collectionsObj[email] ? collectionsObj[email] : [];

      // 🅾️ 컬렉션 체크박스 리스트 생성
      userCollections.forEach((name, idx) => {
        const row = document.createElement('div');
        row.className = 'flex flex-row items-center gap-4';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `selectCollection${idx}`;
        input.value = name;
        input.style.margin = '0.5rem 0';
        input.style.cursor = 'pointer';

        const label = document.createElement('label');
        label.setAttribute('for', `selectCollection${idx}`);
        label.textContent = name;

        row.appendChild(input);
        row.appendChild(label);
        collectionModalContent.appendChild(row);
      });

      // Local Storage 에 저장된 bookmarks 정보를 가져오기
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
      const resourceId = button
        .closest('[data-roll="bookmakr article"]')
        ?.getAttribute('data-index');
      const bookmark = bookmarks.find((b: Bookmark) => String(b.resourceId) === resourceId);

      // 모달창 내부의 input type="checkbox" 를 클릭했을 때, 해당 원본 객체의 'collection' 속성을 초기화하고 체크된 컬렉션 이름을 저장하기
      userCollections.forEach((name, idx) => {
        const input = collectionModalContent.querySelector<HTMLInputElement>(
          `#selectCollection${idx}`,
        );
        if (!input) return;

        // 체크 상태 유지
        if (bookmark && Array.isArray(bookmark.collection) && bookmark.collection.includes(name)) {
          input.checked = true;
        }

        // 체크박스 변경 시 localStorage에 반영
        input.addEventListener('change', () => {
          // 체크된 컬렉션 이름만 수집
          const checkedCollections: string[] = Array.from(
            collectionModalContent.querySelectorAll<HTMLInputElement>(
              'input[type="checkbox"]:checked',
            ),
          ).map((input) => input.value);

          // 해당 북마크의 collection 프로퍼티 갱신
          bookmarks.forEach((b: BookmarkIntoCollection) => {
            if (String(b.resourceId) === resourceId) {
              b.collection = checkedCollections;
            }
          });
          localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        });
      });

      // 닫기 버튼
      const collectionModalCloseBtn = document.createElement('button');
      collectionModalCloseBtn.id = 'close-collection-modal';
      collectionModalCloseBtn.textContent = '닫기';
      collectionModalCloseBtn.style.marginTop = '1rem';
      collectionModalCloseBtn.style.width = '100%';
      collectionModalCloseBtn.style.padding = '0.5rem';
      collectionModalCloseBtn.style.borderRadius = '0.5rem';
      collectionModalCloseBtn.style.border = 'none';
      collectionModalCloseBtn.style.background = '#eee';
      collectionModalCloseBtn.style.cursor = 'pointer';
      collectionModalCloseBtn.addEventListener('click', () => {
        collectionModal.remove();
      });

      collectionModalContent.appendChild(collectionModalCloseBtn);
      document.body.appendChild(collectionModal);
    });
  });
}

// 페이지 로드 시 북마크된 리소스 렌더링
window.addEventListener('DOMContentLoaded', renderBookmarkedResources);
