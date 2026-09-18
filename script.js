/**
 * My Tasks - 스마트 할 일 관리 (Red Edition)
 * - 키워드 기반 자동 카테고리 분류 (Auto Category Detection)
 * - 데스크톱 & 모바일 반응형 2열 대시보드 지원
 * - Vanilla JavaScript (ES6+) & LocalStorage API
 */

// ==========================================================================
// 상수 및 키워드 사전
// ==========================================================================
const STORAGE_KEYS = {
  TODOS: 'my_tasks_data',
  THEME: 'my_tasks_theme',
  SORT: 'my_tasks_sort',
};

const CATEGORIES = {
  work: { label: '업무', class: 'cat-work', icon: '💼' },
  personal: { label: '개인', class: 'cat-personal', icon: '🏠' },
  study: { label: '공부', class: 'cat-study', icon: '📚' },
};

// 키워드 기반 자동 분류 사전
const KEYWORD_RULES = {
  work: [
    '회의', '미팅', '보고', '보고서', '메일', '이메일', '업무', '기획', '기획서', 
    '개발', '프로젝트', '배포', '결재', '고객', '협력', '일정', '슬랙', 'slack', 
    '지라', 'jira', 'sprint', '스프린트', '이슈', 'pr', '코드리뷰', '제안서', 'pt', 
    '발표', '납기', '마감', '상사', '팀장', '클라이언트', '계약', '매출', '출장', '미팅룸'
  ],
  study: [
    '공부', '시험', '과제', '독서', '책', '강의', '인강', '스터디', '알고리즘', 
    '코딩테스트', '코테', '리액트', 'react', 'js', 'javascript', '자바스크립트', 
    '파이썬', 'python', '영어', '토익', '회화', '단어', '복습', '예습', '논문', 
    '세미나', '튜토리얼', '자격증', '문제풀이', '수학', '학습', '인증', '수업'
  ],
  personal: [
    '운동', '헬스', '런닝', '산책', '쇼핑', '장보기', '마트', '다이소', '청소', 
    '빨래', '설거지', '분리수거', '약속', '친구', '가족', '병원', '치과', '약', 
    '처방', '식사', '요리', '저녁', '점심', '아침', '커피', '카페', '여행', 
    '힐링', '취미', '휴식', '은행', '송금', '납부', '영화', '드라마', '미용실', '세차', '생일', '선물'
  ],
};

// ==========================================================================
// 상태 관리 (State)
// ==========================================================================
let state = {
  todos: [],
  currentFilter: 'all', // 'all' | 'work' | 'personal' | 'study'
  searchQuery: '',
  sortOption: 'custom', // 'custom' | 'created-desc' | 'created-asc' | 'category' | 'status'
  theme: 'light',
  editingId: null,
  draggedId: null,
  userManuallySelectedCategory: false,
};

// ==========================================================================
// DOM 요소 캐싱
// ==========================================================================
const DOM = {
  // 테마 & 헤더
  themeToggleBtn: document.getElementById('theme-toggle'),
  themeIcon: document.querySelector('.theme-icon'),
  remainingBadge: document.getElementById('remaining-badge'),
  todayCountBadge: document.getElementById('today-count-badge'),

  // 대시보드
  progressText: document.getElementById('progress-text'),
  mainProgressBar: document.getElementById('main-progress-bar'),
  workProgressText: document.getElementById('work-progress-text'),
  workProgressBar: document.getElementById('work-progress-bar'),
  personalProgressText: document.getElementById('personal-progress-text'),
  personalProgressBar: document.getElementById('personal-progress-bar'),
  studyProgressText: document.getElementById('study-progress-text'),
  studyProgressBar: document.getElementById('study-progress-bar'),

  // 필터 배지 카운트
  filterCountAll: document.getElementById('filter-count-all'),
  filterCountWork: document.getElementById('filter-count-work'),
  filterCountPersonal: document.getElementById('filter-count-personal'),
  filterCountStudy: document.getElementById('filter-count-study'),

  // 툴바 & 필터
  searchInput: document.getElementById('search-input'),
  sortSelect: document.getElementById('sort-select'),
  clearCompletedBtn: document.getElementById('clear-completed-btn'),
  filterBtns: document.querySelectorAll('.filter-btn'),

  // 스마트 입력 폼
  todoForm: document.getElementById('todo-form'),
  todoInput: document.getElementById('todo-input'),
  todoCategory: document.getElementById('todo-category'),
  addBtn: document.getElementById('add-btn'),
  autoCatHint: document.getElementById('auto-cat-hint'),
  autoCatText: document.getElementById('auto-cat-text'),

  // 목록 & 빈 상태
  todoList: document.getElementById('todo-list'),
  emptyState: document.getElementById('empty-state'),

  // 백업/복원
  exportBtn: document.getElementById('export-btn'),
  importBtnTrigger: document.getElementById('import-btn-trigger'),
  importFileInput: document.getElementById('import-file-input'),
};

