var month = 0;
var year = 0;
var todaysDate = "";
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekNames = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "sunday"];
var unique_key = "";
var index = 0;
var counter = 1;
var calendar = document.getElementById('calender');
var day = 1;
var showPlace = document.getElementById("eventDetails");
/**
 * For fetching events from localStorage else create an object with key events;
 */
function getLocalData() {
    var data = JSON.parse(localStorage.getItem("events"));
    if (!data) {
        localStorage.setItem("events", JSON.stringify({}));
        data = {};
    }
    return data;
}

document.addEventListener("DOMContentLoaded", function () {
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();
    loadCalender();
    loadYears();
    changeMonthByArrow();
})

/**
 * To Display Rendered Calender
 */
function loadCalender() {
    var localData = getLocalData();
    var firstDayOfMonth = new Date(year, month, 1).getDay();
    var previousMonthDays = new Date(year, month, 0).getDate();
    var currentMonthDays = new Date(year, month + 1, 0).getDate();
    var beforeDays = (firstDayOfMonth - 1 > 0) ? (firstDayOfMonth - 1) : 6;
    var count = (beforeDays == 6 || (beforeDays == 5 && currentMonthDays == 31)) ? 42 : 35;
    var days = [];
    var combinedDate = "" + year + month + day;
    document.getElementById("month").innerHTML = months[Math.abs(month) % 12];
    document.getElementById("year").value = year;
    calendar.innerHTML = '';
    renderDates(days, previousMonthDays - beforeDays + 1, previousMonthDays, month - 1, 0);
    renderDates(days, 1, currentMonthDays, month, 1);
    renderDates(days, 1, count - days.length, month + 1, 2);

    for (var i = 0; i < days.length; i++) {
        var date = days[i].date;
        var dateString = date == 1 ? date + "-" + days[i].month : date;
        calendar.innerHTML +=
            '<div class="day ' + ((days[i].unique_key === combinedDate) ? "day_selected" : "") + '"><div class="header">' +
            '<span class="date" data-id="date">' + dateString + '</span>' +
            '<span class="add_button" data-action="add_event" data-date=' + days[i].todaysDate + ' data-id=' + days[i].unique_key + '>+</span>' +
            '</div><div class="body">' +
            renderEvents(localData, days[i].unique_key) + ' </div></div>';
    }
}

/**
 * For displaying date , month inside a calendar and unique key for storing data inside localStorage;
 * @param {array} arr 
 * @param {number} start
 * @param {number} end
 * @param {number} month
 * @param {number} type 
 */
function renderDates(arr, start, end, month, type) {
    var y = year,
        m = (Math.abs(month === -1 ? 11 : month) % 12);
    if (type === 0 && m === 11) y = year - 1;
    if (type === 1 && (m >= 0 || m <= 11)) y = year;
    if (type === 2 && m === 0) y = year + 1;
    for (var i = start; i <= end; i++) {
        arr.push({
            date: i,
            month: i === 1 && m >= 0 && months[m],
            unique_key: "" + y + "" + m + i,
            todaysDate: "" + i + "-" + months[m] + "-" + y
        });
    }
}

/**
 * For Displaying Events for specific date inside calender 
 * @param {string} localData 
 * @param {number} unique_key
 */
function renderEvents(localData, unique_key) {
    var eventsData = "";
    var events = localData[unique_key] || [];
    for (var i = 0; i < events.length; i++) {
        if (i === 2) break;
        else {
            eventsData += '<div class="event" data-action="show_event_details" data-id=' + unique_key + "#" + i + '>' +
                '<div class="event1"><span class="time">' + events[i].time + '</span>' +
                ' <span class="title" title="' + events[i].title + '">' + events[i].title + '</span></div><div >' +
                '<span class="edit_button" data-action="edit_event" data-id=' + unique_key + "#" + i + '  data-eid=' + unique_key + '> &#8635</span></div></div >' ;
        }
    }
    if (events.length > 2) eventsData += '<div class="more_events"  data-id=' + unique_key + ' data-action="show_more_events" >...</div>';
    return eventsData;
}

