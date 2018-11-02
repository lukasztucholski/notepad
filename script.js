const addNoteTags = document.querySelector(".form__text-input");
const addNoteContent = document.querySelector(".form__textarea");
const addNoteButton = document.querySelector(".form__button");
const sectionNotes = document.querySelector(".notes-container");
const tagsList = document.querySelector(".sidebar__tags-statistics");
const notesList = document.querySelector(".sidebar__notes-statistics");

const lowPriorityInput = document.querySelector("#lowpriority");
const normalPriorityInput = document.querySelector("#normalpriority");
const highPriorityInput = document.querySelector("#highpriority");

const numbOfNotes = document.querySelector(".sidebar__span--number-of-notes");

const lowPriorityClass = "note--lowpriority";
const highPriorityClass = "note--highpriority";
const defaultPriorityClass = "note";
const markAsDoneClass = "note--markasdone";

let noteID = 0;
let allOfNotes = [];
let allOfTags = [];
let allOfPriority = [];

(function () {
    let keys = Object.keys(localStorage);
    console.log(keys.length);
    for (i = 1; i <= keys.length; i++) {
        loadFromStorage(i);
    }
    let LastID = localStorage.getItem("LastID");
    noteID = LastID;
    refreshStatistics();
})();

function loadFromStorage(nr) {
    let content = localStorage.getItem(`${nr}note-content`);
    let date = localStorage.getItem(`${nr}note-date`);
    let priority = localStorage.getItem(`${nr}note-priority`);
    let tags = localStorage.getItem(`${nr}note-tags`);
    let notenumb = localStorage.getItem(`${nr}note-id`);

    if (content && date && priority && tags && notenumb) {
        let newNoteFromConstructor = new NoteConstructor(tags, content, priority, notenumb, date);
        sectionNotes.insertBefore(newNoteFromConstructor, sectionNotes.firstChild);
        allOfNotes.push(newNoteFromConstructor);
        allOfPriority.push(newNoteFromConstructor.dataset.priority);
    }
}

function newNote() {
    let noteTagsValue = addNoteTags.value;
    let noteContentValue = addNoteContent.value;

    if (noteTagsValue.length == 0 || noteContentValue.length == 0) {
        console.log("Nie wypełniono wszystkich pól formularza!");
    } else {
        let priority = getPriority(lowPriorityInput, highPriorityInput);
        let tags = noteTagsValue.split(" ");
        allOfTags = allOfTags.concat(tags);
        noteID++;
        let date = actualDate();
        let newNoteFromConstructor = new NoteConstructor(noteTagsValue, noteContentValue, priority, noteID, date);
        sectionNotes.insertBefore(newNoteFromConstructor, sectionNotes.firstChild);
        allOfNotes.push(newNoteFromConstructor);
        allOfPriority.push(newNoteFromConstructor.dataset.priority);

        localStorage.setItem(`${noteID}note-id`, noteID);
        localStorage.setItem(`${noteID}note-date`, date);
        localStorage.setItem(`${noteID}note-priority`, priority);
        localStorage.setItem(`${noteID}note-tags`, noteTagsValue);
        localStorage.setItem(`${noteID}note-content`, noteContentValue);
        localStorage.setItem("LastID", noteID);

        refreshStatistics();
        clearForm();
    }
}

function getPriority(low, high) {
    let priority;
    if (low.checked == true) {
        priority = lowPriorityClass;
    } else if (high.checked == true) {
        priority = highPriorityClass;
    } else {
        priority = defaultPriorityClass;
    }
    return priority
}

function NoteConstructor(tags, content, priority, idOfNote, date) {
    let newNoteArticle = document.createElement("article");
    newNoteArticle.setAttribute("id", `${idOfNote}`);
    newNoteArticle.setAttribute("data-priority", `${priority}`);
    newNoteArticle.setAttribute("class", defaultPriorityClass);
    if (priority == "archived") {
        newNoteArticle.classList.add(markAsDoneClass);
    } else {
        newNoteArticle.classList.add(`${priority}`);
    }
    newNoteArticle.setAttribute("data-tag", `${tags}`);

    let newNoteHeader = document.createElement("header");
    newNoteHeader.setAttribute("class", "note__header");
    newNoteArticle.appendChild(newNoteHeader);

    let newNoteDate = document.createElement("p");
    newNoteDate.setAttribute("class", "note__date");
    newNoteDate.textContent = `${date}`;
    newNoteHeader.appendChild(newNoteDate);

    let newNoteTags = document.createElement("p");
    newNoteTags.setAttribute("class", "note__tags");
    newNoteTags.textContent = `${tags}`;
    newNoteHeader.appendChild(newNoteTags);

    let newNoteParagraph = document.createElement("p");
    newNoteParagraph.setAttribute("class", "note__content");
    newNoteParagraph.textContent = `${content}`;
    newNoteArticle.appendChild(newNoteParagraph);

    let newNoteFooter = document.createElement("footer");
    newNoteFooter.setAttribute("class", "note__footer");
    newNoteArticle.appendChild(newNoteFooter);

    let newNoteMenuDiv = document.createElement("div");
    newNoteMenuDiv.setAttribute("class", "note__menu-div");
    newNoteMenuDiv.innerHTML = `<span class="note__menu-span"></span><span class="note__menu-span"></span><span class="note__menu-span"></span>`;
    newNoteFooter.appendChild(newNoteMenuDiv);

    return newNoteArticle
}

