document.addEventListener('DOMContentLoaded', function () {
  // 아웃라인 스타일을 적용하는 함수
  function updateActiveStyles() {
    document.querySelectorAll('.nav-item').forEach((item) => {
      // data-active 속성이 있는지 확인
      const isActive = item.getAttribute('data-active') === 'true';
      // 아이콘 이미지와 텍스트 요소 가져오기
      const iconImg = item.querySelector('img');
      const textSpan = item.querySelector('span');

      if (isActive) {
        // 활성화된 메뉴에는 아웃라인 스타일 적용
        item.style.outline = '2px solid var(--color-quokka-mint)';
        item.style.outlineOffset = '-2px';

        // 활성화 상태용 이미지로 교체
        if (iconImg) {
          const normalSrc = iconImg.getAttribute('data-normal-src') || iconImg.src;
          const activeSrc = normalSrc.replace('.svg', '-active.svg');
          iconImg.src = activeSrc;
          // 원본 경로 저장 (처음 설정 시에만)
          if (!iconImg.getAttribute('data-normal-src')) {
            iconImg.setAttribute('data-normal-src', normalSrc);
          }
        }

        // 텍스트 색상 변경
        if (textSpan) {
          textSpan.style.color = 'var(--color-quokka-tan)';
        }
      } else {
        // 비활성화된 메뉴는 아웃라인 제거
        item.style.outline = 'none';

        // 기본 이미지로 복원
        if (iconImg) {
          const normalSrc =
            iconImg.getAttribute('data-normal-src') || iconImg.src.replace('-active.svg', '.svg');
          iconImg.src = normalSrc;
        }

        // 텍스트 색상 원래대로
        if (textSpan) {
          textSpan.style.color = ''; // 기본 색상으로 복원
        }
      }
    });
  }

  // 초기 로드 시 이미지 원본 경로 저장
  document.querySelectorAll('.nav-item img').forEach((img) => {
    img.setAttribute('data-normal-src', img.src);
  });

  // 초기 로드 시 스타일 적용
  updateActiveStyles();

  // 클릭 이벤트 리스너 추가
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      // 이미 활성화된 항목을 다시 클릭한 경우 무시
      if (item.getAttribute('data-active') === 'true') {
        return;
      }

      // 모든 탭에서 active 상태 제거
      document.querySelectorAll('.nav-item').forEach((el) => {
        el.setAttribute('data-active', 'false');
      });

      // 클릭한 탭을 active 상태로 설정
      item.setAttribute('data-active', 'true');

      // 스타일 업데이트
      updateActiveStyles();
    });
  });
});
