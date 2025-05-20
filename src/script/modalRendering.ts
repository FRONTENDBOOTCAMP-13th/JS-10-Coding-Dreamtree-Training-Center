// 컴포넌트 테스트를 위한 파일이며, 실제 렌더링시 사용되지 않습니다.
import { type Resource } from '../types/resource.type';

/**
 * 모달을 열고 리소스 정보를 업데이트하는 함수
 * @param resources 전체 리소스 데이터
 * @param resourceId 클릭한 리소스의 인덱스
 */
export function openModal(resources: Resource[], resourceId: number): void {
  const modal = document.querySelector('dialog');
  if (!modal) return;

  // 모달에서 동적으로 변경이 필요한 요소를 추출
  const title = modal.querySelector('[data-roll="title"]') as HTMLDivElement;
  const tags = modal.querySelector('[data-roll="tags"]') as HTMLDivElement;
  const description = modal.querySelector('[data-roll="description"]') as HTMLParagraphElement;
  const resourceUrl = modal.querySelector('[data-roll="resourceUrl"]') as HTMLAnchorElement;
  const category = modal.querySelector('[data-roll="category"]') as HTMLDivElement;
  const author = modal.querySelector('[data-roll="author"]') as HTMLDivElement;
  const difficulty = modal.querySelector('[data-roll="difficulty"]') as HTMLDivElement;
  const dateAdded = modal.querySelector('[data-roll="dateAdded"]') as HTMLDivElement;

  // 클릭한 리소스의 데이터 추출
  const originData = resources[resourceId - 1];

  // 모달에 있는 요소에 원본 데이터의 속성 값으로 업데이트
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

  // 모달 정보가 모두 업데이트 된 후 열기 실행
  modal.showModal();
  // 모달이 열렸을 때 body 스크롤 막기 (스크롤바는 유지)
  document.body.style.overflowY = 'scroll';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${window.scrollY}px`;
}

/**
 * 모달을 닫는 함수
 */
export function closeModal(): void {
  const modal = document.querySelector('dialog');
  modal?.close();
  // 모달이 닫혔을 때 body 스크롤 복원
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

/**
 * 모달 관련 이벤트 리스너를 설정하는 함수
 * @param resources 전체 리소스 데이터
 */
export function setupModalEvents(resources: Resource[]): void {
  const section = document.querySelector('main > section');
  if (!section) return;

  // 상세보기 버튼에 이벤트 리스너 추가
  const detailButtons = section.querySelectorAll<HTMLButtonElement>('button[name="detail"]');
  detailButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const resourceId = Number(this.closest('article')?.getAttribute('data-index'));
      openModal(resources, resourceId);
    });
  });

  // 모달 닫기 버튼에 이벤트 리스너 추가
  const modal = document.querySelector('dialog');
  const closeBtn = modal?.querySelector('button[name="close"]') as HTMLButtonElement;
  closeBtn?.addEventListener('click', closeModal);

  // 모달이 닫힐 때 body 스크롤 복원
  modal?.addEventListener('close', () => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  });
}
