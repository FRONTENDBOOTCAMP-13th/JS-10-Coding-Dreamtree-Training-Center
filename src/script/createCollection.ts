/**
 * 이메일 별로 Local Storage 에 저장된 Collections 를 화면에 렌더링하는 함수
 */
function renderCollectionsFromStorage(): void {
  const key = 'collections';
  const email = localStorage.getItem('loginUser');
  const stored = localStorage.getItem(key);
  const collectionsObj = stored ? JSON.parse(stored) : {};
  const userCollections: string[] = email && collectionsObj[email] ? collectionsObj[email] : [];

  collections!.innerHTML = ''; // 기존 컬렉션 초기화

  userCollections.forEach((name, idx) => {
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('name', 'collection');
    newInput.setAttribute('class', `appearance-none peer`);
    newInput.setAttribute('id', `collection${idx + 1}`);

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `collection${idx + 1}`);
    newLabel.setAttribute(
      'class',
      `text-quokka-tan flex w-fit items-center justify-center rounded-4xl bg-white px-3.5 py-2 text-xs font-medium peer-checked:bg-quokka-tan peer-checked:text-white`,
    );
    newLabel.textContent = name;

    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'contents');
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);

    collections?.appendChild(newDiv);
  });

  // collectionCount를 최신 값으로 맞춤
  collectionCount = userCollections.length + 1;
}

// 페이지 로드 시 컬렉션 렌더링
window.addEventListener('DOMContentLoaded', renderCollectionsFromStorage);

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

  // 컬렉션 이름을 작성하기 위한 프롬프트 팝업
  const collectionName = prompt('컬렉션 이름을 5자 이내로 적어주세요.');
  if (collectionName !== null) {
    newLabel.textContent = `${collectionName.trim()}`;

    // 사용자 이메일 정보와 일치하는 Local Storage 에 컬렉션을 저장
    const key = 'collections';
    const email = localStorage.getItem('loginUser');
    if (email) {
      const stored = localStorage.getItem(key);
      const collectionsObj = stored ? JSON.parse(stored) : {};
      if (!collectionsObj[email]) collectionsObj[email] = [];
      collectionsObj[email].push(collectionName.trim());
      localStorage.setItem(key, JSON.stringify(collectionsObj));
    }
  } else {
    // 오류시 알람 팝업 후 종료
    alert('잘못 입력하셨습니다.');
    return;
  }

  // 부모-자식 연결
  const newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'contents');

  newDiv.appendChild(newInput);
  newDiv.appendChild(newLabel);
  collections?.appendChild(newDiv);

  // 카운트 증가(id 값)
  collectionCount++;

  // 컬렉션 추가 후, 다시 렌더링
  renderCollectionsFromStorage();
});
