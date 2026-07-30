# 简纸 Kanshi v3 — 项目文档

## 项目概述

个人生活管理软件，MPA（多页应用）架构，纯前端 HTML + CSS + JavaScript，数据存储于浏览器 localStorage。

- UI 风格：暖白奶色背景、墨绿/灰绿色主色、纸感卡片、极简杂志风
- 数据层：`shared.js` → `db` 对象 → `localStorage` key `KANSHI_V3_RESTORATION`
- 导航：固定底部 5 项导航（今天 / 待办 / 记录 / 工具 / 收纳盒）

---

## 目录结构

```
d:/桌面/简纸NEW/
├── shared.js                      # 全局数据层 & 工具函数
├── claude.md                      # Claude Code 项目规范（MPA 铁律）
├── 1.html                         # 视觉参考文件（Gemini 生成）
├── calories_v2.html               # 饮食页旧版本（不动）
├── lib/                           # 第三方库
│   ├── lunar.min.js               # 阴历转换
│   ├── pdf-lib.min.js             # PDF 操作
│   ├── qrcode.min.js              # 二维码生成
│   └── tailwind.min.js            # Tailwind（未使用）
├── pic/                           # 图标素材
│   ├── 动态.png / 搜索.png / 灵感.png / 线路-饮食.png / 174_记账.png
│
├── page-today/                    # ═══ 底部导航 ① 今天 ═══
│   └── index.html                 # 首页（运签/天气/快速记账/痕迹）
│
├── page-todo/                     # ═══ 底部导航 ② 待办 ═══
│   └── todo.html                  # 任务管理（三视图/重复/提醒/左滑删除）
│
├── page-records/                  # ═══ 底部导航 ③ 记录 ═══
│   ├── records.html               # 记录中心首页（不对称拼版）
│   ├── timeline/                  # 今日动态模块
│   │   └── index.html
│   ├── habits/                    # 习惯打卡模块
│   │   └── index.html
│   ├── inspiration/               # 灵感模块
│   │   ├── index.html             #   灵感列表
│   │   └── add.html               #   新增灵感
│   ├── diary/                     # 心灵日记模块
│   │   └── index.html
│   ├── books/                     # 书评模块
│   │   └── index.html
│   ├── calories/                  # 饮食热量模块
│   │   └── index.html
│   ├── gallery/                   # 影像回忆模块
│   │   └── index.html
│   ├── accounting/                # 记账模块（快速新增+列表）
│   │   └── index.html
│   ├── travel/                    # 旅行模块（空状态占位）
│   │   └── index.html
│   └── record-arrange/            # 编排模块管理
│       └── index.html
│
├── page-tools/                    # ═══ 底部导航 ④ 工具 ═══
│   ├── tools.html                 # 工具首页
│   ├── img2pdf.html               # 图片转PDF
│   ├── qrcode.html                # 二维码工具
│   ├── watermark.html             # 去水印工具
│   └── password-manager.html      # 密码管理
│
└── page-storage/                  # ═══ 底部导航 ⑤ 收纳盒 ═══
    ├── storage.html               # 收纳盒首页
    └── password-lock.html         # 密码锁
```

---

## 数据层（shared.js）

### localStorage 键名

| 键名 | 说明 |
|------|------|
| `KANSHI_V3_RESTORATION` | 主数据（全部模块共用） |
| `KANSHI_RECORD_LAYOUT` | 编排 - 模块顺序与隐藏状态 |
| `KANSHI_RECORD_SCROLL` | 记录页滚动位置 |

### db 顶层字段

| 字段 | 类型 | 对应模块 |
|------|------|----------|
| `db.todos` | Array | 待办 |
| `db.memoNote` | String | 今日小笺 |
| `db.timelinePosts` | Array | 今日动态 |
| `db.dietLogs` | Array | 饮食热量 |
| `db.foodMemory` | Array | 饮食记忆 |
| `db.exerciseLogs` | Array | 运动记录 |
| `db.weightLogs` | Array | 体重记录 |
| `db.financeLogs` | Array | 记账 |
| `db.inspirations` | Array | 灵感 |
| `db.habits` | Array | 习惯打卡 |
| `db.diaries` | Array | 心灵日记 |
| `db.books` | Array | 书评 |
| `db.photos` | Array | 影像回忆 |
| `db.passwords` | Array | 密码管理 |
| `db.customBoxes` | Array | 收纳盒自定义盒子 |
| `db.gestureLock` | String | 手势锁 |

### 关键函数

| 函数 | 位置 | 说明 |
|------|------|------|
| `loadDatabase()` | shared.js | 加载 localStorage → db |
| `saveDatabase()` | shared.js | db → localStorage |
| `escapeHtml(str)` | shared.js | HTML 转义 |
| `redirectTo(url)` | shared.js | 页面跳转 |
| `initNav(pageId)` | shared.js | 底部导航高亮 |
| `showToast(msg)` | 各页自实现 | Toast 提示 |
| `smartBack()` | timeline/index.html | 智能返回 |
| `showRecordSearch()` | records.html | 记录页搜索 |
| `ShowToast(msg,dur)` | todo.html | 待办 Toast |

