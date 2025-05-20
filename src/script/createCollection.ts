// 컬렉션 생성 버튼 클릭 시, 컬렉션을 생성하는 기능
const newCollectionBtn = document.querySelector('[data-roll="new-collection"]');
const collections = document.querySelector('[data-roll="collections"]');
let collectionCount = 1;

newCollectionBtn?.addEventListener('click', () => {
  // input 생성
  const newInput = document.createElement('input');
  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('name', 'collection');
  newInput.setAttribute('class', `appearance-none peer`);
  newInput.setAttribute('id', `collection${collectionCount}`);

  // label 생성
  const newLabel = document.createElement('label');
  newLabel.setAttribute('for', `collection${collectionCount}`);
  newLabel.setAttribute(
    'class',
    `text-quokka-tan flex w-fit items-center justify-center rounded-4xl bg-white px-3.5 py-2 text-xs font-medium peer-checked:bg-quokka-tan peer-checked:text-white`,
  );

  // 프롬프트 팝업
  const collectionName = prompt('컬렉션 이름을 5자 이내로 적어주세요.');
  if (collectionName !== null) {
    newLabel.textContent = `${collectionName.trim()}`;
  } else {
    alert('잘못 입력하셨습니다.');
    return;
  }

  // div 박스 생성
  const newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'contents');

  newDiv.appendChild(newInput);
  newDiv.appendChild(newLabel);

  // 부모-자식 연결
  collections?.appendChild(newDiv);

  collectionCount++;
});
