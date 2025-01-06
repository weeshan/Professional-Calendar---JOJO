document.addEventListener("DOMContentLoaded", function () {
    const monthElement = document.getElementById("month");
    const yearElement = document.getElementById("year");
    const calendar = document.getElementById("calendar");
    const eventForm = document.getElementById("eventForm");
    const saveEventButton = document.getElementById("saveEventButton");
    const deleteEventButton = document.getElementById("deleteEventButton");
    const closeEventForm = document.getElementById("closeEventForm");
    const eventTypeInput = document.getElementById("eventType");
    const eventTimeInput = document.getElementById("eventTime");
    const eventUrgencyInput = document.getElementById("eventUrgency");

    let currentYear = parseInt(yearElement.textContent, 10);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonth = months.indexOf(monthElement.textContent);
    let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

    function formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    function loadEvents() {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get days in month
        calendar.innerHTML = ""; 

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement("div");
            emptyDay.className = "day";
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.className = "day";
            const date = formatDate(currentYear, currentMonth, day);
            dayElement.setAttribute("data-date", date); 

            const dateNumber = document.createElement("span");
            dateNumber.className = "date-number";
            dateNumber.textContent = day;
            dayElement.appendChild(dateNumber);

            const eventContent = document.createElement("div");
            eventContent.className = "event-content";
            dayElement.appendChild(eventContent);

            if (day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                dayElement.classList.add("today");
            }

            const eventDetails = events[date];
            if (eventDetails) {
                eventContent.textContent = `${eventDetails.type} (${eventDetails.time}, ${eventDetails.urgency})`;
            }

            dayElement.addEventListener("click", () => {
                eventForm.style.display = "block";
                eventTypeInput.value = eventDetails?.type || "";
                eventTimeInput.value = eventDetails?.time || "";
                eventUrgencyInput.value = eventDetails?.urgency || "Low";
                eventForm.dataset.selectedDate = date;
            });

            calendar.appendChild(dayElement);
        }
    }

    saveEventButton.addEventListener("click", function () {
        const fullDate = eventForm.dataset.selectedDate;
        const eventDetails = {
            type: eventTypeInput.value,
            time: eventTimeInput.value,
            urgency: eventUrgencyInput.value,
        };

        events[fullDate] = eventDetails;
        localStorage.setItem("calendarEvents", JSON.stringify(events));
        loadEvents(); // Re-load the calendar to display the event
        eventForm.style.display = "none";
    });

    deleteEventButton.addEventListener("click", function () {
        const fullDate = eventForm.dataset.selectedDate;

        delete events[fullDate];
        localStorage.setItem("calendarEvents", JSON.stringify(events));
        loadEvents(); 
        eventForm.style.display = "none";
    });

    closeEventForm.addEventListener("click", function () {
        eventForm.style.display = "none";
    });

    document.getElementById("btnBack").addEventListener("click", () => {
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        monthElement.textContent = months[currentMonth];
        loadEvents();
    });

    document.getElementById("btnNext").addEventListener("click", () => {
        currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
        monthElement.textContent = months[currentMonth];
        loadEvents();
    });

    document.getElementById("btnLeft").addEventListener("click", () => {
        currentYear--;
        yearElement.textContent = currentYear;
        loadEvents();
    });

    document.getElementById("btnRight").addEventListener("click", () => {
        currentYear++;
        yearElement.textContent = currentYear;
        loadEvents();
    });

    loadEvents();
});
