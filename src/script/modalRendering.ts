// 컴포넌트 테스트를 위한 파일이며, 실제 렌더링시 사용되지 않습니다.
import { type Resource } from '../types/resource.type';

/**
 * 모달을 열고 리소스 정보를 업데이트하는 함수
 * @param {Resource[]} resources - 전체 리소스 데이터 배열
 * @param {number} resourceId - 표시할 리소스의 인덱스 (1부터 시작)
 * @description
 * 1. 현재 스크롤 위치를 저장하고 모달에 저장
 * 2. 리소스 데이터로 모달 내용 업데이트
 * 3. 모달을 표시하고 body 스크롤을 고정
 */
export function openModal(resources: Resource[], resourceId: number): void {
  const modal = document.querySelector('dialog');
  if (!modal) return;

  const scrollY = window.scrollY;
  modal.setAttribute('data-scroll-y', scrollY.toString());

  const title = modal.querySelector('[data-roll="title"]') as HTMLDivElement;
  const tags = modal.querySelector('[data-roll="tags"]') as HTMLDivElement;
  const description = modal.querySelector('[data-roll="description"]') as HTMLParagraphElement;
  const resourceUrl = modal.querySelector('[data-roll="resourceUrl"]') as HTMLAnchorElement;
  const category = modal.querySelector('[data-roll="category"]') as HTMLDivElement;
  const author = modal.querySelector('[data-roll="author"]') as HTMLDivElement;
  const difficulty = modal.querySelector('[data-roll="difficulty"]') as HTMLDivElement;
  const dateAdded = modal.querySelector('[data-roll="dateAdded"]') as HTMLDivElement;

  const originData = resources[resourceId - 1];

  title.textContent = originData.title;
  tags.innerHTML = originData.tags
    .map(
      (tag: string) =>
        `<span class="text-quokka-brown bg-quokka-white rounded-4xl px-2.5 py-1.5">${tag}</span>`,
    )
    .join(' ');
  description.textContent = originData.description;
  category.textContent = originData.category;
  difficulty.textContent = originData.difficulty;
  dateAdded.textContent = originData.dateAdded;
  resourceUrl.setAttribute('href', originData.resourceUrl);
  author.textContent = originData.author;

  modal.showModal();

  // 스크롤바는 보이되 스크롤은 막기
  document.body.style.overflowY = 'scroll';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.pointerEvents = 'none';

  // 모달 내부 요소들은 클릭 가능하도록 설정
  modal.style.pointerEvents = 'auto';

  // 모달 내부 스크롤바 숨기기
  const modalContent = modal.querySelector('[data-roll="description"]')?.parentElement;
  if (modalContent) {
    modalContent.style.overflowY = 'auto';
    modalContent.style.overflowX = 'hidden';
    // Firefox
    modalContent.style.scrollbarWidth = 'none';
    // Chrome/Safari/Opera
    const style = document.createElement('style');
    style.textContent = `
      dialog > div::-webkit-scrollbar {
        width: 0;
        height: 0;
        background: transparent;
      }
      dialog > div::-webkit-scrollbar-thumb {
        background: transparent;
      }
      dialog > div::-webkit-scrollbar-track {
        background: transparent;
      }
    `;
    document.head.appendChild(style);
  }

  // 리사이즈 이벤트 처리
  const handleResize = () => {
    // 스크롤바는 보이되 스크롤은 막기
    document.body.style.overflowY = 'scroll';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.pointerEvents = 'none';
  };

  window.addEventListener('resize', handleResize);
  modal.addEventListener('close', () => {
    window.removeEventListener('resize', handleResize);
  });

  // ESC 키로 모달 닫기 방지
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  });
}

/**
 * 모달을 닫고 스크롤 위치를 복원하는 함수
 * @description
 * 1. 저장된 스크롤 위치를 가져옴
 * 2. 모달을 닫음
 * 3. 스크롤 위치를 복원
 * 4. 다음 프레임에서 body 스타일 초기화
 */
export function closeModal(): void {
  const modal = document.querySelector('dialog');
  if (!modal) return;

  const scrollY = parseInt(modal.getAttribute('data-scroll-y') || '0');

  // 모달 닫기 전에 스타일 초기화
  requestAnimationFrame(() => {
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.overflowY = '';
    document.body.style.pointerEvents = '';

    // 스크롤 위치 복원
    window.scrollTo(0, scrollY);
  });

  modal.close();
}

/**
 * 모달 관련 이벤트 리스너를 설정하는 함수
 * @param {Resource[]} resources - 전체 리소스 데이터 배열
 * @description
 * 1. 상세보기 버튼 클릭 시 모달 열기
 * 2. 모달 닫기 버튼 클릭 시 모달 닫기
 * 3. 모달이 닫힐 때 스크롤 위치 복원
 */
export function setupModalEvents(resources: Resource[]): void {
  const section = document.querySelector('main > section');
  if (!section) return;

  const detailButtons = section.querySelectorAll<HTMLButtonElement>('button[name="detail"]');
  detailButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const articles = section.querySelectorAll<HTMLElement>('article');
      const articleTitles = Array.from(articles).map((article) => {
        const h3 = article.querySelector('h3');
        return h3?.textContent?.trim() ?? '';
      });

      const filteredResources = resources.filter((resource) =>
        articleTitles.includes(resource.title),
      );

      const resourceId = Number(this.closest('article')?.getAttribute('data-index'));
      if (!resourceId) return;

      openModal(filteredResources, resourceId);
    });
  });

  const modal = document.querySelector('dialog');
  if (!modal) return;

  const closeBtn = modal.querySelector<HTMLButtonElement>('button[name="close"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // 모달 외부 클릭 시 닫기
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}
