// Database 생성
const dbReq = indexedDB.open('quokkadocs', 1);

let db;
dbReq.addEventListener('success', function (event) {
  console.log('Database 생성 완료');
  db = event?.target.result;
});

dbReq.addEventListener('error', function (event) {
  console.log('Database 생성 실패');
  const error = event.target.error;
  console.log('error', error.name);
});

// Object Store 생성
dbReq.addEventListener('upgradeneeded', function (event) {
  console.log('Object Store 생성 완료');
  db = event.target.result;
  db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true });
});

// indexedDB 에 저장
