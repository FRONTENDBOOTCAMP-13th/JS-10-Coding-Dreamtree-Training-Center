/**
 * @fileoverview 사이드바 네비게이션과 모바일 메뉴 기능을 관리하는 스크립트
 * @description 페이지 로드 시 실행되며, 네비게이션 아이템의 활성화 상태, 클릭 이벤트, 모바일 메뉴 토글 기능을 처리합니다.
 */

/**
 * 모바일 메뉴 토글 기능을 구현하는 함수
 * @description 사이드바의 열림/닫힘 상태를 관리하고, 스크롤 동작을 제어합니다.
 */
function setupMobileMenu(): void {
  const menuToggle = document.querySelector('[data-roll="menu-toggle"]') as HTMLButtonElement;
  const overlay = document.querySelector('[data-roll="overlay"]') as HTMLDivElement;
  const aside = document.querySelector('aside') as HTMLElement;

  if (!menuToggle || !overlay || !aside) return;

  /**
   * 메뉴 토글 버튼 클릭 이벤트 핸들러
   * @description 사이드바의 열림/닫힘 상태를 토글하고, 스크롤 동작을 제어합니다.
   */
  menuToggle.addEventListener('click', () => {
    const isOpen = aside.classList.contains('translate-x-0');

    if (isOpen) {
      // 메뉴 닫기
      aside.classList.remove('translate-x-0');
      aside.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflowY = '';
    } else {
      // 메뉴 열기
      aside.classList.remove('-translate-x-full');
      aside.classList.add('translate-x-0');
      overlay.classList.remove('hidden');
      menuToggle.classList.add('hidden');
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflowY = 'scroll';
    }
  });

  /**
   * 오버레이 클릭 이벤트 핸들러
   * @description 오버레이 클릭 시 사이드바를 닫고 스크롤 상태를 복원합니다.
   */
  overlay.addEventListener('click', () => {
    aside.classList.remove('translate-x-0');
    aside.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  });

  /**
   * 사이드바 transition 완료 이벤트 핸들러
   * @description 사이드바 애니메이션이 완료된 후 햄버거 버튼을 표시합니다.
   */
  aside.addEventListener('transitionend', () => {
    if (aside.classList.contains('-translate-x-full')) {
      menuToggle.classList.remove('hidden');
    }
  });

  /**
   * 화면 크기 변경 시 처리하는 함수
   * @description 화면 크기에 따라 사이드바와 햄버거 버튼의 상태를 조정합니다.
   */
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      // lg 브레이크포인트
      aside.classList.remove('-translate-x-full');
      aside.classList.add('translate-x-0');
      overlay.classList.add('hidden');
      menuToggle.classList.add('hidden');
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    } else {
      // 모바일 크기로 돌아갈 때
      aside.classList.add('-translate-x-full');
      aside.classList.remove('translate-x-0');
      overlay.classList.add('hidden');
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  // 초기 로드 시 화면 크기에 따른 처리
  handleResize();

  // 리사이즈 이벤트 리스너 등록
  window.addEventListener('resize', handleResize);
}

/**
 * 네비게이션 아이템의 활성화 상태를 설정하는 함수
 * @param {HTMLElement} activeItem - 활성화할 네비게이션 아이템 요소
 * @description 선택된 네비게이션 아이템을 활성화 상태로 설정하고, 다른 아이템들의 활성화 상태를 해제합니다.
 */
function setActive(activeItem: HTMLElement): void {
  const navItems = document.querySelectorAll<HTMLElement>('.nav-item');

  // 모든 아이템의 활성화 상태를 초기화
  navItems.forEach((item) => {
    item.setAttribute('data-active', 'false');
    item.classList.remove('border-quokka-mint', 'border-2');
    item.querySelector('span')?.classList.remove('text-quokka-brown');
    toggleIcon(item, false);
  });

  // 선택된 아이템을 활성화 상태로 설정
  activeItem.setAttribute('data-active', 'true');
  activeItem.classList.add('border-quokka-mint', 'border-2');
  activeItem.querySelector('span')?.classList.add('text-quokka-brown');
  toggleIcon(activeItem, true);
}

/**
 * 네비게이션 아이템의 아이콘을 토글하는 함수
 * @param {HTMLElement} item - 아이콘을 토글할 네비게이션 아이템 요소
 * @param {boolean} isActive - 활성화 상태 여부
 * @description 활성화 상태에 따라 네비게이션 아이템의 아이콘 이미지를 변경합니다.
 */
function toggleIcon(item: HTMLElement, isActive: boolean): void {
  const icon = item.querySelector('img');
  if (!icon) return;

  // 원본 아이콘 경로 저장 및 관리
  const original = icon.getAttribute('data-original-src') || icon.getAttribute('src') || '';
  if (!icon.hasAttribute('data-original-src')) {
    icon.setAttribute('data-original-src', original);
  }

  // 활성화 상태에 따라 아이콘 이미지 변경
  const newSrc = isActive
    ? original.replace('.svg', '-active.svg')
    : original.replace('-active.svg', '.svg');
  icon.setAttribute('src', newSrc);
}

/**
 * 페이지 로드 시 실행되는 초기화 함수
 * @description 네비게이션 아이템의 초기 상태를 설정하고 이벤트 리스너를 등록합니다.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 모바일 메뉴 설정
  setupMobileMenu();

  // 네비게이션 아이템 설정
  const navItems = document.querySelectorAll<HTMLElement>('.nav-item');
  const currentPath = window.location.pathname;

  navItems.forEach((item) => {
    const itemPath = item.getAttribute('data-page');
    if (itemPath) {
      // 대시보드 링크인 경우 index.html과 dashboard.html 모두 활성화
      if (itemPath === '/' && (currentPath === '/' || currentPath.endsWith('dashboard.html'))) {
        setActive(item);
      }
      // 다른 링크들은 현재 경로와 비교하여 활성화
      else if (
        currentPath.endsWith(itemPath) ||
        currentPath.endsWith(itemPath.replace('/src/pages/', ''))
      ) {
        setActive(item);
      }
    }

    // 클릭 이벤트 리스너 추가
    item.addEventListener('click', () => {
      if (itemPath) window.location.href = itemPath;
      setActive(item);
    });
  });
});
