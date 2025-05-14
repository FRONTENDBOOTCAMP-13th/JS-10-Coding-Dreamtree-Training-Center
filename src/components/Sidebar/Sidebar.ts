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
      // Set initial active item (dashboard)
      this.setActiveItem(this.navItems[0]);

      // Add click event listeners to all nav items
      this.navItems.forEach((item) => {
        item.addEventListener('click', () => this.handleNavItemClick(item));
      });
    }

    private handleNavItemClick(clickedItem: HTMLElement): void {
      // Prevent unnecessary updates if clicking the already active item
      if (clickedItem.getAttribute('data-active') === 'true') {
        return;
      }

      // Update active states
      this.setActiveItem(clickedItem);

      // In a real application, you would navigate to the corresponding page here
      const itemName = clickedItem.querySelector('span')?.textContent;
      console.log(`Navigating to: ${itemName}`);
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
