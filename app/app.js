// Deadline Radar — localStorage-backed contest deadline tracker.
const STORAGE_KEY = "deadline-radar-items-v1";

const listEl = document.getElementById("deadline-list");
const emptyEl = document.getElementById("empty-state");
const countEl = document.getElementById("count-label");
const formEl = document.getElementById("add-form");
const nameInput = document.getElementById("name-input");
const deadlineInput = document.getElementById("deadline-input");
const urlInput = document.getElementById("url-input");
const errorEl = document.getElementById("form-error");
const clearExpiredBtn = document.getElementById("clear-expired");

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fmtCountdown(deadline) {
  const ms = new Date(deadline).getTime() - Date.now();
  if (Number.isNaN(new Date(deadline).getTime())) return "invalid date";
  if (ms <= 0) return "EXPIRED";
  const min = Math.floor(ms / 60000);
  const d = Math.floor(min / 1440);
  const h = Math.floor((min % 1440) / 60);
  const m = min % 60;
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function render() {
  const items = loadItems().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  listEl.innerHTML = "";
  emptyEl.hidden = items.length > 0;
  countEl.textContent = `${items.length} tracked`;
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "deadline-item";
    li.dataset.id = item.id;

    const info = document.createElement("div");
    info.className = "item-info";
    const title = document.createElement("strong");
    title.textContent = item.name;
    info.appendChild(title);

    const when = document.createElement("span");
    when.className = "item-when";
    const dt = new Date(item.deadline);
    when.textContent = ` — ${dt.toLocaleString()} · `;
    info.appendChild(when);

    const cd = document.createElement("span");
    cd.className = "countdown";
    cd.dataset.deadline = item.deadline;
    cd.textContent = fmtCountdown(item.deadline);
    if (cd.textContent === "EXPIRED") cd.classList.add("expired");
    info.appendChild(cd);

    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = "rules";
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "rules-link";
      info.appendChild(link);
    }

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      saveItems(loadItems().filter((x) => x.id !== item.id));
      render();
    });

    li.appendChild(info);
    li.appendChild(del);
    listEl.appendChild(li);
  }
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.hidden = true;
  const name = nameInput.value.trim();
  const deadline = deadlineInput.value;
  const url = urlInput.value.trim();
  if (!name) {
    errorEl.textContent = "Name is required.";
    errorEl.hidden = false;
    return;
  }
  if (!deadline || Number.isNaN(new Date(deadline).getTime())) {
    errorEl.textContent = "A valid deadline date is required.";
    errorEl.hidden = false;
    return;
  }
  const items = loadItems();
  items.push({ id: `dr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, deadline, url: url || null });
  saveItems(items);
  formEl.reset();
  render();
});

clearExpiredBtn.addEventListener("click", () => {
  const now = Date.now();
  saveItems(loadItems().filter((x) => new Date(x.deadline).getTime() > now));
  render();
});

render();
setInterval(() => {
  document.querySelectorAll(".countdown").forEach((el) => {
    el.textContent = fmtCountdown(el.dataset.deadline);
    el.classList.toggle("expired", el.textContent === "EXPIRED");
  });
}, 30000);
