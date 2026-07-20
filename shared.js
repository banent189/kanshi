// ═══════════════════════════════════════════════════════════════
// 简纸 Kanshi v3 — MPA 共享数据层 & 工具函数
// 所有页面共用此文件
// ═══════════════════════════════════════════════════════════════

const KANSHI_DB_KEY = "KANSHI_V3_RESTORATION";

let db = {
  todos: [], memoNote: "", timelinePosts: [], dietLogs: [],
  inspirations: [], passwords: [], habits: [], diaries: [],
  books: [], photos: [], customBoxes: [],
  moduleOrders: ['timeline','calories','diary','habits','books','images'],
  gestureLock: "123",
  foodMemory: [], weightLogs: [], exerciseLogs: [],
  financeLogs: []
};

function loadDatabase() {
  const stored = localStorage.getItem(KANSHI_DB_KEY);
  if (stored) {
    try { db = { ...db, ...JSON.parse(stored) }; } catch(e) { console.error("DB load error"); }
  } else {
    db.todos = [
      { id:"t1", title:"散步 30 分钟，感受自然风光", completed:false, scope:"today" },
      { id:"t2", title:"都记今日的灵感小火花", completed:true, scope:"today" },
      { id:"t3", title:"补充阅读《新古典主义》章节", completed:false, scope:"week" }
    ];
    db.timelinePosts = [
      { id:"tp1", content:"下班路过花店，看到向日葵开得很好，买了一束回家\n生活需要一点仪式感", image:"https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80", tags:["日常"], date:"7月7日 18:30", mood:"🌱 快乐" },
      { id:"tp2", content:"逃离手册\n海岛日记", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", tags:["旅行"], date:"7月6日 10:15", mood:"🌊 放松" }
    ];
    db.inspirations = [{ id:"i1", title:"小说人设", tag:"灵感, 写作", ref:"一首关于星辰运转的长诗构想：所有的星球都在以其专属的共振歌唱。每个人的抽屉里都有一本记录它们歌声的简谱。", cat:"小说人设", date:"2026-07-07" }];
    db.passwords = [{ id:"p1", app:"Github 专属主页", username:"kanshi_creator", password:"kanshi_v3_password_demo" }];
    db.habits = [{ id:"h1", name:"每日早起喝温水", category:"健康", streak:1, logs:[new Date().toISOString().split('T')[0]] }, { id:"h2", name:"阅读半小时", category:"修身", streak:0, logs:[] }];
    db.diaries = [{ id:"d1", title:"关于未来生活秩序的思索", content:"在长期的电子感官包围中，我们正在逐渐失去对于真实生活的感知力。简纸 Kanshi 3.0 是我对抗数字噪音的避难所。", date:"2026-07-07 18:00" }];
    db.books = [{ id:"b1", title:"《万历十五年》", author:"黄仁宇", score:"⭐⭐⭐⭐⭐", review:"大历史观的精准剖析，微小的细节最终汇集成不可逆转的历史潮流。", date:"2026-07-08" }];
    db.photos = [{ id:"ph1", title:"夏日傍晚的夕阳", desc:"昨夜西风", src:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", date:"7月8日" }];
    db.customBoxes = [{ id:"box1", name:"保修单与说明书", icon:"📁", template:"说明书模板", items:[{ id:"bi1", name:"吸尘器说明书", brand:"Dyson", model:"V12", date:"2028-01-01" }] }];
    db.memoNote = "今天的松花酿酒，春水煎茶，是一天里最安闲的心境。别忘了在黄昏前给小草浇点清水。";
    saveDatabase();
  }
}

function saveDatabase() {
  localStorage.setItem(KANSHI_DB_KEY, JSON.stringify(db));
}

function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function triggerToast(message) {
  var exist = document.getElementById("kanshi-toast");
  if (exist) exist.remove();
  var toast = document.createElement("div");
  toast.id = "kanshi-toast";
  toast.className = "kanshi-toast";
  toast.innerHTML = '<span>🔑</span> ' + message;
  document.body.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2500);
}

function showModal(html) {
  var modal = document.getElementById("global-modal");
  var area = document.getElementById("modal-content-area");
  if (area) area.innerHTML = html;
  if (modal) modal.classList.remove("hidden");
}

function closeModal() {
  var modal = document.getElementById("global-modal");
  if (modal) modal.classList.add("hidden");
}

function openSubPage(url) {
  window.location.href = url;
}

function getTodayStr() {
  var d = new Date();
  return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日';
}

function getTodayISO() {
  return new Date().toISOString().slice(0,10);
}

function redirectTo(url) {
  window.location.href = url;
}

// 页面初始化时标记当前 nav
function initNav(pageId) {
  var navBtn = document.getElementById('nav-' + pageId);
  if (!navBtn) return;
  var div = navBtn.querySelector('div');
  if (div) div.classList.add('nav-active-pill');
  var svg = div ? div.querySelector('svg') : null;
  if (svg) { svg.classList.remove('text-ink-500'); svg.classList.add('text-sage-800'); }
  var span = navBtn.querySelector('span:last-child');
  if (span) { span.classList.remove('text-ink-500'); span.classList.add('text-sage-800'); }
}
