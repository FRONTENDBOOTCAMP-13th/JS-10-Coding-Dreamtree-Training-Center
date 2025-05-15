const modal = document.querySelector('dialog');
const openBtn = document.querySelector('button[name="detail"]') as HTMLButtonElement;
const closeBtn = document.querySelector('button[name="close"]') as HTMLButtonElement;

openBtn.addEventListener('click', () => {
  modal?.showModal();
});

closeBtn.addEventListener('click', () => {
  modal?.close();
});