// ==========================================================================
// 유틸리티 함수
// ==========================================================================

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getRelativeTimeString(timestamp) {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
}

function isToday(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// ==========================================================================
// 키워드 기반 자동 카테고리 감지 로직
// ==========================================================================

function detectCategoryFromText(text) {
  if (!text || !text.trim()) return null;
  const lower = text.toLowerCase();

  for (const [catKey, keywords] of Object.entries(KEYWORD_RULES)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return { category: catKey, keyword: kw };
      }
    }
  }
  return null;
}

function handleInputAutoCategory() {
  const text = DOM.todoInput.value;
  const match = detectCategoryFromText(text);

  if (match) {
    DOM.todoCategory.value = match.category;
    const catInfo = CATEGORIES[match.category];
    DOM.autoCatText.innerHTML = `키워드 <strong>'${escapeHTML(match.keyword)}'</strong> 감지 ➔ <strong>${catInfo.icon} ${catInfo.label}</strong> 카테고리로 자동 선택되었습니다.`;
    DOM.autoCatHint.classList.remove('hidden');
  } else {
    DOM.autoCatHint.classList.add('hidden');
  }
}

// ==========================================================================
// LocalStorage 입출력
// ==========================================================================

function loadState() {
  try {
    const rawTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
    state.todos = rawTodos ? JSON.parse(rawTodos) : [];
    state.todos.forEach((todo, idx) => {
      if (typeof todo.order !== 'number') todo.order = idx;
      if (!todo.createdAt) todo.createdAt = Date.now();
      if (!todo.category) todo.category = 'work';
    });
  } catch (e) {
    console.error('할 일 로드 실패:', e);
    state.todos = [];
  }

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      state.theme = savedTheme;
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.theme = prefersDark ? 'dark' : 'light';
    }
  } catch (e) {
    state.theme = 'light';
  }

  try {
    const savedSort = localStorage.getItem(STORAGE_KEYS.SORT);
    if (savedSort) {
      state.sortOption = savedSort;
      DOM.sortSelect.value = savedSort;
    }
  } catch (e) {
    state.sortOption = 'custom';
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
  } catch (e) {
    console.error('저장 실패:', e);
  }
}

function saveTheme() {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  } catch (e) {
    console.error('테마 저장 실패:', e);
  }
}

function saveSort() {
  try {
    localStorage.setItem(STORAGE_KEYS.SORT, state.sortOption);
  } catch (e) {
    console.error('정렬 저장 실패:', e);
  }
}

// ==========================================================================
// 테마 관리
// ==========================================================================

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  DOM.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  saveTheme();
}

function toggleTheme() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}

// ==========================================================================
// 대시보드 & 통계 & 필터 카운트 계산
// ==========================================================================

