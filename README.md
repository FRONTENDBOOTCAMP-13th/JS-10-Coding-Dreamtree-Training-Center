<div align="center">

<img src="https://github.com/user-attachments/assets/fce281d5-c8ba-40f3-86f4-39009c31a920" height=300 width=300>
</div>
<br />
<br />
<h3>📌주요 기능</h3>

🔍 **리소스 탐색** - 다중 조건 필터링 · 태그/난이도 표시 · 북마크 토글<br />

📌 **북마크 & 컬렉션** - 북마크·컬렉션 생성(Localstorage) · 북마크 해제<br />

🔐 **사용자 인증** - 회원가입·로그인·비밀번호 찾기 · bcrypt 암호화<br />

💻 **GitHub 대시보드** -  실시간 API 연동(Octokit) · 언어별 색상 · 페이지네이션<br />

🌟 **반응형 UI** - 모바일·데스크탑 반응형 구현<br />
<br />
<br />

<h3>🖥️ 페이지별 화면 구성</h3>
<table> 
  <tr>
    <th>페이지</th>
    <th colspan="2">GIF 시연</th>
  </tr>
  
  <tr>
    <td><strong>💻 대시보드</strong></td>
    <td><img src="./assets/오늘의리소스.gif" width="90%"></td>
    <td><img src="./assets/인기레포지토리.gif" width="90%"></td>
  </tr>
  <tr>
    <td><strong>🔍 리소스 탐색</strong></td>
    <td><img src="./assets/필터링.gif" width="90%"></td>
    <td><img src="./assets/모달.gif" width="90%"></td>
  </tr>
  <tr>
    <td><strong>🔐 사용자 인증</strong></td>
    <td><img src="./assets/회원가입.gif" width="90%"></td>
    <td><img src="./assets/비밀번호 찾기.gif" width="90%"></td>
  </tr>
  <tr>
    <td><strong>📌 북마크 관리</strong></td>
    <td><img src="./assets/북마크.gif" width="90%"></td>
    <td><img src="./assets/컬렉션.gif" width="90%"></td>
  </tr>
</table>
<br />
<br />

<h3>📂 프로젝트 폴더 구조</h3>

<details>
<summary>📂 폴더 구조 보기</summary>

```text
📦 src
├── 📂 api
│   └── 📜 githubApi.ts
├── 📂 components
│   ├── 📂 Button
│   │   └── 📜 button.html
│   ├── 📂 DailyResources
│   │   ├── 📜 daily-resources.html
│   │   └── 📜 daily-resources.ts
│   ├── 📂 Footer
│   │   └── 📜 footer.html
│   ├── 📂 GithubCard
│   │   ├── 📜 github-card.html
│   │   └── 📜 githubCard.ts
│   ├── 📂 Header
│   │   └── 📜 header.html
│   ├── 📂 Modal
│   │   └── 📜 modal.html
│   ├── 📂 ResourceCard
│   │   └── 📜 resource-card.html
│   ├── 📂 Sample
│   │   └── 📜 sample.html
│   └── 📂 Sidebar
│       ├── 📜 sidebar.html
│       └── 📜 sidebar.ts
├── 📂 data
│   ├── 📜 colors.json
│   └── 📜 resource.json
├── 📂 pages
│   ├── 📂 .git
│   ├── 📜 bookmark.html
│   ├── 📜 login.html
│   └── 📜 resource.html
├── 📂 script
│   ├── 📜 bookmarkRendering.ts
│   ├── 📜 collectionModal.ts
│   ├── 📜 collectionRendering.ts
│   ├── 📜 dailyResources.ts
│   ├── 📜 filter.ts
│   ├── 📜 header.ts
│   ├── 📜 login.ts
│   ├── 📜 modalRendering.ts
│   └── 📜 resourceRendering.ts
├── 📂 service
│   ├── 📜 auth.ts
│   └── 📜 bookmark.ts
├── 📂 types
│   ├── 📜 bookmark.type.ts
│   ├── 📜 github.type.ts
│   ├── 📜 resource.type.ts
│   └── 📜 user.type.ts
├── 📜 main.ts
├── 📜 style.css
└── 📜 vite-env.d.ts
```
</details>