/**
 * For Displaying  more than two Events for specific date inside calender as Popup ;
 * @param {number} unique_key
 */
function showMoreEvents(unique_key) {
    localData = getLocalData();
    var eventsData = "";
    var events = localData[unique_key] || [];
    for (var i = 0; i < events.length; i++) {
        eventsData += '<div class="event" style="display:flex " data-action="show_event_details" data-id=' + unique_key + "#" + i + '>' +
            '<div class="event1"><span class="time">' + events[i].time + '</span>' +
            ' <span class="title" title="' + events[i].title + '">' + events[i].title + '</span></div><div>' +
            '<span class="edit_button" data-action="edit_event" data-id=' + unique_key + "#" + i + '  data-eid=' + unique_key + '> &#8635</span></div></div>';
        }
            
    showPlace.innerHTML = eventsData;
    showPlace.innerHTML += ' <input id=cancelButton type="button"  onclick="cancel()" value="&times">';
    newEventModal.style.display = 'block';
}

/**
 * Function for adding Events for specific date in a calendar; 
 */
function forAddingEvents() {
    var date = new Date();
    var hours = date.getHours();
    var hours1 = hours;
    var minutes = date.getMinutes();
    for (i = 0; i < 5; i++) {
        if (minutes % 5 == 0) break;
        else minutes++;
    }
    hours1 = minutes > 40 ? hours1 += 1 : hours1
    minutes = minutes < 10 ? minutes = 10 : minutes;
    hours = minutes > 40 ? (minutes = 10, hours += 1) : hours;
    var minutes1 = minutes + 15;
    var details =
        '<form name="forms1"><div id="eventsInfo"><div id="eventsInfo1" ><lebel for="Date">Date:' + todaysDate + '</lebel><br>' +
        '<label for="Event">Title:</label><input type="text" name="title"  placeholder="Event Title"  value=""  />' +
        '<div id="message"></div><br><lebel for="Time">Time From:</lebel><input type="time" name="time" value=' + hours + ':' + minutes + ' />' +
        '<lebel for="TimeTo" style="margin-left: 10px">To:</lebel><input type="time" name="time1" value=' + hours1 + ':' + minutes1 + ' /><br>' +
        '<div id="message1"></div><br><lebel for="Description">Description:</lebel><br>' +
        ' <textarea name="description" id="txt" cols="30" rows="5" placeholder="Description"></textarea></div>' +
        ' <div id="addAttende"> <label for="attende">Add Attendee:</label>' +
        ' <input type="button" class="addAttendeButton" value="+" onclick="addNewAttende()"></div></div> <div id=saveClose align="center">' +
        ' <button type="button" id="saveButton" data-action ="save_event"  data-id=' + unique_key + ' >Save</button>' +
        ' <input type="button" id="cancelButton" onclick="cancel()" value="&times"></form></div>';
    showPlace.innerHTML = details;
    newEventModal.style.display = 'block';
}

/**
 * Function for adding attende Dynamically inside an New Event
 */
function addNewAttende() {
    var showPlace1 = document.getElementById("addAttende");
    var div = document.createElement("div");
    var attende = "<input type='text' name='attende' class='new_attendee' data-id='attendeName_" + counter +
        "' placeholder='AddAttende' /><input type='button' class='addAttendeButton' value='-' onclick='removeAttende(event)'/>";
    div.innerHTML = attende;
    div.setAttribute("style", "margin-bottom:5px")
    showPlace1.appendChild(div);
    counter++;
}

/**
 * Function for Saving Event as a Object  ;
 * @param {number} unique_key
 * @param {number} index
 */