function clearForm() {
    addNoteTags.value = "";
    addNoteContent.value = "";
    normalPriorityInput.checked = true;
}

function removeNote(e) {
    let note = e.target.closest(`.${defaultPriorityClass}`);
    let noteDataAttr = note.dataset.priority;
    let tagsParagraph = note.querySelector(".note__tags").textContent;
    let tagsArray = tagsParagraph.split(" ");
    removeNoteAllTags(allOfTags, tagsArray);
    removeElementFromArray(allOfPriority, noteDataAttr);
    removeElementFromArray(allOfNotes, note);
    refreshStatistics();
    note.remove();

    localStorage.removeItem(`${note.id}note-id`);
    localStorage.removeItem(`${note.id}note-date`);
    localStorage.removeItem(`${note.id}note-priority`);
    localStorage.removeItem(`${note.id}note-tags`);
    localStorage.removeItem(`${note.id}note-content`);
}

function editNote(e) {
    let note = e.target.closest(`.${defaultPriorityClass}`);
    let actualTags = note.querySelector(".note__tags");
    let actualContent = note.querySelector(".note__content");

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = `<input class="edit__text-input" id="editTags" type="text" name="editnotetitle" value="${actualTags.textContent}">
    <textarea class="edit__textarea" id="editContent" name="editnotecontent">${actualContent.textContent}</textarea>
    <input type="button" class="default-button" id="editNoteButton" value="Aktualizuj">
    <input type="button" class="default-button" id="cancelEditNoteButton" value="Anuluj">`;
    tempDiv.setAttribute("class", "note--edit-window");
    note.appendChild(tempDiv);

    const editButton = tempDiv.querySelector("#editNoteButton");
    const cancelButton = tempDiv.querySelector("#cancelEditNoteButton");
    const noteTags = tempDiv.querySelector("#editTags");
    const noteContent = tempDiv.querySelector("#editContent");

    function edit() {
        localStorage.removeItem(`${note.id}note-tags`);
        localStorage.removeItem(`${note.id}note-content`);

        let tagsParagraph = actualTags.textContent;
        let tagsArray = tagsParagraph.split(" ");
        removeNoteAllTags(allOfTags, tagsArray);
        actualTags.textContent = noteTags.value;
        actualContent.textContent = noteContent.value;
        tagsArray = noteTags.value.split(" ");
        allOfTags = allOfTags.concat(tagsArray);
        note.dataset.tag = actualTags.textContent;

        localStorage.setItem(`${note.id}note-tags`, note.dataset.tag);
        localStorage.setItem(`${note.id}note-content`, actualContent.textContent);

        tempDiv.remove();
        refreshStatistics();
    }
    function cancel() {
        tempDiv.remove();
    }

    editButton.addEventListener("click", edit);
    cancelButton.addEventListener("click", cancel);
}

function changeNotePriority(e) {
    let note = e.target.closest(`.${defaultPriorityClass}`);
    let noteDataAttr = note.dataset;
    removeElementFromArray(allOfPriority, noteDataAttr.priority);
    localStorage.removeItem(`${note.id}note-priority`);

    if (noteDataAttr.priority == defaultPriorityClass) {
        note.classList.add(lowPriorityClass);
        noteDataAttr.priority = lowPriorityClass;
    }
    else if (noteDataAttr.priority == lowPriorityClass) {
        note.className = defaultPriorityClass;
        note.classList.add(highPriorityClass);
        noteDataAttr.priority = highPriorityClass;
    }
    else if (noteDataAttr.priority == highPriorityClass) {
        note.className = defaultPriorityClass;
        noteDataAttr.priority = defaultPriorityClass;
    }

    localStorage.setItem(`${note.id}note-priority`, noteDataAttr.priority);
    allOfPriority.push(noteDataAttr.priority);
    refreshStatistics();
}

