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

// category 변수 선언
const selectCategory: HTMLSelectElement = document.querySelector('[data-roll="selectCategory"]');
const selectStack = document.querySelector('[data-roll="selectStack"]');
const selectDifficulty = document.querySelector('[data-roll="selectDifficulty"]');

// category 리스트 동적 변경
async function updateCategory() {
  const resources = await fetchResources();

  const categorySet = new Set<string>();
  resources.forEach((resource) => {
    categorySet.add(resource.category);
  });

  categorySet.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    selectCategory.appendChild(option);
  });
}