function saveEvent(unique_key, index) {
    var formData = document.forms[0].elements;
    if (Eventvalidation() == true) {
        obj = {
            attendes: []
        };
        for (var i = 0; i < formData.length - 1; i++) {
            if (formData[i].name == 'attende' && formData[i].value !== '') {
                obj.attendes.push(formData[i].value);
            } else if (formData[i].name == 'attende' || formData[i].name == "") {
                continue;
            } else
                obj[formData[i].name] = formData[i].value;
        }
        if (unique_key && !index) addEvents(obj);
        else if (unique_key && index) addEvents(obj, index);
        newEventModal.style.display = 'none';
        loadCalender();
    }
}

/**
 * Function for validating title and Event Timings and Attendee inside an Event
 */
function Eventvalidation() {
    var formData = document.forms[0].elements;
    var validated = true;
    validateInput();

    function setError(ele) {
        if (ele == 1) {
            var element1 = document.getElementById('message');
            element1.style["color"] = 'red';
            element1.innerHTML = 'Please Enter Event Tittle*';
        }
        if (ele == 2) {
            var element = document.getElementById('message1');
            element.style["color"] = 'red';
            element.innerHTML = 'Plese Check Event Timings*';
        }
    }

    function setSucess(ele) {
        if (ele == 1) {
            var element1 = document.getElementById('message');
            element1.innerHTML = null;
        }
        if (ele == 2) {
            var element = document.getElementById('message1');
            element.innerHTML = null;
        }
    }

    function validateInput() {
        var attendessList = document.querySelectorAll('.new_attendee');
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (formData[0].value.trim() === '') {
            setError(1);
            validated = false;
        } else setSucess(1);
        if ((formData[1].value >= formData[2].value) || formData[1].value == '' || formData[2].value == '' || (formData[1].value == formData[2].value)) {
            setError(2);
            validated = false;
        } else setSucess(2);
        for (var i = 0; i < attendessList.length; i++) {
            if (!regex.test(attendessList[i].value.trim())) {
                attendessList[i].style.border = '2px solid red';
                validated = false;
            } else attendessList[i].style.border = '2px solid black';
        }
    }
    return validated;
}

/**
 *  Function for Saving Newly added Object as an Event inside LocalStorage ;
 * @param {object} obj
 * @param {number} index
 */
function addEvents(obj, index) {
    var data = getLocalData();
    var evs = data[unique_key] || [];

    if (obj && index) {
        evs[index] = obj;
    } else evs.push(obj);

    evs.sort(function (a, b) {
        if (a.time > b.time) return 1;
        else if (b.time > a.time) return -1;
        else return 0;
    });
    data[unique_key] = evs;
    localStorage.setItem("events", JSON.stringify(data));

}

/**
 * Event Delegation for doing tasks like Add Event , Edit Event , Show Event. 
 */
var calender = document.getElementById("calender");
calender.addEventListener("click", function (e) {

    var target = e.target;
    var dataset = target.dataset;
    var dayEelement = target.closest(".day");
    if (dayEelement) {
        document.querySelector(".day_selected").classList.remove("day_selected");
        dayEelement.classList.add("day_selected");
    }
    if (dataset.action === "edit_event") {
        index = customSplit(dataset.id, '#');
        unique_key = index[0];
        forEditingEvents(unique_key, index[1]);
    }
    if (dataset.action === "add_event") {
        unique_key = dataset.id;
        todaysDate = dataset.date;
        forAddingEvents();
    }
    if (dataset.action === 'show_more_events') {
        unique_key = dataset.id;
        showMoreEvents(unique_key);
    }
});

/**
 *Event Delegation for doing tasks on popup like Edit or Save event. 
 */
var editEventData = document.getElementById("eventDetails");
editEventData.addEventListener("click", function (e) {
    var target = e.target;
    var dataset = target.dataset;
    if (dataset.action === "edit_event") {
        index = customSplit(dataset.id, '#');
        unique_key = index[0];
        forEditingEvents(unique_key, index[1]);
    }
    if (dataset.action === 'save_event') {
        unique_key = dataset.id;
        index = dataset.index;
        saveEvent(unique_key, index);
    }
});