function markNoteAsDone(e) {
    let note = e.target.closest(`.${defaultPriorityClass}`);
    let noteDataAttr = note.dataset;
    removeElementFromArray(allOfPriority, noteDataAttr.priority);
    localStorage.removeItem(`${note.id}note-priority`);

    if (noteDataAttr.priority != "archived") {
        note.classList.add(markAsDoneClass);
        noteDataAttr.priority = "archived";
        e.target.textContent = "Oznacz jako do zrobienia";
    } else if (noteDataAttr.priority == "archived") {
        note.classList.remove(markAsDoneClass);
        noteDataAttr.priority = defaultPriorityClass;
        note.className = defaultPriorityClass;
        e.target.textContent = "Oznacz jako skończone";
    }

    localStorage.setItem(`${note.id}note-priority`, noteDataAttr.priority);
    allOfPriority.push(noteDataAttr.priority);
    refreshStatistics();
}

function showMenuNote(e) {
    if (e.target.className == "note__menu-div") {
        e.target.classList.add("note__menu-div--click");
        let noteFooter = e.target.closest(".note__footer");
        newNoteMenuUlList(noteFooter);
    } else {
        if (document.querySelector(".note__menu-div--click")) {
            let noteFooter = document.querySelector(".note__menu-div--click");
            noteFooter.classList.remove("note__menu-div--click");
        }

        if (document.querySelector(".note__menu-ul")) {
            let noteUL = document.querySelector(".note__menu-ul");
            noteUL.remove();
        }
    }
}

function newNoteMenuUlList(e) {
    let noteDataAttr = e.closest(`.${defaultPriorityClass}`).dataset.priority;

    let newMenuUlList = document.createElement("ul");
    newMenuUlList.setAttribute("class", "note__menu-ul");

    let newMenuLI1 = document.createElement("li");
    newMenuLI1.setAttribute("class", "note__menu-li note__menu-li-remove");
    newMenuLI1.textContent = "Usuń";
    newMenuUlList.appendChild(newMenuLI1);

    let newMenuLI2 = document.createElement("li");
    newMenuLI2.setAttribute("class", "note__menu-li note__menu-li-edit");
    newMenuLI2.textContent = "Edytuj";
    newMenuUlList.appendChild(newMenuLI2);

    let newMenuLI3 = document.createElement("li");
    newMenuLI3.setAttribute("class", "note__menu-li note__menu-li-changepriority");
    newMenuLI3.textContent = "Zmień priorytet";
    newMenuUlList.appendChild(newMenuLI3);

    let newMenuLI4 = document.createElement("li");
    newMenuLI4.setAttribute("class", "note__menu-li note__menu-li-markasdone");

    if (noteDataAttr == "archived") {
        newMenuLI4.textContent = "Oznacz jako do zrobienia";
    } else {
        newMenuLI4.textContent = "Oznacz jako skończone";
    }

    newMenuUlList.appendChild(newMenuLI4);
    e.appendChild(newMenuUlList);

    newMenuLI1.addEventListener("click", removeNote);
    newMenuLI2.addEventListener("click", editNote);
    newMenuLI3.addEventListener("click", changeNotePriority);
    newMenuLI4.addEventListener("click", markNoteAsDone);
}


function actualDate() {
    let date = new Date();
    let dayOfWeek = date.getDay();
    let dayOfMonth = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let min = date.getMinutes();
    let minutes = (min > 9) ? min : "0" + min;


    switch (dayOfWeek) {
        case 0: {
            dayOfWeek = "Niedziela";
            break;
        }
        case 1: {
            dayOfWeek = "Poniedziałek";
            break;
        }
        case 2: {
            dayOfWeek = "Wtorek";
            break;
        }
        case 3: {
            dayOfWeek = "Środa";
            break;
        }
        case 4: {
            dayOfWeek = "Czwartek";
            break;
        }
        case 5: {
            dayOfWeek = "Piątek";
            break;
        }
        case 6: {
            dayOfWeek = "Sobota";
            break;
        }
        default: {
            console.log("Błąd");
        }
    }
    return `${dayOfWeek}, ${dayOfMonth}.${month}.${year}, godz. ${hour}:${minutes}`
}

// S T A T I S T I C S 

