// 사용자 정보 저장 키
const USERS_KEY = 'readingLogUsers';

// 현재 로그인 학생 정보
let currentStudent = null;

// 로컬스토리지에서 사용자 목록 불러오기
function loadUsers() {
  const usersJSON = localStorage.getItem(USERS_KEY);
  return usersJSON ? JSON.parse(usersJSON) : {};
}

// 사용자 목록 저장
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 회원가입 함수
function signup() {
  const id = document.getElementById('student-id').value.trim();
  const name = document.getElementById('student-name-signup').value.trim();
  const password = document.getElementById('student-password-signup').value.trim();

  if (!id || !name || !password) {
    alert('학번, 이름, 비밀번호를 모두 입력하세요.');
    return;
  }

  let users = loadUsers();

  if (users[id]) {
    alert('이미 등록된 학번입니다.');
    return;
  }

  users[id] = { name, password };
  saveUsers(users);

  alert('회원가입 성공! 자동 로그인 됩니다.');

  currentStudent = id;
  showApp();
}

// 로그인 함수
function login() {
  const id = document.getElementById('student-id-login').value.trim();
  const password = document.getElementById('student-password-login').value.trim();

  if (!id || !password) {
    alert('학번과 비밀번호를 입력하세요.');
    return;
  }

  let users = loadUsers();

  if (!users[id]) {
    alert('등록되지 않은 학번입니다.');
    return;
  }

  if (users[id].password !== password) {
    alert('비밀번호가 틀렸습니다.');
    return;
  }

  currentStudent = id;
  showApp();
}

// 로그인 또는 회원가입 후 앱 보여주기
function showApp() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'block';

  const users = loadUsers();
  const studentName = users[currentStudent].name;

  document.getElementById('welcome-message').textContent = `${studentName}님, 환영합니다!`;

  loadBooks();
  updateStats();
}

// 화면 전환 함수
function showSignup() {
  document.getElementById('signup-container').style.display = 'block';
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'none';
}

function showLogin() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('app-container').style.display = 'none';
}

// 로그아웃
function logout() {
  currentStudent = null;
  showLogin();

  // 입력창 초기화
  document.getElementById('student-id-login').value = '';
  document.getElementById('student-password-login').value = '';
  clearBookForm();
  clearBookList();
}

// --- 기존에 있던 loadBooks, renderBookList, addBook, editBook, deleteBook, updateStats 등 함수도 동일하게 유지 ---
// 다만 currentStudent가 학번(id)이므로, 책 데이터 저장 키도 아래처럼 변경 필요:

function loadBooks() {
  const booksJSON = localStorage.getItem(`student_${currentStudent}`);
  let books = booksJSON ? JSON.parse(booksJSON) : [];
  renderBookList(books);
}

// 나머지 기존 함수들도 동일하게 유지하세요.
