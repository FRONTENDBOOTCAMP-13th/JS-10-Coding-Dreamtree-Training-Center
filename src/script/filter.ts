import data from '../../src/data/resource.json';
import { type Resource } from '../types/filter.type';

// 필터링 함수
function filterResources(resources: Resource[], category: string): Resource[] {
  if (!category) return resources;
  return resources.filter((resource) => resource.category === category);
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
    document.getElementById('reset-filters')?.addEventListener('click', () => {
      resetFilters();
    });
    return;
  }

  section.innerHTML = list.map(createResourceArticle).join('');
}

// 리소스 카드 생성 함수
function createResourceArticle(resource: Resource): string {
  const tagsHtml = resource.tags
    .map(
      (tag: string) =>
        `<span class="text-quokka-brown bg-quokka-white rounded-4xl px-2.5 py-1.5">${tag}</span>`,
    )
    .join(' ');

  return `
    <article class="text-quokka-black rounded-[.625rem] bg-white px-7 py-5 text-xs font-medium shadow-[0_4px_4px_0_rgba(139,109,92,0.10)]" data-index="${resource.id}">
      <h3 class="text-2xl font-semibold">${resource.title}</h3>
      <p class="text-quokka-gray mt-2 text-sm">${resource.description}</p>
      <div class="mt-4 font-semibold">${tagsHtml}</div>
      <div class="mt-5 flex flex-row justify-between">
        <div class="flex flex-row gap-3">
          <span>${resource.category}</span>
          <span>${resource.difficulty}</span>
        </div>
        <span>${resource.dateAdded}</span>
      </div>
      <div class="mt-6 flex flex-row items-center justify-between">
        <a href="${resource.resourceUrl}" target="_blank" class="bg-quokka-brown gap-4 self-center rounded-4xl px-5 py-1.5 text-sm font-semibold text-white">상세보기</a>
        <span class="text-xs">${resource.author}</span>
      </div>
    </article>
  `;
}

// 필터링 이벤트 핸들러
function handleCategoryFilter() {
  const category = (document.getElementById('category') as HTMLSelectElement)?.value || '';
  const filtered = filterResources(data, category);
  renderResources(filtered);
}

// 필터 초기화 함수
function resetFilters() {
  (document.getElementById('category') as HTMLSelectElement).selectedIndex = 0;
  renderResources(data);
}

// 이벤트 등록
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('category')?.addEventListener('change', handleCategoryFilter);

  // 필터 초기화 버튼(초기 렌더링 시)
  document.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent?.includes('필터 초기화')) {
      btn.addEventListener('click', resetFilters);
    }
  });

  renderResources(data);
});
