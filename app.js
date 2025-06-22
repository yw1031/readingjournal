// app.js

// 현재 로그인한 학생 이름 (전역 변수)
let currentStudent = null;

// 간단한 사용자 DB (이름:비밀번호)
const users = {
  '홍길동': '1234',
  '김철수': 'abcd',
  '이영희': '0000'
};

// 로그인 함수
function login() {
  const name = document.getElementById('student-name').value.trim();
  const password = document.getElementById('student-password').value.trim();

  if (!name || !password) {
    alert('이름과 비밀번호를 입력하세요.');
    return;
  }

  if (!(name in users)) {
    alert('등록되지 않은 사용자입니다.');
    return;
  }

  if (users[name] !== password) {
    alert('비밀번호가 틀렸습니다.');
    return;
  }

  currentStudent = name;
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'block';
  document.getElementById('welcome-message').textContent = `${currentStudent}님, 환영합니다!`;

  loadBooks();
  updateStats();
}

// 로그아웃 함수
function logout() {
  currentStudent = null;
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('app-container').style.display = 'none';

  document.getElementById('student-name').value = '';
  document.getElementById('student-password').value = '';
  clearBookForm();
  clearBookList();
}

// 로컬스토리지에서 현재 학생의 책 목록 불러오기
function loadBooks() {
  const booksJSON = localStorage.getItem(`student_${currentStudent}`);
  let books = booksJSON ? JSON.parse(booksJSON) : [];
  renderBookList(books);
}

// 책 목록 렌더링
function renderBookList(books) {
  const ul = document.getElementById('book-items');
  ul.innerHTML = '';

  books.forEach((book, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <strong>${book.title}</strong> - ${book.author} <br/>
      읽은 날짜: ${book.date} <br/>
      감상평: ${book.review}
      <div class="actions">
        <button onclick="editBook(${index})">수정</button>
        <button class="delete" onclick="deleteBook(${index})">삭제</button>
      </div>
    `;

    ul.appendChild(li);
  });
}

// 책 등록 함수
function addBook() {
  const title = document.getElementById('book-title').value.trim();
  const author = document.getElementById('book-author').value.trim();
  const date = document.getElementById('book-date').value;
  const review = document.getElementById('book-review').value.trim();

  if (!title || !author || !date) {
    alert('책 제목, 저자, 읽은 날짜는 필수 입력입니다.');
    return;
  }

  const booksJSON = localStorage.getItem(`student_${currentStudent}`);
  let books = booksJSON ? JSON.parse(booksJSON) : [];

  // 새 책 객체
  const newBook = { title, author, date, review };

  if (editingIndex !== null) {
    // 수정 중일 때
    books[editingIndex] = newBook;
    editingIndex = null;
  } else {
    // 새 등록
    books.push(newBook);
  }

  localStorage.setItem(`student_${currentStudent}`, JSON.stringify(books));
  renderBookList(books);
  clearBookForm();
  updateStats();
}

// 폼 초기화
function clearBookForm() {
  document.getElementById('book-title').value = '';
  document.getElementById('book-author').value = '';
  document.getElementById('book-date').value = '';
  document.getElementById('book-review').value = '';
  editingIndex = null;
}

// 책 삭제 함수
function deleteBook(index) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  const booksJSON = localStorage.getItem(`student_${currentStudent}`);
  let books = booksJSON ? JSON.parse(booksJSON) : [];
  books.splice(index, 1);
  localStorage.setItem(`student_${currentStudent}`, JSON.stringify(books));
  renderBookList(books);
  updateStats();
}

// 수정 중인 책 인덱스
let editingIndex = null;

// 책 수정 함수
function editBook(index) {
  const booksJSON = localStorage.getItem(`student_${currentStudent}`);
  let books = booksJSON ? JSON.parse(booksJSON) : [];

  if (!books[index]) return;

  const book = books[index];
  document.getElementById('book-title').value = book.title;
  document.getElementById('book-author').value = book.author;
  document.getElementById('book-date').value = book.date;
  document.getElementById('book-review').value = book.review;
  editingIndex = index;
}

// 통계 업데이트 함수
function updateStats