function updateDashboard() {
  const total = state.todos.length;
  const completed = state.todos.filter((t) => t.isCompleted).length;
  const remaining = total - completed;

  // 헤더 뱃지
  DOM.remainingBadge.textContent = `${remaining}개 남음`;
  const todayCount = state.todos.filter((t) => isToday(t.createdAt)).length;
  DOM.todayCountBadge.textContent = `📅 오늘 추가: ${todayCount}개`;

  // 전체 진행률
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  DOM.progressText.textContent = `${completed}/${total} 완료 (${percentage}%)`;
  DOM.mainProgressBar.style.width = `${percentage}%`;

  // 카테고리별 통계
  const catStats = {
    work: { total: 0, completed: 0 },
    personal: { total: 0, completed: 0 },
    study: { total: 0, completed: 0 },
  };

  state.todos.forEach((todo) => {
    const cat = todo.category || 'work';
    if (catStats[cat]) {
      catStats[cat].total++;
      if (todo.isCompleted) catStats[cat].completed++;
    }
  });

  // 미니 진행 바 업데이트
  const updateCatUI = (cat, textEl, barEl) => {
    const data = catStats[cat];
    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    textEl.textContent = `${data.completed}/${data.total} (${pct}%)`;
    barEl.style.width = `${pct}%`;
  };

  updateCatUI('work', DOM.workProgressText, DOM.workProgressBar);
  updateCatUI('personal', DOM.personalProgressText, DOM.personalProgressBar);
  updateCatUI('study', DOM.studyProgressText, DOM.studyProgressBar);

  // 사이드바 필터 뱃지 카운트 갱신
  DOM.filterCountAll.textContent = total;
  DOM.filterCountWork.textContent = catStats.work.total;
  DOM.filterCountPersonal.textContent = catStats.personal.total;
  DOM.filterCountStudy.textContent = catStats.study.total;
}

// ==========================================================================
// 필터 & 정렬 처리
// ==========================================================================

function getFilteredAndSortedTodos() {
  let result = [...state.todos];

  // 1. 카테고리 필터
  if (state.currentFilter !== 'all') {
    result = result.filter((todo) => todo.category === state.currentFilter);
  }

  // 2. 검색어 필터
  if (state.searchQuery.trim()) {
    const query = state.searchQuery.trim().toLowerCase();
    result = result.filter((todo) => todo.title.toLowerCase().includes(query));
  }

  // 3. 정렬 적용
  switch (state.sortOption) {
    case 'created-desc':
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'created-asc':
      result.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case 'category':
      result.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'status':
      result.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
      break;
    case 'custom':
    default:
      result.sort((a, b) => (a.order || 0) - (b.order || 0));
      break;
  }

  return result;
}

// ==========================================================================
// 렌더링
// ==========================================================================

