// 컴포넌트 테스트를 위한 파일이며, 실제 렌더링시 사용되지 않습니다.
const modal = document.querySelector('dialog');
const openBtn = document.querySelector('button[name="detail"]') as HTMLButtonElement;
const closeBtn = document.querySelector('button[name="close"]') as HTMLButtonElement;

openBtn.addEventListener('click', () => {
  modal?.showModal();
});

closeBtn.addEventListener('click', () => {
  modal?.close();
});
