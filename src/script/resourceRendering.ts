import data from '../../src/data/resource.json';
import { type Resource } from '../types/type';

/**
 * 원본 데이터를 비동기로 가져오는 함수
 * @returns Promise<Resource[]>
 * @description resource.json 에 접근하여 데이터를 가져오는 함수입니다.
 */
async function fetchResources(): Promise<Resource[]> {
  return data;
}

/**
 * 리소스 아티클을 생성하는 함수
 * @param resource : Resource
 * @returns HTMLElement
 * @description 원본 객체의 속성 값에 접근하여 HTML article 의 요소를 동적으로 변경, 생성하는 함수입니다.
 */
function createResourceArticle(resource: Resource): string {
  const tagsHtml = resource.tags
    .map(
      (tag: string) =>
        `<span class="text-quokka-brown bg-quokka-white rounded-4xl px-2.5 py-1.5">${tag}</span>`,
    )
    .join(' ');

  const difficultyStroke =
    resource.difficulty === '쉬움'
      ? 'var(--color-quokka-blue)'
      : resource.difficulty === '보통'
        ? 'var(--color-quokka-green)'
        : 'var(--color-quokka-red)';

  return `
    <article
      class="text-quokka-black rounded-[.625rem] bg-white px-7 py-5 text-xs font-medium shadow-[0_4px_4px_0_rgba(139,109,92,0.10)]" data-index="${resource.id}"
    >
      <h3 class="text-2xl font-semibold" data-roll="title">${resource.title}</h3>
      <p class="text-quokka-gray mt-2 text-sm" data-roll="description">${resource.description}</p>
      <div class="mt-4 font-semibold" data-roll="tags">${tagsHtml}</div>
      <div class="mt-5 flex flex-row justify-between">
        <div class="flex flex-row gap-3">
          <span class="flex flex-row items-center gap-1"  data-roll="category">
          <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.64317 1H2.59061C1.71214 1 1 1.71214 1 2.59061V5.64317C1 6.06502 1.16758 6.4696 1.46588 6.7679L8.23911 13.5411C8.73302 14.035 9.49729 14.1573 10.0817 13.7747C11.5525 12.8118 12.8118 11.5525 13.7747 10.0817C14.1573 9.49729 14.035 8.73302 13.5411 8.23911L6.7679 1.46588C6.4696 1.16758 6.06502 1 5.64317 1Z"
                    stroke="#121212"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.12081 3.12081H3.12611V3.12611H3.12081V3.12081Z"
                    stroke="#121212"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                ${resource.category}</span>
          <span class="flex flex-row items-center gap-1" data-roll="difficulty">
          <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.21191 0C11.1944 0.000203187 14.4226 3.22939 14.4229 7.21191C14.4226 11.1944 11.1944 14.4226 7.21191 14.4229C3.22941 14.4226 0.000203183 11.1944 0 7.21191C0.000203002 3.22941 3.22941 0.000230065 7.21191 0ZM7.21191 1.5C4.05784 1.50023 1.5002 4.05783 1.5 7.21191C1.5002 10.366 4.05784 12.9226 7.21191 12.9229C10.366 12.9226 12.9226 10.366 12.9229 7.21191C12.9226 4.05782 10.366 1.5002 7.21191 1.5ZM7.21191 3.62207C9.19447 3.62207 10.8018 5.22935 10.8018 7.21191C10.8018 9.19447 9.19447 10.8018 7.21191 10.8018C5.22938 10.8017 3.62207 9.19446 3.62207 7.21191C3.62207 5.22937 5.22938 3.6221 7.21191 3.62207Z"
                    fill="${difficultyStroke}"
                  />
                </svg>
                ${resource.difficulty}</span>
        </div>
        <span data-roll="dateAdded">${resource.dateAdded}</span>
      </div>
      <div class="mt-6 flex flex-row items-center justify-between">
        <button
          type="button"
          name="detail"
          class="bg-quokka-brown gap-4 self-center rounded-4xl px-5 py-1.5 text-sm font-semibold text-white cursor-pointer"
        >
          상세보기
        </button>
        <button type="button" name="bookmark" class="self h-[1.875rem] w-[1.5625rem]">
          <svg stroke-linejoin="round"></svg>
        </button>
        <button type="button" name="bookmark" class="self h-[1.875rem] w-[1.5625rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>
      </div>
    </article>
  `;
}

/**
 * 리소스 아티클을 비동기로 렌더링하여 생성하고, 버튼 클릭 시 모달을 작동시키는 함수
 * @returns Promise<void>
 * @description 비동기로 데이터를 가져와서 HTML article 태그를 생성합니다.
 * @description 생성된 HTML article 태그는 main > section 에 삽입됩니다.
 * @description 모달 열기 버튼 클릭 시 동작하는 이벤트 리스너를 추가합니다.
 * @description 이때, 모달에 리소스 정보가 업데이트되고, 모달이 열립니다.
 * @description 모달 닫기 버튼 클릭 시 모달이 닫히는 이벤트 리스너를 추가합니다.
 */
async function renderResources(): Promise<void> {
  // 동적으로 article 데이터를 호출하여, section 자식 요소로 삽입
  const resources = await fetchResources();
  const section = document.querySelector('main > section');

  if (!section) return;
  section.innerHTML = resources.map(createResourceArticle).join('');

  // ↓ 모달 관련 기능
  const detailBtn = section.querySelectorAll<HTMLButtonElement>('button[name="detail"]');
  const modal = document.querySelector('dialog');

  // 각각의 버튼 요소에 동일하게 이벤트 할당
  detailBtn.forEach((button) => {
    button.addEventListener('click', function () {
      // 모달에서 동적으로 변경이 필요한 요소를 추출
      const title = modal?.querySelector('[data-roll="title"]') as HTMLDivElement;
      const tags = modal?.querySelector('[data-roll="tags"]') as HTMLDivElement;
      const description = modal?.querySelector('[data-roll="description"]') as HTMLParagraphElement;
      const resourceUrl = modal?.querySelector('[data-roll="resourceUrl"]') as HTMLAnchorElement;
      const category = modal?.querySelector('[data-roll="category"]') as HTMLDivElement;
      const author = modal?.querySelector('[data-roll="author"]') as HTMLDivElement;
      const difficulty = modal?.querySelector('[data-roll="difficulty"]') as HTMLDivElement;
      const dateAdded = modal?.querySelector('[data-roll="dateAdded"]') as HTMLDivElement;
      const recentView = modal?.querySelector('[data-roll="recentView"]') as HTMLDivElement;

      // 클릭한 버튼의 부모 요소인 article 요소에서 data-index 속성을 가져와서 해당 리소스의 배열 정보를 추출
      const resourceId = Number(this.closest('article')?.getAttribute('data-index'));
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
      recentView.textContent = new Date().toISOString().slice(0, 10) || '';

      // 모달 정보가 모두 업데이트 된 후 열기 실행
      modal?.showModal();
    });
  });

  // 모달 닫기 버튼 클릭 시 모달 닫기
  const closeBtn = modal?.querySelector('button[name="close"]') as HTMLButtonElement;
  closeBtn.addEventListener('click', () => {
    modal?.close();
  });
}

// DOMContentLoaded 이벤트 리스너를 사용하여 DOMContentLoaded 이벤트가 발생할 때 renderResources 함수를 호출합니다.
document.addEventListener('DOMContentLoaded', () => {
  renderResources();
});