---

## 底部导航（5 项统一）

| ID | 标签 | 目标文件 | DOM 标识 |
|----|------|----------|----------|
| `nav-today` | 今天 | `page-today/index.html` | `class="nav-bar"` |
| `nav-todo` | 待办 | `page-todo/todo.html` | `class="nav-bar"` |
| `nav-records` | 记录 | `page-records/records.html` | `class="nav-bar"` |
| `nav-tools` | 工具 | `page-tools/tools.html` | `class="nav-bar"` |
| `nav-storage` | 收纳 | `page-storage/storage.html` | `class="nav-bar"` |

- 统一高度：`56px` / 圆角：`20px` / 背景：`rgba(251,251,250,0.92)`
- 激活态：`.nav-active-pill` → `background:#E3E8E3`
- 图标：`18×18px` / 标签：`7px`

---

## 记录中心（page-records/records.html）

### 页面结构

```
.record-page-shell
└── .record-page
    ├── .record-header (sticky)
    │   ├── .record-header__side（空占位）
    │   ├── .record-header__title → "记录"（22px）
    │   └── .record-header__side--right
    │       ├── .hdr-btn（搜索 → showRecordSearch()）
    │       └── .hdr-text-btn（编排 → record-arrange/）
    │
    ├── .record-scroll
    │   ├── .featured-card → timeline/（今日动态）
    │   │   ├── .featured-img-wrap / #ft-img / #ft-placeholder
    │   │   └── .featured-body
    │   │       ├── .featured-label → "今日动态"
    │   │       ├── #ft-text
    │   │       ├── #ft-date
    │   │       └── #ft-count
    │   │
    │   └── .record-mosaic（CSS Grid 不对称拼版）
    │       ├── [diet] .record-module--diet → calories/
    │       │   └── #mod-diet-body
    │       ├── [accounting] .record-module--accounting → accounting/
    │       │   └── #mod-fin-body
    │       ├── [inspiration] .record-module--inspiration → inspiration/
    │       │   ├── #mod-insp-body (.inspiration-text)
    │       │   └── #mod-insp-date (.inspiration-date)
    │       ├── [habit] .record-module--habits → habits/
    │       │   └── #mod-habit-body
    │       ├── [book] .record-module--book → books/
    │       │   └── #mod-book-body
    │       └── [travel] .record-module--travel → travel/
    │           └── #mod-travel-body
    │
    └── .nav-bar（底部导航固定）
```

### data-record-type 值

| 值 | 模块 | grid-area | 跳转目标 |
|----|------|-----------|----------|
| `diet` | 饮食与体重 | `diet` | `calories/` |
| `accounting` | 记账 | `accounting` | `accounting/` |
| `inspiration` | 灵感 | `inspiration` | `inspiration/` |
| `habit` | 习惯打卡 | `habits` | `habits/` |
| `book` | 书评 | `book` | `books/` |
| `travel` | 旅行 | `travel` | `travel/` |

### Grid 布局

```css
grid-template-areas:
  "diet inspiration"
  "accounting inspiration"
  "habits habits"
  "book travel";
```

### CSS 变量（.record-page-shell 内）

| 变量 | 值 | 说明 |
|------|-----|------|
| `--page-bg` | `#F5F4F0` | 页面背景 |
| `--ink-deep` | `#30332D` | 主文字 |
| `--ink-title` | `#30342D` | 标题文字 |
| `--ink-body` | `#555A51` | 正文 |
| `--ink-mid` | `#7F847A` | 次级文字 |
| `--green` | `#73846C` | 主题绿色 |
| `--card-warm` | `#FCFBF8` | 暖白卡片 |
| `--card-green` | `#F1F4EE` | 浅绿卡片 |
| `--card-cream` | `#F8F6F0` | 米白卡片 |
| `--safe-bottom` | `calc(72px + env + 52px)` | 底部安全区 |

---

## 各模块详情

### ① 今日动态 timeline/

| 项目 | 内容 |
|------|------|
| 文件 | `page-records/timeline/index.html` |
| 标题 | "今日动态" |
| Header | 左返回(smartBack) / 中标题 / 右日历+新增 |
| 数据 | `db.timelinePosts[]` |
| 返回逻辑 | smartBack() — 从 records 来则回 records，否则回 index |
| 关键 CSS | `.page-timeline` 前缀 |

### ② 习惯打卡 habits/

| 项目 | 内容 |
|------|------|
| 文件 | `page-records/habits/index.html` |
| 数据 | `db.habits[]` → `{id,name,category,streak,logs[]}` |
| 状态 | 空状态页面 |

