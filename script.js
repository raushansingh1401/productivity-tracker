const monthYearLabel = document.getElementById("monthYear");
const daysGrid = document.getElementById("days");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const userSelect = document.getElementById("userSelect");

let currentDate = new Date();
let currentUser = userSelect.value;

function getKey(year, month) {
  return `calendar_${currentUser}_${year}_${month}`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();

  const key = getKey(year, month);
  const stored = JSON.parse(localStorage.getItem(key)) || {};

  daysGrid.innerHTML = "";
  monthYearLabel.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysGrid.appendChild(empty);
  }

  for (let day = 1; day <= numDays; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;

    const status = stored[day];
    if (status) cell.classList.add(status);

    cell.addEventListener("click", () => {
      const statuses = ["green", "yellow", "red"];
      let current = statuses.indexOf(stored[day]);
      current = (current + 1) % 4;
      if (current >= 0 && current < 3) {
        cell.className = statuses[current];
        stored[day] = statuses[current];
      } else {
        cell.className = "";
        delete stored[day];
      }
      localStorage.setItem(key, JSON.stringify(stored));
    });

    daysGrid.appendChild(cell);
  }
}

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

userSelect.onchange = () => {
  currentUser = userSelect.value;
  renderCalendar();
};

renderCalendar();
