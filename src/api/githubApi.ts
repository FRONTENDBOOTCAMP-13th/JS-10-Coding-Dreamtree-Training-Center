import { Octokit } from '@octokit/core';
import type { Repo, GitHubApiResponse, CacheData } from '../types/github.type';

const CACHE_DURATION = 10 * 60 * 1000; // 10분
const CACHE_KEY = 'github_repos_cache';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.warn('GitHub API 토큰이 설정되지 않았습니다. API 요청이 제한될 수 있습니다.');
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 6,
  TOTAL_ITEMS: 100,
  MAX_PAGES: 8,
} as const;

function getCachedData(): CacheData | null {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;

  try {
    const parsedData = JSON.parse(cachedData);
    if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
      const shuffledData = [...parsedData.data].sort(() => Math.random() - 0.5);
      return { data: shuffledData, timestamp: parsedData.timestamp };
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedData(data: Repo[], timestamp: number): Repo[] {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp }));
    return data;
  } catch {
    // 캐시 저장 실패 시 메모리에만 데이터 유지
    return data;
  }
}

export async function checkTokenStatus(): Promise<void> {
  try {
    await octokit.request('GET /rate_limit');
  } catch {
    // 토큰 상태 확인 실패 시 무시
  }
}

export async function fetchAllRepos(): Promise<Repo[]> {
  console.time('fetchAllRepos'); // 시작 시간 측정

  const cachedData = getCachedData();
  if (cachedData) {
    console.timeEnd('fetchAllRepos'); // 캐시 hit 시 종료
    return cachedData.data;
  }

  try {
    const perPage = 100;
    const maxPage = 2;

    const requests = Array.from({ length: maxPage }, (_, i) =>
      octokit.request('GET /search/repositories', {
        q: 'stars:>10000',
        per_page: perPage,
        page: i + 1,
      }),
    );

    // 병렬로 요청
    const results = await Promise.all(requests);

    let allItems: Repo[] = [];
    for (const { data } of results) {
      const response = data as GitHubApiResponse;
      if (response.items && response.items.length > 0) {
        allItems = allItems.concat(response.items);
      }
    }

    // 랜덤 섞기
    const shuffledItems = allItems.sort(() => Math.random() - 0.5);
    console.timeEnd('fetchAllRepos'); // 네트워크 fetch 완료 시 종료
    return setCachedData(shuffledItems, Date.now());
  } catch {
    console.timeEnd('fetchAllRepos'); // 에러 발생 시 종료
    return [];
  }
}