/**
 * function for Editing existing event
 * @param {string} unique_key 
 * @param {number} index 
 */
function forEditingEvents(unique_key, index) {
    localData = getLocalData();
    var events = localData[unique_key][index] || [];
    var details =
        '<form action=" " name="forms1"><div id="eventsInfo"><div id="eventsInfo1" ><label for="Event">Title:</label>' +
        '<input type="text" name="title"  value="' + events.title + '" /><div id="message"></div><br>' +
        '<lebel for="Time">Time From:</lebel><input type="time" name="time" value=' + events.time + ' />' +
        '<lebel for="TimeTo" style="margin-left: 10px">To:</lebel><input type="time" name="time1" value=' + events.time1 + '>' +
        '<div id="message1"></div><br><lebel for="Description">Description:</lebel><br>' +
        ' <textarea name="description" id="txt" cols="30" rows="5" >' + events.description + '</textarea></div>';
    details += ' <div id="addAttende"><label for="attende">Attendes:</label>' +
        ' <input type="button" class="addAttendeButton" value="+" onclick="addNewAttende()">';
    for (j = 0; j < events.attendes.length; j++) {
        details += '<div style = "margin-bottom:5px"> <input type="text" name="attende" class="new_attendee"  data-id="attendeName' + counter + '" value=' + events.attendes[j] + '   />' +
            '<input type="button" class="addAttendeButton"  value="-" data-index = ' + j + ' data-parentindex = ' + index + ' onclick="removeAttende(event);"/></div>';
        counter++;
    }
    details += ' </div></div>' +
        ' <div id=saveClose align="center">' +
        ' <input type="button" id="saveButton" value="Update"  data-action ="save_event"  data-id=' + unique_key + ' data-index = ' + index + '>' +
        '<input type="button" id="deleteEvent"  value="Delete" data-id=' + index + ' onclick="deleteEvents(event)"/>' +
        ' <input id=cancelButton type="button"  onclick="cancel()" value="&times">' +
        '</form></div>';
    showPlace.innerHTML = details;
    newEventModal.style.display = 'block';
}

/**
 * function for removing attende inside from event .
 * @param {object} event
 */
function removeAttende(event) {
    var target = event.target;
    target.parentNode.remove();
}

/**
 * function for deleting existing events
 */
function deleteEvents(event) {
    var target = event.target
    var data = getLocalData();
    var events = data[unique_key] || [];
    if (events.length) {
        events.splice(parseInt(target.dataset.id), 1)
        data[unique_key] = events;
        localStorage.setItem("events", JSON.stringify(data));
        newEventModal.style.display = 'none';
        loadCalender();
    }
}

function cancel() {
    newEventModal.style.display = 'none';
}

/**
 * Function for loading year inside year select box inside calendar grid; 
 */
function loadYears() {
    showingYear = document.getElementById('year');
    var startYear = 1900;
    var endYear = 2040;
    for (var i = startYear, j = 0; i <= endYear; i++, j++) {
        var Addoption = document.createElement("option");
        Addoption.value = i;
        Addoption.innerHTML = i;
        showingYear.options.add(Addoption);
        showingYear.options[j].removeAttribute("selected", "selected");
        if (i == year) showingYear.options[j].setAttribute("selected", "selected");
    }
    showingYear.onchange = () => {
        year = showingYear.value;
        loadCalender();
    }
}

/**
 * Function for changing months by arrow inside calendar grid;
 */
function changeMonthByArrow() {
    document.getElementById('nextButton').addEventListener('click', () => {
        month++;
        if (month > 11) {
            month = 0;
            year += 1;
        }
        loadCalender();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        month--;
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        loadCalender();
    });
}

/**
 * custom split function 
 * @param {string} string
 * @param {string} split
 */
function customSplit(string, split) {
    var arr = [],
        result = '';
    for (var i = 0; i < string.length; i++) {
        if (string[i] === split) {
            arr.push(result);
            result = '';
        } else result += string[i];
    }
    arr.push(result);
    return arr;
}