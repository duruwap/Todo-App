# ✨ My Tasks - 스마트 할 일 관리 웹 앱 (Red Edition)

> **복잡한 서버나 프레임워크 없이 브라우저에서 바로 실행되는 고성능·지능형 할 일 관리(Todo) 웹 애플리케이션**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage_API-crimson?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 📌 프로젝트 소개

**My Tasks**는 직장인, 학생, 프리랜서가 매일 10~20개의 업무와 개인 일정을 가장 빠르고 쾌적하게 관리할 수 있도록 설계된 웹 애플리케이션입니다.  
외부 라이브러리나 무거운 프레임워크 없이 **순수 Vanilla JavaScript**와 **CSS Custom Properties**로 제작되어 **제로 레이턴시(Zero-latency)**의 빠른 반응 속도를 자랑하며, 브라우저의 `localStorage`를 활용하여 새로고침이나 브라우저 재시작 후에도 데이터가 완벽하게 유지됩니다.

---

## 🚀 주요 핵심 기능

### 1. ⚡ 키워드 기반 지능형 카테고리 자동 분류
- 입력창에 할 일을 입력하는 순간, 50개 이상의 일상·업무 키워드를 실시간으로 분석하여 카테고리(`업무`/`개인`/`공부`)를 자동으로 판별 및 지정합니다.
  - 💼 **업무 (work)**: 회의, 보고서, 메일, 프로젝트, 배포, 결재, 지라, 슬랙 등
  - 🏠 **개인 (personal)**: 운동, 헬스, 쇼핑, 장보기, 청소, 약속, 병원, 식사, 여행 등
  - 📚 **공부 (study)**: 공부, 시험, 과제, 독서, 강의, 알고리즘, 리액트, 영어 등
- 자동 감지 시 부드러운 애니메이션과 함께 실시간 피드백 배너가 표시됩니다.

### 2. 📊 실시간 진행률 대시보드 & 통계
- **전체 달성률**: 실시간 게이지 프로그레스 바와 함께 `N/M 완료 (00%)` 형식으로 표시
- **카테고리별 미니 게이지**: 업무, 개인, 공부 카테고리 각각의 달성 현황을 미니 바로 시각화
- **일일 요약**: `📅 오늘 추가된 항목: N개` 뱃지로 하루 생산성 점검 지원

### 3. 🖥️ 반응형 2열 와이드 대시보드 레이아웃
- **데스크톱 (1024px+)**: 좌측 고정형(Sticky) 컨트롤 타워(통계/필터/백업) + 우측 메인 워크스페이스 2열 그리드로 대화면을 시원하게 활용
- **모바일/태블릿**: 작은 화면에 맞춘 1열 적응형 반응형 뷰 자동 전환

### 4. 🌓 스마트 다크 모드 (Dark Mode)
- 눈의 피로를 덜어주는 세련된 다크 테마 기본 탑재
- 시스템 기본 테마 자동 감지 및 사용자 설정 `localStorage` 영구 보존
- 감각적인 Rose Red / Crimson 테마 포인트 컬러 적용

### 5. ✏️ 인라인 수정 & 🖱️ 드래그 앤 드롭 (HTML5 Drag & Drop)
- **더블클릭 인라인 수정**: 항목 텍스트를 더블클릭하여 제목과 카테고리를 즉시 변경 (<kbd>Enter</kbd> 저장 / <kbd>ESC</kbd> 취소)
- **드래그 순서 재배치**: `⋮⋮` 핸들을 마우스로 끌어서 나만의 우선순위대로 자유롭게 순서 조정

### 6. 🔍 실시간 검색 & 다중 정렬
- **실시간 텍스트 검색**: 타이핑과 동시에 일치하는 항목 즉시 필터링
- **5가지 정렬 옵션**: `사용자 지정(드래그순)`, `생성일 최신순`, `생성일 오래된순`, `카테고리순`, `완료 상태순`
- **완료 항목 일괄 삭제**: 원클릭으로 정리(확인 모달 포함)

### 7. 💾 데이터 백업 및 복원 (JSON Import / Export)
- **JSON 내보내기**: 내 데이터를 `my_tasks_red_backup_YYYYMMDD.json` 파일로 즉시 다운로드 백업
- **JSON 가져오기**: 다른 PC나 브라우저에서 백업 파일을 업로드하여 스키마 검증 후 안전하게 복원

---

## ⌨️ 단축키 안내 (Keyboard Shortcuts)

| 단축키 | 기능 설명 |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>N</kbd> | 새 할 일 입력창으로 즉시 포커스 |
| <kbd>Alt</kbd> + <kbd>1</kbd> | **전체** 카테고리 필터 전환 |
| <kbd>Alt</kbd> + <kbd>2</kbd> | **💼 업무** 카테고리 필터 전환 |
| <kbd>Alt</kbd> + <kbd>3</kbd> | **🏠 개인** 카테고리 필터 전환 |
| <kbd>Alt</kbd> + <kbd>4</kbd> | **📚 공부** 카테고리 필터 전환 |
| `항목 더블클릭` | 해당 항목 인라인 수정 모드 진입 |
| <kbd>Enter</kbd> / <kbd>ESC</kbd> | 수정 완료 저장 / 수정 취소 |

---

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **Architecture**: No-Framework, Zero-Dependency, Component-like Modular JS
- **Design System**: CSS Variables (`--primary-color: #e11d48`, Light/Dark Mode)

---

## 📁 프로젝트 파일 구조

```bash
Lab2_TodoApp/
├── index.html        # 메인 웹 애플리케이션 마크업
├── style.css         # 반응형 2열 레이아웃, Red 테마 및 다크 모드 스타일
├── script.js         # 키워드 자동분류, LocalStorage 연동 및 인터랙션 로직
├── README.md         # 프로젝트 설명서 (본 파일)
├── GEMINI.md         # 프로젝트 작업 가이드라인 및 진행 상황 로그
└── backup_v1/        # 이전 버전 (v1 모바일 집중형) 보관 디렉토리
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 🏃 시작하기 및 실행 방법

별도의 `npm install`이나 빌드 과정이 필요 없습니다.

1. 본 저장소를 Clone 하거나 ZIP으로 다운로드합니다:
   ```bash
   git clone https://github.com/your-username/my-tasks-todo.git
   ```
2. 폴더 내의 [`index.html`](index.html) 파일을 더블클릭하거나 브라우저로 열면 즉시 실행됩니다.

---

## 📄 라이선스 (License)

This project is licensed under the [MIT License](LICENSE).
