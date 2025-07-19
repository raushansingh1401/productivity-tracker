const calendarDiv = document.getElementById("calendar");
const userList = document.getElementById("userList");
const newUsernameInput = document.getElementById("newUsername");
const createUserBtn = document.getElementById("createUser");
const monthYearDisplay = document.getElementById("monthYear");

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = localStorage.getItem("currentUser") || null;
let marks = {};
let currentDate = new Date(); // Tracks the displayed month

// Format date as YYYY-MM-DD
const pad = (n) => n.toString().padStart(2, "0");
const formatDateKey = (year, month, day) =>
  `${year}-${pad(month)}-${pad(day)}`;

// Load marks from localStorage for the selected user
function loadMarks() {
  const all = JSON.parse(localStorage.getItem("allMarks")) || {};
  marks = (currentUser && all[currentUser]) || {};
}

// Save marks to localStorage for the current user
function saveMarks() {
  const all = JSON.parse(localStorage.getItem("allMarks")) || {};
  all[currentUser] = marks;
  localStorage.setItem("allMarks", JSON.stringify(all));
}

// Populate the user dropdown list
function refreshUserList() {
  userList.innerHTML = "";
  users.forEach((u) => {
    const option = document.createElement("option");
    option.value = u;
    option.textContent = u;
    if (u === currentUser) option.selected = true;
    userList.appendChild(option);
  });
}

// Handle create/switch user
createUserBtn.addEventListener("click", () => {
  const name = newUsernameInput.value.trim();
  if (!name) {
    alert("Please enter a valid username.");
    return;
  }

  if (!users.includes(name)) {
    users.push(name);
    localStorage.setItem("users", JSON.stringify(users));
  }

  currentUser = name;
  localStorage.setItem("currentUser", currentUser);
  refreshUserList();
  loadMarks();
  renderCalendar();
});

// Handle switching users from dropdown
userList.addEventListener("change", (e) => {
  currentUser = e.target.value;
  localStorage.setItem("currentUser", currentUser);
  loadMarks();
  renderCalendar();
});

// Render calendar for the current month
function renderCalendar() {
  if (!currentUser) {
    calendarDiv.innerHTML = "<p>Please create or select a user first.</p>";
    monthYearDisplay.textContent = "";
    return;
  }

  calendarDiv.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Show month and year
  const monthYearStr = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  monthYearDisplay.textContent = monthYearStr;

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach((day) => {
    const header = document.createElement("div");
    header.className = "day";
    header.style.fontWeight = "bold";
    header.textContent = day;
    calendarDiv.appendChild(header);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarDiv.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month + 1, day);
    const box = document.createElement("div");
    box.className = "day";
    box.innerText = day;

    const mark = marks[dateKey];
    if (mark) box.classList.add(mark);

    box.addEventListener("click", () => {
      const current = marks[dateKey];
      const next =
        current === "green"
          ? "yellow"
          : current === "yellow"
          ? "red"
          : current === "red"
          ? null
          : "green";

      if (next) {
        marks[dateKey] = next;
      } else {
        delete marks[dateKey];
      }

      saveMarks();
      renderCalendar();
    });

    calendarDiv.appendChild(box);
  }
}

// Navigation Buttons
document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Initial Setup
refreshUserList();
if (currentUser) loadMarks();
renderCalendar();
