import colorsData from '../../data/colors.json';
import type { Repo, LanguageColor } from '../../types/github.type';
import { fetchAllRepos, checkTokenStatus, PAGINATION_CONFIG } from '../../api/githubApi';

const API_CONFIG = {
  DEFAULT_LANGUAGE_COLOR: '#d2b48c',
} as const;

const colors: Record<string, LanguageColor> = colorsData;
let allRepos: Repo[] = [];

function setLoading(visible: boolean) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = visible ? 'flex' : 'none';
  }
}

function processDescription(description: string | null): string {
  if (!description) return '';

  // HTML 태그 이스케이프 처리
  let escapedDesc = description.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 커스텀 이모지(:something:) 패턴 제거 (공식 유니코드 이모지는 남김)
  escapedDesc = escapedDesc.replace(/:[a-zA-Z0-9_+-]+:/g, '');

  return escapedDesc;
}

const createCardTemplate = (repo: Repo, langColor: string) => `
  <div class="mb-2 flex items-center gap-4">
    <img
      src="${repo.owner.avatar_url}"
      alt="profile"
      class="h-[1.625rem] w-[1.625rem] rounded-full bg-gray-300"
      loading="lazy"
    />
    <h4 class="text-2xl font-semibold block overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1 max-h-[1.4em] text-quokka-black">${repo.full_name}</h4>
  </div>
  <p class="text-quokka-black mb-4 text-sm line-clamp-3 overflow-hidden">
    ${processDescription(repo.description)}
  </p>
  <div class="flex items-center justify-between text-sm mt-auto overflow-hidden text-ellipsis">
    <div class="text-quokka-black flex items-center gap-1">
      <svg
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.13131 1.23797C7.26771 0.920676 7.73229 0.920676 7.86869 1.23797L9.3779 4.74865C9.43541 4.88241 9.56543 4.97381 9.71468 4.98538L13.632 5.28923C13.9861 5.31669 14.1296 5.74418 13.8599 5.96774L10.8753 8.44131C10.7616 8.53556 10.7119 8.68344 10.7467 8.82436L11.6585 12.5228C11.7409 12.8571 11.3651 13.1213 11.0619 12.9422L7.70814 10.9602C7.58036 10.8847 7.41964 10.8847 7.29186 10.9602L3.93806 12.9422C3.63494 13.1213 3.25909 12.8571 3.3415 12.5228L4.25335 8.82436C4.28809 8.68344 4.23843 8.53556 4.12471 8.44131L1.1401 5.96774C0.870352 5.74418 1.01391 5.31669 1.36797 5.28923L5.28531 4.98538C5.43457 4.97381 5.56459 4.88241 5.6221 4.74865L7.13131 1.23797Z"
          stroke="#121212"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>${repo.stargazers_count.toLocaleString()}</span>
    </div>
    <span class="text-quokka-black flex items-center gap-1 text-xs">
      <span class="inline-block h-2 w-2 rounded-full" style="background-color: ${langColor}"></span>
      ${repo.language || 'Markdown'}
    </span>
  </div>
`;

function createCardElement(repo: Repo): HTMLElement {
  const langColor =
    repo.language && colors[repo.language]?.color
      ? colors[repo.language].color!
      : API_CONFIG.DEFAULT_LANGUAGE_COLOR;

  const card = document.createElement('a');
  card.href = `https://github.com/${repo.full_name}`;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.className =
    'block border-quokka-gray bg-white rounded-2xl border p-6 shadow-lg transition hover:shadow-xl cursor-pointer h-[12.5rem] flex flex-col';

  card.innerHTML = createCardTemplate(repo, langColor);
  return card;
}

function createPaginationButtons() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  pagination.innerHTML = '';

  for (let i = 1; i <= PAGINATION_CONFIG.MAX_PAGES; i++) {
    const button = document.createElement('button');
    button.setAttribute('data-page', i.toString());
    button.textContent = i.toString();

    const isFirstPage = i === 1;
    button.className = `flex items-center justify-center text-quokka-black rounded-lg px-3 py-1 transition-colors hover:border-quokka-brown border cursor-pointer ${
      isFirstPage ? 'border-quokka-brown' : 'border-transparent'
    }`;

    button.addEventListener('click', () => {
      updatePage(i);
    });

    pagination.appendChild(button);
  }
}

function updatePaginationUI(currentPage: number) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  Array.from(pagination.getElementsByTagName('button')).forEach((button) => {
    const buttonPage = parseInt(button.getAttribute('data-page') || '1', 10);
    const isCurrentPage = buttonPage === currentPage;

    button.classList.toggle('border-quokka-brown', isCurrentPage);
    button.classList.toggle('text-quokka-black', true);
    button.classList.toggle('bg-quokka-tan', isCurrentPage);
    button.classList.toggle('border-transparent', !isCurrentPage);
  });
}

function renderCards(repos: Repo[], currentPage: number) {
  const container = document.getElementById('card-container');
  if (!container) {
    console.error('card-container 요소를 찾을 수 없습니다.');
    return;
  }

  const startIndex = (currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE;
  const endIndex = startIndex + PAGINATION_CONFIG.ITEMS_PER_PAGE;
  const pageRepos = repos.slice(startIndex, endIndex);

  const fragment = document.createDocumentFragment();
  pageRepos.forEach((repo) => {
    const card = createCardElement(repo);
    fragment.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
  updatePaginationUI(currentPage);
}

async function updatePage(pageNum: number = 1) {
  try {
    setLoading(true);
    if (allRepos.length === 0) {
      allRepos = await fetchAllRepos();
      if (allRepos.length === 0) {
        throw new Error('저장소 데이터를 가져올 수 없습니다.');
      }
    }
    renderCards(allRepos, pageNum);
    try {
      await checkTokenStatus();
    } catch {
      // 토큰 상태 확인 실패 시 무시하고 토큰 없이 진행
    }
  } catch {
    const container = document.getElementById('card-container');
    if (container) {
      container.innerHTML =
        '<div class="text-center text-quokka-red">데이터를 불러오는 중 오류가 발생했습니다.</div>';
    }
  } finally {
    setLoading(false);
  }
}

function initializeApp() {
  createPaginationButtons();
  updatePage(1);
}

document.addEventListener('DOMContentLoaded', initializeApp);
