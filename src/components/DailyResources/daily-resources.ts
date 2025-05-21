import resources from '../../data/resource.json';
import { type Resource as ResourceType } from '../../types/resource.type';
import { renderResources } from '../../script/resourceRendering';
import { setupModalEvents } from '../../script/modalRendering';

// 오늘 날짜를 숫자로 바꿔서 고정된 시드를 생성하는 함수
function getDateBasedSeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// 고정된 시드를 바탕으로 항상 같은 랜덤 값을 생성하는 함수
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// 오늘 날짜를 기준으로 랜덤으로 리소스 3개를 선택
function selectDailyResources(resources: ResourceType[]): ResourceType[] {
  if (resources.length < 3) {
    console.error('충분한 리소스가 없습니다.');
    return resources;
  }

  const seed = getDateBasedSeed();
  const random = seededRandom(seed);
  const resourcesCopy = [...resources];

  for (let i = resourcesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [resourcesCopy[i], resourcesCopy[j]] = [resourcesCopy[j], resourcesCopy[i]];
  }

  return resourcesCopy.slice(0, 3);
}

// 페이지 로드 시 실행되어 오늘의 리소스를 표시하는 메인 실행 함수
async function initDailyResources(): Promise<void> {
  try {
    const section = document.querySelector('#daily-resources');
    if (!section) return;

    // 오늘 날짜를 기반으로 랜덤하게 3개의 리소스를 선택
    const dailyResources = selectDailyResources(resources);

    // 선택된 3개의 리소스를 화면에 표시
    await renderResources(dailyResources);

    // 모달 이벤트 설정
    setupModalEvents(dailyResources);

    console.log('오늘의 리소스가 성공적으로 로드되었습니다.');
  } catch (error) {
    console.error('오늘의 리소스 초기화 오류:', error);
  }
}

// 페이지 로드 시 자동으로 initDailyResources() 함수를 실행
document.addEventListener('DOMContentLoaded', initDailyResources);
