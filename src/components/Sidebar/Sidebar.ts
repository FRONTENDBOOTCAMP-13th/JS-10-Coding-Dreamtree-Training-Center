document.addEventListener('DOMContentLoaded', () => {
  class Sidebar {
    private navItems: NodeListOf<HTMLElement>;
    private activeTextClass: string = 'text-quokka-brown';
    private activeBorderClass: string = 'border-quokka-mint';
    private activeBorderWidth: string = 'border-2';

    constructor() {
      this.navItems = document.querySelectorAll('.nav-item');
      this.init();
    }

    private init(): void {
      // Set initial active item (dashboard by default)
      const currentPath = window.location.pathname;
      let activeItemFound = false;

      // Check if there's an item matching the current page
      this.navItems.forEach((item) => {
        const itemPath = item.getAttribute('data-page');
        if (itemPath && currentPath.endsWith(itemPath)) {
          this.setActiveItem(item);
          activeItemFound = true;
        }
      });

      // If no active item found, default to the first one
      if (!activeItemFound) {
        this.setActiveItem(this.navItems[0]);
      }

      // Add click event listeners to all nav items
      this.navItems.forEach((item) => {
        item.addEventListener('click', () => this.handleNavItemClick(item));
      });
    }

    private handleNavItemClick(clickedItem: HTMLElement): void {
      // 페이지 이동 처리
      const pagePath = clickedItem.getAttribute('data-page');
      if (pagePath) {
        // 페이지 경로가 있으면 해당 페이지로 이동
        window.location.href = pagePath;
      } else {
        // 페이지 경로가 없는 경우 기본 동작만 수행
        const itemName = clickedItem.querySelector('span')?.textContent;
        console.log(`No page defined for: ${itemName}`);
      }

      // 활성화 상태 업데이트
      this.setActiveItem(clickedItem);
    }

    private setActiveItem(item: HTMLElement): void {
      // Remove active state from all items
      this.navItems.forEach((navItem) => {
        navItem.setAttribute('data-active', 'false');
        navItem.classList.remove(this.activeBorderClass, this.activeBorderWidth);

        // Reset text color
        const textElement = navItem.querySelector('span');
        if (textElement) {
          textElement.classList.remove(this.activeTextClass);
        }

        // Reset icon to inactive version
        this.toggleIcon(navItem, false);
      });

      // Set active state on the clicked item
      item.setAttribute('data-active', 'true');
      item.classList.add(this.activeBorderClass, this.activeBorderWidth);

      // Set active text color
      const textElement = item.querySelector('span');
      if (textElement) {
        textElement.classList.add(this.activeTextClass);
      }

      // Change icon to active version
      this.toggleIcon(item, true);
    }

    private toggleIcon(item: HTMLElement, isActive: boolean): void {
      const iconElement = item.querySelector('img');
      if (!iconElement) return;

      // 원본 아이콘 경로를 data-original-src에 저장해둡니다
      const originalSrc =
        iconElement.getAttribute('data-original-src') ||
        iconElement.getAttribute('src')?.replace('-active.svg', '.svg') ||
        iconElement.getAttribute('src') ||
        '';

      // data-original-src 속성이 없으면 설정합니다
      if (!iconElement.hasAttribute('data-original-src')) {
        iconElement.setAttribute('data-original-src', originalSrc);
      }

      if (isActive) {
        // Change to active icon
        const activeSrc = originalSrc.replace('.svg', '-active.svg');
        iconElement.setAttribute('src', activeSrc);
      } else {
        // Change back to inactive icon (원본 경로 사용)
        iconElement.setAttribute('src', originalSrc);
      }
    }
  }

  // Initialize the sidebar
  new Sidebar();
});
