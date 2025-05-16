import data from '../../src/data/resource.json';
import { type Resource } from '../types/type';

// 필터링 함수: 모든 조건을 만족하는 데이터만 반환
function filterResources(
  resources: Resource[],
  criteria: { category?: string; stack?: string; difficulty?: string; language?: string },
): Resource[] {
  return resources.filter((resource) => {
    const matchCategory = criteria.category ? resource.category === criteria.category : true;
    const matchStack = criteria.stack ? resource.tags.includes(criteria.stack) : true;
    const matchDifficulty = criteria.difficulty
      ? resource.difficulty === criteria.difficulty
      : true;
    // 언어는 tags에 포함되어 있다고 가정 (예: "KO", "EN", "JP" 등)
    const matchLanguage = criteria.language ? resource.tags.includes(criteria.language) : true;
    return matchCategory && matchStack && matchDifficulty && matchLanguage;
  });
}

// 리소스 아티클 생성 함수 (기존과 동일)
function createResourceArticle(resource: Resource): string {
  const tagsHtml = resource.tags
    .map(
      (tag: string) =>
        `<span class="text-quokka-brown bg-quokka-white rounded-4xl px-2.5 py-1.5">${tag}</span>`,
    )
    .join(' ');

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
            ${resource.category}
          </span>
          <span class="flex flex-row items-center gap-1" data-roll="difficulty">
            ${resource.difficulty}
          </span>
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
      </div>
    </article>
  `;
}

// 렌더링 함수
function renderResources(list: Resource[]) {
  const section = document.querySelector('main > section');
  if (!section) return;
  section.innerHTML = '';

  if (list.length === 0) {
    section.innerHTML = `
      <div class="col-span-3 text-center text-quokka-gray py-10">
        검색 결과가 없습니다.<br/>
        <button id="reset-filters" type="button" class="mt-4 px-4 py-2 rounded-2xl border text-sm">필터 초기화</button>
      </div>
    `;
    document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
    return;
  }

  section.innerHTML = list.map(createResourceArticle).join('');
}

// 필터링 이벤트 핸들러
function handleFilterChange() {
  const category = (document.getElementById('category') as HTMLSelectElement)?.value || '';
  const stack = (document.getElementById('stack') as HTMLSelectElement)?.value || '';
  const difficulty = (document.getElementById('difficulty') as HTMLSelectElement)?.value || '';
  const language = (document.getElementById('language') as HTMLSelectElement)?.value || '';

  const criteria = {
    category: category || undefined,
    stack: stack || undefined,
    difficulty: difficulty || undefined,
    language: language || undefined,
  };

  const filtered = filterResources(data, criteria);
  renderResources(filtered);
}

// 필터 초기화 함수
function resetFilters() {
  (document.getElementById('category') as HTMLSelectElement).selectedIndex = 0;
  (document.getElementById('stack') as HTMLSelectElement).selectedIndex = 0;
  (document.getElementById('difficulty') as HTMLSelectElement).selectedIndex = 0;
  (document.getElementById('language') as HTMLSelectElement).selectedIndex = 0;
  renderResources(data);
}

// 이벤트 등록
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('category')?.addEventListener('change', handleFilterChange);
  document.getElementById('stack')?.addEventListener('change', handleFilterChange);
  document.getElementById('difficulty')?.addEventListener('change', handleFilterChange);
  document.getElementById('language')?.addEventListener('change', handleFilterChange);

  // 필터 초기화 버튼(초기 렌더링 시)
  document.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent?.includes('필터 초기화')) {
      btn.addEventListener('click', resetFilters);
    }
  });

  renderResources(data);
});
