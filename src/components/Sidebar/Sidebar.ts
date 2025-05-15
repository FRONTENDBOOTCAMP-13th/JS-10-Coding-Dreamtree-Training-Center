/**
 * 사이드바 네비게이션 컴포넌트의 동작을 관리하는 스크립트
 * 페이지 로드 시 실행되며, 네비게이션 아이템의 활성화 상태와 클릭 이벤트를 처리합니다.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 모든 네비게이션 아이템 요소를 선택
  const navItems = document.querySelectorAll<HTMLElement>('.nav-item');
  // 현재 페이지의 경로를 가져옴
  const currentPath = window.location.pathname;

  // 각 네비게이션 아이템에 대해 초기화 및 이벤트 리스너 설정
  navItems.forEach((item) => {
    const itemPath = item.getAttribute('data-page');
    // 현재 페이지와 일치하는 아이템을 활성화 상태로 설정
    if (itemPath && currentPath.endsWith(itemPath)) {
      setActive(item);
    }
    // 클릭 이벤트 리스너 추가
    item.addEventListener('click', () => {
      if (itemPath) window.location.href = itemPath;
      setActive(item);
    });
  });

  /**
   * 네비게이션 아이템의 활성화 상태를 설정하는 함수
   * @param activeItem - 활성화할 네비게이션 아이템 요소
   */
  function setActive(activeItem: HTMLElement) {
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
   * @param item - 아이콘을 토글할 네비게이션 아이템 요소
   * @param isActive - 활성화 상태 여부
   */
  function toggleIcon(item: HTMLElement, isActive: boolean) {
    const icon = item.querySelector('img');
    if (!icon) return;

    // 원본 아이콘 경로 저장 및 관리
    const original = icon.getAttribute('data-original-src') || icon.getAttribute('src') || '';
    if (!icon.hasAttribute('data-original-src')) {
      icon.setAttribute('data-original-src', original);
    }

    // 활성화 상태에 따라 아이콘 이미지 변경
    let newSrc: string;
    if (isActive) {
      newSrc = original.replace('.svg', '-active.svg');
    } else {
      newSrc = original.replace('-active.svg', '.svg');
    }
    icon.setAttribute('src', newSrc);
  }
});
