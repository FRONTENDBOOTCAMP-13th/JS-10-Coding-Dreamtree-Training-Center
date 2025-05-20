import resources from '../data/resource.json';

// 리소스 데이터 모양을 정의하는 인터페이스
interface Resource {
  id: number;
  title: string;
  tags: string[];
  description: string;
  difficulty: string;
  category: string;
  dateAdded: string;
  resourceUrl: string;
  author: string;
  isBookmarked: boolean;
}

// 오늘 날짜를 숫자로 바꿔서 고정된 시드를 생성하는 함수
function getDateBasedSeed(): number {
  const today = new Date(); // 오늘 날짜 정보
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate(); // YYYYMMDD 형식의 숫자 만들기
}

// 고정된 시드를 바탕으로 항상 같은 랜덤 값을 생성하는 함수
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// 리소스 데이터를 가져오는 함수
async function fetchResources(): Promise<Resource[]> {
  try {
    return resources;
  } catch (error) {
    console.error('리소스 데이터 로딩 오류:', error);
    return [];
  }
}

// 오늘 날짜를 기준으로 랜덤으로 리소스 3개를 선택 (같은 날이면 항상 같은 3개의 리소스 선택)
function selectDailyResources(resources: Resource[]): Resource[] {
  if (resources.length < 3) {
    console.error('충분한 리소스가 없습니다.');
    return resources;
  }

  const seed = getDateBasedSeed(); // 오늘 날짜를 기반으로 시드 생성
  const random = seededRandom(seed); // 시드를 바탕으로 랜덤 함수 생성
  const resourcesCopy = [...resources]; // 원본 배열을 복사해서 사용

  // Fisher-Yates 알고리즘으로 리소스 배열 섞기
  for (let i = resourcesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [resourcesCopy[i], resourcesCopy[j]] = [resourcesCopy[j], resourcesCopy[i]];
  }

  return resourcesCopy.slice(0, 3); // 섞인 배열에서 처음 3개 리소스 선택
}

// 난이도에 따라 아이콘 색상을 다르게 설정하는 함수
function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case '어려움':
      return '#c25048'; // --color-quokka-red
    case '쉬움':
      return '#64b5f6'; // --color-quokka-blue
    case '보통':
      return '#4caf50'; // --color-quokka-green
    default:
      return '#121212'; // --color-quokka-black
  }
}

// 모달에 리소스 정보를 채우는 함수
function fillModalWithResourceData(resource: Resource): void {
  const modal = document.querySelector('dialog');
  if (!modal) return;

  // 모달에서 동적으로 변경이 필요한 요소들을 추출
  const title = modal.querySelector('[data-roll="title"]') as HTMLHeadingElement;
  const tags = modal.querySelector('[data-roll="tags"]') as HTMLDivElement;
  const description = modal.querySelector('[data-roll="description"]') as HTMLParagraphElement;
  const resourceUrl = modal.querySelector('[data-roll="resourceUrl"]') as HTMLAnchorElement;
  const category = modal.querySelector('[data-roll="category"]') as HTMLDivElement;
  const author = modal.querySelector('[data-roll="author"]') as HTMLDivElement;
  const difficulty = modal.querySelector('[data-roll="difficulty"]') as HTMLDivElement;
  const dateAdded = modal.querySelector('[data-roll="dateAdded"]') as HTMLDivElement;
  const recentView = modal.querySelector('[data-roll="recentView"]') as HTMLDivElement;

  // 모달 요소들에 리소스 데이터 채우기
  if (title) title.textContent = resource.title;
  if (tags) {
    tags.innerHTML = resource.tags
      .map(
        (tag: string) =>
          `<span class="text-quokka-brown bg-quokka-white rounded-4xl px-2.5 py-1.5">${tag}</span>`,
      )
      .join(' ');
  }
  if (description) description.textContent = resource.description;
  if (category) category.textContent = resource.category;
  if (author) author.textContent = resource.author;
  if (difficulty) difficulty.textContent = resource.difficulty;
  if (dateAdded) dateAdded.textContent = resource.dateAdded;
  if (resourceUrl) resourceUrl.setAttribute('href', resource.resourceUrl);
  if (recentView) recentView.textContent = new Date().toISOString().slice(0, 10) || '';

  // 모달 열기
  modal.showModal();
}

