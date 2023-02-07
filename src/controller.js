const SIMPLE_NOTES_STORAGE_KEY = 'simpleNodes';

const controller = (() => {
    function getAndClearInputNoteTitle() {
        const element = document.getElementById("input-add-note-title")
        const value = element.value;
        element.value = '';
        return value;
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
    }

    function getAndClearTextareaNoteText() {
        const element = document.getElementById("textarea-add-note-text")
        const value = element.value;
        element.value = '';
        return value;
    }

    function createNote({ noteId, title, text }) {
        const existingNotes = document.getElementById("div-existing-notes");
        const existingNoteTemplate = document.getElementById("existing-note-template")
        const newNode = existingNoteTemplate.cloneNode(true);
        newNode.removeAttribute("hidden");
        const elementId = `existing-node-${noteId}`;
        newNode.setAttribute("id", elementId);
        existingNotes.appendChild(newNode);
        document.querySelector(`#${elementId} #existing-note-title`).innerText = title;
        document.querySelector(`#${elementId} #existing-note-text`).innerText = text;
        document.querySelector(`#${elementId} #existing-note-delete-button`).setAttribute("onclick", `controller.deleteNote('${noteId}')`);
        document.querySelector(`#${elementId} #existing-note-edit-button`).setAttribute("onclick", `controller.editNote('${noteId}')`);
    }

    function addNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
        notes.push(note)
        localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    }

    function deleteNoteFromLocalStorage(id) {
        let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
        const foundIndex = notes.findIndex(note => note.noteId === id);
        notes.splice(foundIndex, 1);
        localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    }

    function setInNoteFromLocalStorage(id) {
        let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
        const foundIndex = notes.findIndex(note => note.noteId === id);
        const foundNote = notes[foundIndex];
        document.getElementById("input-add-note-title").value = foundNote.title;
        document.getElementById("textarea-add-note-text").value = foundNote.text;
        document.getElementById("edit-note-button").style.display = "block";
        document.getElementById("edit-note-button").setAttribute("onclick", `controller.updateNote('${id}')`);
        document.getElementById("add-note-button").disabled = true;
        }

    function updateNoteToLocalStorage(noteId) {
        let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
        const foundIndex = notes.findIndex(note => note.noteId === noteId);
        const title = getAndClearInputNoteTitle();
        const text = getAndClearTextareaNoteText();

        if (!title || !text) {
            return;
        }

        notes[foundIndex] = { noteId, title, text };
        localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
        document.getElementById("edit-note-button").style.display = "none";
        document.getElementById("add-note-button").disabled = false;
    }
    
    function addNote() {
        const title = getAndClearInputNoteTitle();
        const text = getAndClearTextareaNoteText();
        
        if (!title || !text) {
            return;
        }
        
        const noteId = new Date().getTime().toString();
        
        addNoteToLocalStorage({ noteId, title, text });
        loadNotes();
    }

    function deleteNote(noteId) {
        deleteNoteFromLocalStorage(noteId);
        loadNotes();
    }
    function editNote(noteId) {
        setInNoteFromLocalStorage(noteId);
    }

    function updateNote(noteId) {
        updateNoteToLocalStorage(noteId);
        loadNotes();
    }
    
    function loadNotes() {
        document.getElementById("div-existing-notes").innerHTML = '';
        const notesString = localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY);
        
        if (!notesString) {
            localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify([]));
        }

        const notes = JSON.parse(notesString);
        notes.forEach(createNote);
    }

    return {
        addNote,
        deleteNote,
        loadNotes,
        editNote,
        toggleTheme,
        updateNote
    }

})();