function refreshStats(whereStatsInDom, arrayWithElementsToGetStats) {
    removeStatsList(whereStatsInDom);
    let statisticsObject = buildStatistics(arrayWithElementsToGetStats);
    for (let property in statisticsObject) {
        let attribute = property;
        let value = statisticsObject[property];
        BuildStatsLi(attribute, value, whereStatsInDom);
    }
}

function refreshStatistics() {
    refreshStats(notesList, allOfPriority);
    refreshStats(tagsList, allOfTags);
    refreshNumbOfNotes();
}

function removeStatsList(domElement) {
    while (domElement.firstChild) {
        domElement.removeChild(domElement.firstChild);
    }
}
function removeElementFromArray(myArray, myElement) {
    tempVar = myArray.indexOf(myElement);
    if (tempVar > -1) {
        myArray.splice(tempVar, 1);
    }
}
function removeNoteAllTags(mainArray, removeArray) {
    for (let i = 0; i < removeArray.length; i++) {
        if (mainArray.filter(function (item) { return item == removeArray[i]; })) {
            mainArray.splice(removeArray[i], 1);
        }
    }
}

function buildStatistics(array) {
    let statisticsObject = {};
    for (var i = 0; i < array.length; i++) {
        let attribute = array[i];
        let isExist = statisticsObject.hasOwnProperty(attribute);
        if (isExist) {
            statisticsObject[attribute] += 1;
        } else {
            statisticsObject[attribute] = 1;
        }
    }
    return statisticsObject
}
function BuildStatsLi(elementAttribute, elementCount, domParent) {
    let newStatsDomElement = document.createElement("li");
    newStatsDomElement.setAttribute("class", "sidebar__li");
    newStatsDomElement.setAttribute("data-tag", `${elementAttribute}`);

    if (elementAttribute == lowPriorityClass) {
        elementAttribute = "Niski priorytet";
    } else if (elementAttribute == highPriorityClass) {
        elementAttribute = "Wysoki priorytet";
    } else if (elementAttribute == defaultPriorityClass) {
        elementAttribute = "Zwykły priorytet";
    } else if (elementAttribute == "archived") {
        elementAttribute = "Zarchiwizowane";
    }

    newStatsDomElement.textContent = `${elementAttribute}: ${elementCount}`;
    newStatsDomElement.addEventListener("click", statsEvent);
    domParent.appendChild(newStatsDomElement);
}

function statsEvent() {
    let tag = this.dataset.tag;
    if (tag == lowPriorityClass || tag == highPriorityClass || tag == defaultPriorityClass) {
        for (let i = 0; i < allOfNotes.length; i++) {
            let dataPriority = allOfNotes[i].dataset.priority;
            allOfNotes[i].classList.remove("hideContent");
            if (this.dataset.tag != dataPriority) {
                allOfNotes[i].classList.add("hideContent");
                if (dataPriority == "archived") {
                    allOfNotes[i].classList.remove("showArchived");
                    allOfNotes[i].classList.remove("hideContent");
                }
            }
        }
    } else if (tag == "archived") {
        for (let i = 0; i < allOfNotes.length; i++) {
            let dataPriority = allOfNotes[i].dataset.priority;

            if (dataPriority == "archived") {
                allOfNotes[i].classList.add("showArchived");
            }
            else {
                allOfNotes[i].classList.add("hideContent");
            }
        }
    } else {
        for (let i = 0; i < allOfNotes.length; i++) {
            let dataPriority = allOfNotes[i].dataset.priority;
            if (this.dataset.tag != dataPriority) {
                let dataTags = allOfNotes[i].dataset.tag.split(" ");
                allOfNotes[i].classList.remove("hideContent");
                if (dataTags.indexOf(this.dataset.tag) == -1) {
                    allOfNotes[i].classList.add("hideContent");
                    if (dataPriority == "archived") {
                        allOfNotes[i].classList.remove("showArchived");
                        allOfNotes[i].classList.remove("hideContent");
                    }
                }
            }
        }
    }
}

function refreshNumbOfNotes() {
    numbOfNotes.textContent = allOfNotes.length;
}
function refreshSorting() {
    for (let i = 0; i < allOfNotes.length; i++) {
        allOfNotes[i].classList.remove("hideContent");
        if (allOfNotes[i].dataset.priority == "archived") {
            allOfNotes[i].classList.remove("showArchived");
        }
    }
}

addNoteButton.addEventListener("click", newNote);
sectionNotes.addEventListener("click", showMenuNote);
numbOfNotes.parentNode.addEventListener("click", refreshSorting);