// 리소스를 렌더링하는 함수
function renderResources(resources: Resource[]): void {
  const articleElements = document.querySelectorAll('article');
  const modal = document.querySelector('dialog');

  resources.forEach((resource, index) => {
    if (index >= articleElements.length) return;

    const article = articleElements[index];

    // 데이터 인덱스 속성 추가 (모달에서 사용)
    article.setAttribute('data-index', String(resource.id));

    const titleElement = article.querySelector('h3'); // 제목
    if (titleElement) titleElement.textContent = resource.title;

    const descElement = article.querySelector('p'); // 설명
    if (descElement) descElement.textContent = resource.description;

    const tagsContainer = article.querySelector('.mb-2'); // 태그
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      resource.tags.forEach((tag) => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'text-quokka-brown bg-quokka-white rounded-4xl px-2.5 py-1.5';
        tagSpan.textContent = tag;
        tagSpan.style.marginRight = '4px';
        tagsContainer.appendChild(tagSpan);
      });
    }

    // 카테고리, 어려움 설정
    const categoryElement = article.querySelector(
      '.flex.flex-wrap.items-center.gap-3 span:first-child',
    );
    if (categoryElement) {
      const categoryText = categoryElement.lastChild;
      if (categoryText) categoryText.textContent = resource.category;
    }

    const difficultyElement = article.querySelector(
      '.flex.flex-wrap.items-center.gap-3 span:last-child',
    );
    if (difficultyElement) {
      const difficultyText = difficultyElement.lastChild;
      if (difficultyText) difficultyText.textContent = resource.difficulty;

      // 난이도에 따른 아이콘 색상 변경
      const svgElement = difficultyElement.querySelector('svg path');
      if (svgElement) {
        svgElement.setAttribute('fill', getDifficultyColor(resource.difficulty));
      }
    }

    // 리소스가 언제 추가되었는지 날짜를 보여주는 설정 (원래 dateAdded 값 사용)
    const dateElement = article.querySelector(
      '.mb-2.flex.flex-wrap.items-center.justify-between.gap-3 > span',
    );
    if (dateElement) dateElement.textContent = resource.dateAdded;

    // 상세보기 버튼에 모달 열기 이벤트 연결
    const detailButton = article.querySelector('button[type="button"]:not([name="bookmark"])');
    if (detailButton) {
      // 기존 이벤트 리스너를 제거하고 새로운 이벤트 리스너 추가
      detailButton.replaceWith(detailButton.cloneNode(true));
      const newDetailButton = article.querySelector('button[type="button"]:not([name="bookmark"])');
      if (newDetailButton) {
        // name 속성을 추가하여 모달 스크립트와 호환되도록 함
        newDetailButton.setAttribute('name', 'detail');
        newDetailButton.addEventListener('click', () => {
          fillModalWithResourceData(resource);
        });
      }
    }
  });

  // 모달 닫기 버튼 설정
  if (modal) {
    const closeBtn = modal.querySelector('button[name="close"]') as HTMLButtonElement;
    if (closeBtn) {
      // 기존 이벤트 리스너를 제거하고 새로운 이벤트 리스너 추가
      closeBtn.replaceWith(closeBtn.cloneNode(true));
      const newCloseBtn = modal.querySelector('button[name="close"]') as HTMLButtonElement;
      if (newCloseBtn) {
        newCloseBtn.addEventListener('click', () => {
          modal.close();
        });
      }
    }
  }
}

// 페이지 로드 시 실행되어 오늘의 리소스를 표시하는 메인 실행 함수
async function initDailyResources(): Promise<void> {
  try {
    // 전체 리소스 데이터(JSON 파일)을 불러오는 함수
    const allResources = await fetchResources();
    // 오늘 날짜를 기반으로 랜덤하게 3개의 리소스를 골라 매일 다른 리소스가 나오도록 하는 함수 (하루 동안은 고정)
    const dailyResources = selectDailyResources(allResources);
    // 선택된 3개의 리소스를 화면에 표시하는 함수
    renderResources(dailyResources);

    console.log('오늘의 리소스가 성공적으로 로드되었습니다.');
  } catch (error) {
    console.error('오늘의 리소스 초기화 오류:', error);
  }
}

// 페이지 로드 시 자동으로 initDailyResources 함수를 실행
document.addEventListener('DOMContentLoaded', initDailyResources);
