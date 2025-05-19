import data from '../../src/data/resource.json';
import { renderResources } from './resourceRendering';
import { type Resource } from '../types/type';

/**
 * 필터링 함수: 모든 조건을 만족하는 데이터만 반환
 * @param resources : Resource 객체 데이터
 * @param criteria : Resources 객체 데이터 값을 배열 형태로 사용
 * @returns Resource[]
 */
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

/**
 * 필터링 이벤트 핸들러
 */
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

/**
 * 필터링 초기화 함수
 */
export function resetFilters() {
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
  const resetBtn = document.querySelector('[data-roll="reset-button"]');
  resetBtn?.addEventListener('click', resetFilters);

  // 결과 렌더링
  renderResources(data);
});