function render() {
  const visibleTodos = getFilteredAndSortedTodos();
  DOM.todoList.innerHTML = '';

  if (visibleTodos.length === 0) {
    DOM.emptyState.classList.remove('hidden');
  } else {
    DOM.emptyState.classList.add('hidden');
  }

  visibleTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    li.draggable = state.sortOption === 'custom';

    const catInfo = CATEGORIES[todo.category] || CATEGORIES.work;
    const timeAgo = getRelativeTimeString(todo.createdAt);

    if (state.editingId === todo.id) {
      // 인라인 편집 모드
      li.innerHTML = `
        <form class="todo-edit-form" onsubmit="return false;">
          <select class="todo-edit-cat" aria-label="카테고리 수정">
            <option value="work" ${todo.category === 'work' ? 'selected' : ''}>💼 업무</option>
            <option value="personal" ${todo.category === 'personal' ? 'selected' : ''}>🏠 개인</option>
            <option value="study" ${todo.category === 'study' ? 'selected' : ''}>📚 공부</option>
          </select>
          <input type="text" class="todo-edit-input" value="${escapeHTML(todo.title)}" aria-label="할 일 수정">
        </form>
      `;

      const editInput = li.querySelector('.todo-edit-input');
      const editCat = li.querySelector('.todo-edit-cat');
      setTimeout(() => {
        editInput.focus();
        editInput.select();
      }, 0);

      const saveEdit = () => {
        const newTitle = editInput.value.trim();
        const newCategory = editCat.value;
        if (newTitle) {
          updateTodo(todo.id, { title: newTitle, category: newCategory });
        }
        state.editingId = null;
        render();
      };

      const cancelEdit = () => {
        state.editingId = null;
        render();
      };

      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
        }
      });

      li.addEventListener('focusout', (e) => {
        if (!li.contains(e.relatedTarget)) {
          saveEdit();
        }
      });
    } else {
      // 일반 카드 뷰 모드
      li.innerHTML = `
        <div class="todo-drag-handle" title="드래그하여 순서 변경">⋮⋮</div>
        <div class="todo-content">
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.isCompleted ? 'checked' : ''} 
            aria-label="${escapeHTML(todo.title)} 완료 여부"
          >
          <div class="todo-details">
            <div class="todo-title-row">
              <span class="cat-badge ${catInfo.class}">${catInfo.icon} ${catInfo.label}</span>
              <span class="todo-text" title="더블클릭하여 수정">${escapeHTML(todo.title)}</span>
            </div>
            <span class="todo-time">🕒 ${timeAgo}</span>
          </div>
        </div>
        <div class="item-actions">
          <button type="button" class="delete-btn" aria-label="삭제" title="삭제">×</button>
        </div>
      `;

      // 더블클릭 인라인 수정
      const todoText = li.querySelector('.todo-text');
      todoText.addEventListener('dblclick', () => {
        state.editingId = todo.id;
        render();
      });

      // 체크박스 토글
      const checkbox = li.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      // 삭제
      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteTodoWithAnimation(li, todo.id));

      // 드래그 앤 드롭
      if (state.sortOption === 'custom') {
        setupDragAndDrop(li, todo.id);
      }
    }

    DOM.todoList.appendChild(li);
  });

  updateDashboard();
}

// ==========================================================================
// 할 일 CRUD 로직
// ==========================================================================

function addTodo(title, category = 'work') {
  const trimmed = title.trim();
  if (!trimmed) return;

  const newTodo = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 4),
    title: trimmed,
    category: category,
    isCompleted: false,
    createdAt: Date.now(),
    order: state.todos.length,
  };

  state.todos.unshift(newTodo);
  state.todos.forEach((t, idx) => (t.order = idx));

  saveTodos();
  render();

  DOM.todoInput.value = '';
  DOM.autoCatHint.classList.add('hidden');
  DOM.todoInput.focus();
}

function updateTodo(id, updates) {
  state.todos = state.todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, ...updates };
    }
    return todo;
  });
  saveTodos();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  state.todos.forEach((t, idx) => (t.order = idx));
  saveTodos();
  render();
}

function deleteTodoWithAnimation(liElement, id) {
  liElement.classList.add('removing');
  setTimeout(() => {
    deleteTodo(id);
  }, 220);
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, isCompleted: !todo.isCompleted };
    }
    return todo;
  });
  saveTodos();
  render();
}

function clearCompletedTodos() {
  const completedCount = state.todos.filter((t) => t.isCompleted).length;
  if (completedCount === 0) {
    alert('완료된 할 일이 없습니다.');
    return;
  }

  if (confirm(`완료된 할 일 ${completedCount}개를 모두 삭제하시겠습니까?`)) {
    state.todos = state.todos.filter((t) => !t.isCompleted);
    state.todos.forEach((t, idx) => (t.order = idx));
    saveTodos();
    render();
  }
}

// ==========================================================================
// 드래그 앤 드롭 (HTML5 Drag & Drop)
// ==========================================================================

