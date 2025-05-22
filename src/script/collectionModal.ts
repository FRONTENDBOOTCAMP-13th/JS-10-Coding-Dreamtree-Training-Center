import type { Bookmark, BookmarkIntoCollection } from '../types/bookmark.type';

/**
 * 컬렉션 모달을 생성하고 관리하는 함수
 * @param resourceId 북마크된 리소스의 ID
 */
export function createCollectionModal(resourceId: string): void {
  // 모달 생성
  const collectionModal = document.createElement('div');
  collectionModal.style.position = 'fixed';
  collectionModal.style.top = '0';
  collectionModal.style.left = '0';
  collectionModal.style.width = '100vw';
  collectionModal.style.height = '100vh';
  collectionModal.style.background = 'rgba(139,109,92,0.80)';
  collectionModal.style.display = 'flex';
  collectionModal.style.alignItems = 'center';
  collectionModal.style.justifyContent = 'center';
  collectionModal.style.zIndex = '9999';

  // 모달 내부 콘텐츠
  const collectionModalContent = document.createElement('div');
  collectionModalContent.style.background = '#fff';
  collectionModalContent.style.padding = '2rem';
  collectionModalContent.style.borderRadius = '1rem';
  collectionModalContent.style.minWidth = '320px';
  collectionModalContent.style.maxWidth = '90vw';
  collectionModalContent.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';

  collectionModal.appendChild(collectionModalContent);

  // 모달 내부 타이틀
  const collectionModalTitle = document.createElement('p');
  collectionModalTitle.textContent = '컬렉션을 선택해주세요.';
  collectionModalTitle.style.marginBottom = '1.5rem';
  collectionModalTitle.style.fontSize = '1.25rem';
  collectionModalTitle.style.fontWeight = '600';
  collectionModalTitle.style.color = '#333';

  collectionModalContent.appendChild(collectionModalTitle);

  // Local Storage 에 저장된 Collection 정보를 가져오기
  const email = localStorage.getItem('loginUser');
  const collectionsObj = JSON.parse(localStorage.getItem('collections') || '{}');
  const userCollections: string[] = email && collectionsObj[email] ? collectionsObj[email] : [];

  // 컬렉션 체크박스 리스트 생성
  const checkboxContainer = document.createElement('div');
  checkboxContainer.style.display = 'flex';
  checkboxContainer.style.flexDirection = 'column';
  checkboxContainer.style.gap = '0.75rem';
  checkboxContainer.style.maxHeight = '300px';
  checkboxContainer.style.overflowY = 'auto';
  checkboxContainer.style.paddingRight = '0.5rem';

  userCollections.forEach((name, idx) => {
    const row = document.createElement('div');
    row.className =
      'flex flex-row items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `selectCollection${idx}`;
    input.value = name;
    input.style.margin = '0';
    input.style.cursor = 'pointer';
    input.style.width = '1.25rem';
    input.style.height = '1.25rem';
    input.style.accentColor = '#8B6D5C';

    const label = document.createElement('label');
    label.setAttribute('for', `selectCollection${idx}`);
    label.textContent = name;
    label.style.cursor = 'pointer';
    label.style.fontSize = '0.95rem';
    label.style.color = '#4A4A4A';

    row.appendChild(input);
    row.appendChild(label);
    checkboxContainer.appendChild(row);
  });

  collectionModalContent.appendChild(checkboxContainer);

  // Local Storage 에 저장된 bookmarks 정보를 가져오기
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  const bookmark = bookmarks.find((b: Bookmark) => String(b.resourceId) === resourceId);

  // 모달창 내부의 input type="checkbox" 를 클릭했을 때, 해당 원본 객체의 'collection' 속성을 초기화하고 체크된 컬렉션 이름을 저장하기
  userCollections.forEach((name, idx) => {
    const input = collectionModalContent.querySelector<HTMLInputElement>(`#selectCollection${idx}`);
    if (!input) return;

    // 체크 상태 유지
    if (bookmark && Array.isArray(bookmark.collection) && bookmark.collection.includes(name)) {
      input.checked = true;
    }

    // 체크박스 변경 시 localStorage에 반영
    input.addEventListener('change', () => {
      // 체크된 컬렉션 이름만 수집
      const checkedCollections: string[] = Array.from(
        collectionModalContent.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'),
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
  collectionModalCloseBtn.style.marginTop = '1.5rem';
  collectionModalCloseBtn.style.width = '100%';
  collectionModalCloseBtn.style.padding = '0.75rem';
  collectionModalCloseBtn.style.borderRadius = '0.75rem';
  collectionModalCloseBtn.style.border = 'none';
  collectionModalCloseBtn.style.background = '#8B6D5C';
  collectionModalCloseBtn.style.color = 'white';
  collectionModalCloseBtn.style.fontWeight = '500';
  collectionModalCloseBtn.style.cursor = 'pointer';
  collectionModalCloseBtn.style.transition = 'background-color 0.2s';
  collectionModalCloseBtn.addEventListener('mouseover', () => {
    collectionModalCloseBtn.style.background = '#7A5D4C';
  });
  collectionModalCloseBtn.addEventListener('mouseout', () => {
    collectionModalCloseBtn.style.background = '#8B6D5C';
  });
  collectionModalCloseBtn.addEventListener('click', () => {
    collectionModal.remove();
  });

  collectionModalContent.appendChild(collectionModalCloseBtn);
  document.body.appendChild(collectionModal);
}
