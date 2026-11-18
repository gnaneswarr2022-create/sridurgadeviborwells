document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date();
  const bookingType = new URLSearchParams(window.location.search).get('type');
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const calendarElement = document.getElementById("calendar");
  const monthYearElement = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  async function fetchAvailability(year, month) {
    const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
    const response = await fetch(`https://sridurgadeviborewells.onrender.com/api/customer/availability?startDate=${firstDay}&endDate=${lastDay}&type=${bookingType}`);
    return response.json();
  }

  async function renderCalendar() {
    monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarElement.innerHTML = `
      <div class="calendar-day">S</div>
      <div class="calendar-day">M</div>
      <div class="calendar-day">T</div>
      <div class="calendar-day">W</div>
      <div class="calendar-day">T</div>
      <div class="calendar-day">F</div>
      <div class="calendar-day">S</div>
    `;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const availabilityData = await fetchAvailability(currentYear, currentMonth);

    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement('div');
      calendarElement.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.classList.add('calendar-date');
      cell.textContent = day;

      const date = new Date(currentYear, currentMonth, day);
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const bookingCount = availabilityData[dateString] || 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPastDate = date < today;
      
      if (isPastDate) {
        cell.classList.add('past-date');
      } else if (bookingCount >= 3) {
        cell.classList.add('full-quota');
        cell.title = "Quota is full";
      } else if (bookingCount === 2) {
        cell.classList.add('filling-fast');
        cell.title = "1 slot left";
      } else {
        cell.classList.add('available');
        cell.title = `${3 - bookingCount} slots left`;
        cell.addEventListener('click', () => {
          document.querySelectorAll('.calendar-date.selected').forEach(d => d.classList.remove('selected'));
          cell.classList.add('selected');
          document.getElementById('selectedDateInput').value = dateString;
        });
      }

      calendarElement.appendChild(cell);
    }
  }

  prevBtn.addEventListener('click', () => {
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
    currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
    renderCalendar();
  });

  window.renderCalendar = renderCalendar;

  renderCalendar();
});