### ③ 灵感 inspiration/

| 文件 | 内容 |
|------|------|
| `index.html` | 灵感列表（卡片+标签） |
| `add.html` | 新增灵感表单 |
| 数据 | `db.inspirations[]` → `{id,title,tag,ref,cat,date}` |

### ④ 心灵日记 diary/

| 文件 | `page-records/diary/index.html` |
|------|------|
| 数据 | `db.diaries[]` → `{id,title,content,date}` |

### ⑤ 书评 books/

| 文件 | `page-records/books/index.html` |
|------|------|
| 数据 | `db.books[]` → `{id,title,author,score,review,date}` |

### ⑥ 饮食热量 calories/

| 文件 | `page-records/calories/index.html` |
|------|------|
| 数据 | `db.dietLogs[]` / `db.weightLogs[]` / `db.foodMemory[]` / `db.exerciseLogs[]` |

### ⑦ 影像回忆 gallery/

| 文件 | `page-records/gallery/index.html` |
|------|------|
| 数据 | `db.photos[]` → `{id,title,desc,src,date}` |

### ⑧ 记账 accounting/

| 文件 | `page-records/accounting/index.html` |
|------|------|
| Header | 左返回 / "记账" / 右＋新增 |
| 数据 | `db.financeLogs[]` → `{id,type,amount,category,note,date,time}` |
| 功能 | 底部弹窗快速新增(支出/收入) |
| 摘要卡 | 收入 / 支出 / 结余 |

### ⑨ 旅行 travel/

| 文件 | `page-records/travel/index.html` |
|------|------|
| 状态 | 空状态占位（"还没有旅行记录"） |
| 按钮 | "添加第一段旅程" → showToast 提示 |

### ⑩ 编排 record-arrange/

| 文件 | `page-records/record-arrange/index.html` |
|------|------|
| 标题 | "管理记录模块" |
| 说明 | "隐藏模块不会删除已有记录" |
| 功能 | 上移/下移拖动 / 显示隐藏开关 / 恢复默认 / 保存反馈 |

---

## 今天页（page-today/index.html）

### 五层结构

| 层 | 内容 |
|----|------|
| 第一层 | 品牌行 KANSHI + 简纸 + 搜索图标 + 日期/天气行 |
| 第二层 | 今日运签（60 甲子签文 + 幸运色 + 宜忌） |
| 第三层 | 四动作入口（记一刻/记饮食/记一笔/存灵感）2×2 网格 |
| 第四层 | 今天的痕迹（跨模块时间线聚合） |
| 第五层 | 手边工具（二维码/图转PDF/去水印/全部）× 4 等分 |

### 关键数据逻辑

- 运签：`Lunar.fromDate().getDayInGanZhi()` 实时计算，非随机
- 天气：navigator.geolocation + Open-Meteo API（HTTP）
- 今天的痕迹：查询当天 timelinePosts / dietLogs / diaries / inspirations / financeLogs
- 快速记账：`openFinanceModal()` 弹窗

---

## CSS 命名规范

| 页面 | 前缀 |
|------|------|
| 今天 | `.page-today` |
| 待办 | `.page-todo` |
| 记录中心 | `.record-page-shell`（作用域容器） |
| 工具 | `.page-tools` |
| 收纳盒 | `.page-storage` |
| 各子模块 | `.page-模块名`（如 `.page-timeline`） |

---

## 关键 JS 函数速查

| 函数名 | 位置 | 作用 |
|--------|------|------|
| `loadDatabase()` | shared.js | 加载所有数据 |
| `saveDatabase()` | shared.js | 持久化 |
| `redirectTo(url)` | shared.js | 页面跳转 |
| `smartBack()` | timeline/index.html | 智能返回检测 |
| `showRecordSearch()` | records.html | 记录页跨模块搜索 |
| `showToast(msg)` | 各页 | Toast 通知 |
| `renderFinance()` | accounting/index.html | 渲染记账列表 |
| `openAddModal()` | accounting/index.html | 打开记账新增弹窗 |
| `saveFinance()` | accounting/index.html | 保存记账 |
| `openFinanceModal()` | page-today/index.html | 首页快速记账 |
| `saveArrange()` | record-arrange/index.html | 保存编排配置 |
| `resetArrange()` | record-arrange/index.html | 恢复默认排序 |

---

## 命名引用指南

当你需要引用某个具体元素时，使用以下格式：

```
[页面分类] > [模块名] > [具体元素]
```

例如：

- `记录中心 > 今日动态 > .featured-card > #ft-text`
- `记录中心 > 编排 > record-arrange/index.html > resetArrange()`
- `今天 > 第三层 > 记饮食`
- `待办 > 今日小笺 > #todo-note-textarea`
- `记录中心 > 饮食模块 > #mod-diet-body`
- `记账 > accounting/index.html > 摘要卡`
- `底部导航 > #nav-records`
