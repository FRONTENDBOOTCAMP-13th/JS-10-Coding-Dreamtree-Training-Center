import { getUserBookmarks, removeBookmark } from '../service/bookmark';
import { isAuthenticated } from '../service/auth';
import data from '../../src/data/resource.json';
import { type Resource } from '../types/resource.type';
import { createCollectionModal } from './collectionModal';

// 페이지 로드 전에 로그인 체크
if (!isAuthenticated()) {
  alert('로그인 후 이용해주세요.');
  window.location.href = '/src/pages/login.html';
} else {
  // 로그인된 경우에만 페이지 로드 이벤트 리스너 등록
  window.addEventListener('DOMContentLoaded', () => {
    renderBookmarkedResources();
  });
}

/**
 * 북마크된 리소스 정보를 가져오는 함수
 * @returns Promise<Resource[]>
 */
async function getBookmarkedResources(): Promise<Resource[]> {
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
export function createBookmarkArticle(resource: Resource): string {
  return `
    <div class="flex gap-5 flex-col items-start justify-between rounded-xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow md:flex-row md:items-center md:gap-6" data-roll="bookmark article" data-index="${resource.id}">
      <div class="flex flex-col gap-2 flex-1">
        <h3 class="text-xl font-semibold">${resource.title}</h3>
        <p class="text-quokka-gray text-sm line-clamp-2">
          ${resource.description}
        </p>
      </div>
      <div class="flex gap-3">
        <button
          type="button"
          class="text-quokka-blue border-quokka-mint bg-quokka-snow flex justify-between w-fit items-center gap-2.5 rounded-4xl border border-dashed px-4 py-2 text-sm font-semibold hover:bg-quokka-mint/10 hover:border-quokka-mint/80 transition-all duration-200 cursor-pointer"
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
          class="text-quokka-blue border-quokka border-quokka-gray bg-quokka-snow flex justify-between gap-2.5 rounded-4xl border px-4 py-2 text-sm font-semibold hover:bg-quokka-blue/10 hover:border-quokka-blue/80 transition-all duration-200 cursor-pointer"
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
          class="text-quokka-red border-quokka border-quokka-gray bg-quokka-snow flex justify-between gap-2.5 rounded-4xl border px-4 py-2 text-sm font-semibold hover:bg-quokka-red/10 hover:border-quokka-red/80 transition-all duration-200 cursor-pointer"
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
export async function renderBookmarkedResources(): Promise<void> {
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

// 페이지 로드 시 북마크된 리소스 렌더링
window.addEventListener('DOMContentLoaded', renderBookmarkedResources);
