var addNoteTitle = document.querySelector("#addNoteTitle"),
    addNoteContent = document.querySelector("#addNoteContent"), 
    addNoteButton = document.querySelector("#addNoteButton");

addNoteButton.addEventListener("click", function(event) {
    var noteTitleValue = addNoteTitle.value;
    var noteContentValue = addNoteContent.value;
    console.log(noteTitleValue);
    console.log(noteContentValue);
})


////////////////////////////////////////////////
/////////// CZĘŚĆ PREZENTACYJNA ////////////////
function note(title, noteContent, priorityClass) {
    this.title = title;
    this.noteContent = noteContent;
    this.priorityClass = priorityClass;
    this.isCompleted = false;
    this.id = note.UID++;
}
note.UID = 1;



var Notes = [
    new note("tytul1", "tresc1", "notelow"),
    new note("tytul2", "tresc2", 'notehigh'),
    new note("tytul3", "tresc3", "notelow"),
    new note("tytul4", "tresc4")
]; 



var showNotes = (function(renderer) {

    var sectionNotesList = null;

    renderer.renderList = function(Notes) {
        createSectionNotes();

        for (var i = 0; i<Notes.length; i++) {
            createNote(Notes[i]);
        }
    };

    function createSectionNotes() {
        if (!sectionNotesList) {
            sectionNotesList = document.querySelector(".notes");
        }
        else {
            clearNotes();
        }
    }

    function clearNotes() {
        while (sectionNotesList.firstChild) {
            sectionNotesList.removeChild(sectionNotesList.firstChild);
        }
    }

    function createNote(note) {
        sectionNotesList.innerHTML += createNoteFromTemplate(note);
    }

    function createNoteFromTemplate(note) {
        
        return `<article class="note ${note.priorityClass}">
        <header><h2>${note.title}</h2></header>
        <p>${note.noteContent}</p>
        <footer>
          <section class=noteMenuButton>
            <input type="checkbox" class="noteMenuInput">
            <label tabindex="0"><div></div><div></div><div></div></label>              
            <span class="hiddenSpan"></span>
            <nav class="noteMenu">
              <input type="button" value="Edytuj"> 
              <input type="button" value="Usuń">
              <input type="button" value="Zmień priorytet"> 
              <input type="button" value="Oznacz jako zrobione"> 
            </nav>
          </section>
        </footer>
        </article>`;
    }


    return renderer;

})(showNotes || {});

showNotes.renderList(Notes);



// /////////////////////////////////////////////
// //////////// logika aplikacji ///////////////

// var notepadApp = (function(app) {

//     var notes = [];

//     app.getNotes = function() {
//         return notes;
//     }
//     app.addNote = function(noteTitle) {
//         notes.push(new note(noteTitle));
//     }
//     app.deleteNotes = function(noteId) {
//         notes = notes.filter(function(note) {
//         return note.id !== noteId;
//         });
//     }   
//     app.changeOption = function(isCompleted, noteId) {
//         var note = notes.filter(function(note) {
//             return note.id === noteId;
//         })[0];
//         note.isCompleted = isCompleted;
//     }
//     return app;
// })(notepadApp || {})


// var pokaNotke = (function(poka) {
    
//     poka.getNotes = function() {
//         return app.getNotes();
//     }
//     poka.addNote = function() {
//         app.addNotes(addNoteTitle.value);
//         addNoteTitle.value = "";
//     }
//     poka.deleteNotes = function(noteId) {
//         app.deleteNotes(noteId);
//     }   
//     poka.changeOption = function(isCompleted, noteId) {
//         app.changeOption(checkbox.checked, noteId);
//     }
//     return poka;

// })(pokaNotke || {})