function setupDragAndDrop(li, id) {
  li.addEventListener('dragstart', (e) => {
    state.draggedId = id;
    li.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  });

  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    state.draggedId = null;
    document.querySelectorAll('.todo-item').forEach((item) => item.classList.remove('drag-over'));
  });

  li.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    li.classList.add('drag-over');
  });

  li.addEventListener('dragleave', () => {
    li.classList.remove('drag-over');
  });

  li.addEventListener('drop', (e) => {
    e.preventDefault();
    li.classList.remove('drag-over');
    const targetId = id;
    const sourceId = state.draggedId;

    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = state.todos.findIndex((t) => t.id === sourceId);
    const targetIndex = state.todos.findIndex((t) => t.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const [movedItem] = state.todos.splice(sourceIndex, 1);
      state.todos.splice(targetIndex, 0, movedItem);

      state.todos.forEach((todo, idx) => {
        todo.order = idx;
      });

      saveTodos();
      render();
    }
  });
}

// ==========================================================================
// 데이터 백업 / 복원 (JSON Import & Export)
// ==========================================================================

function exportData() {
  const exportPayload = {
    version: '2.0-RedEdition',
    exportDate: new Date().toISOString(),
    todos: state.todos,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `my_tasks_red_backup_${dateStr}.json`;

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      let importedTodos = [];

      if (Array.isArray(parsed)) {
        importedTodos = parsed;
      } else if (parsed && Array.isArray(parsed.todos)) {
        importedTodos = parsed.todos;
      } else {
        throw new Error('올바른 Todo 데이터 형식이 아닙니다.');
      }

      const validated = importedTodos.map((item, idx) => ({
        id: item.id || Date.now().toString() + '-' + idx,
        title: String(item.title || '제목 없음'),
        category: ['work', 'personal', 'study'].includes(item.category) ? item.category : 'work',
        isCompleted: Boolean(item.isCompleted),
        createdAt: Number(item.createdAt) || Date.now(),
        order: typeof item.order === 'number' ? item.order : idx,
      }));

      if (confirm(`가져온 ${validated.length}개의 항목으로 현재 데이터를 덮어쓰시겠습니까?`)) {
        state.todos = validated;
        saveTodos();
        render();
        alert('성공적으로 데이터를 복원했습니다.');
      }
    } catch (err) {
      alert('파일을 가져오는 중 오류가 발생했습니다: ' + err.message);
    }
  };

  reader.readAsText(file);
}

// ==========================================================================
// 키보드 단축키
// ==========================================================================

function setupShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Alt + N: 입력창 포커스
    if (e.altKey && (e.key === 'n' || e.key === 'N' || e.code === 'KeyN')) {
      e.preventDefault();
      DOM.todoInput.focus();
      DOM.todoInput.select();
    }

    // Alt + 1 ~ 4: 필터 전환
    if (e.altKey) {
      const filterMap = {
        Digit1: 'all',
        Digit2: 'work',
        Digit3: 'personal',
        Digit4: 'study',
        '1': 'all',
        '2': 'work',
        '3': 'personal',
        '4': 'study',
      };

      const selected = filterMap[e.code] || filterMap[e.key];
      if (selected) {
        e.preventDefault();
        setFilter(selected);
      }
    }
  });
}

function setFilter(filter) {
  state.currentFilter = filter;
  DOM.filterBtns.forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  render();
}

// ==========================================================================
// 초기화
// ==========================================================================

function init() {
  loadState();
  applyTheme(state.theme);

  // 폼 제출
  DOM.todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(DOM.todoInput.value, DOM.todoCategory.value);
  });

  // 키워드 자동 분류 실시간 감지
  DOM.todoInput.addEventListener('input', handleInputAutoCategory);

  // 필터 탭
  DOM.filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  // 검색
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
  });

  // 정렬
  DOM.sortSelect.addEventListener('change', (e) => {
    state.sortOption = e.target.value;
    saveSort();
    render();
  });

  // 완료 일괄 삭제
  DOM.clearCompletedBtn.addEventListener('click', clearCompletedTodos);

  // 테마 토글
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // 백업 / 복원
  DOM.exportBtn.addEventListener('click', exportData);
  DOM.importBtnTrigger.addEventListener('click', () => DOM.importFileInput.click());
  DOM.importFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      importData(e.target.files[0]);
      e.target.value = '';
    }
  });

  setupShortcuts();
  render();
}

document.addEventListener('DOMContentLoaded', init);
