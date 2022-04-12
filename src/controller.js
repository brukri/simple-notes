const SIMPLE_NOTES_STORAGE_KEY = 'simpleNodes';

const controller = (() => {
    function getAndClearInputNoteTitle() {
        const element = document.getElementById("input-add-note-title")
        const value = element.value;
        element.value = '';
        return value;
    }

    function getAndClearTextareaNoteText() {
        const element = document.getElementById("textarea-add-note-text")
        const value = element.value;
        element.value = '';
        return value;
    }

    function createNote({noteId, title, text}) {
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
    }

    function addNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
        notes.push(note)
        // TODO: Add missing code to update the localStorage
    }

    function deleteNoteFromLocalStorage({id}) {
        let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));

        const foundIndex = notes.indexOf(id);
        notes.splice(foundIndex, 1);
        localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    }

    function addNote() {
        const title = getAndClearInputNoteTitle();
        const text = getAndClearTextareaNoteText();

        if(!title || !text) {
            return;
        }

        const noteId = new Date().getTime().toString();

        addNoteToLocalStorage({noteId, title, text});
        // TODO: Add missing code to rerender the existing notes.
    }

    function deleteNote(noteId) {
        deleteNoteFromLocalStorage(noteId);
        // TODO: Add missing code to rerender the existing notes.
    }

    function loadNotes() {
        document.getElementById("div-existing-notes").innerHTML = '';
        const notesString = localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY);

        if(!notesString) {
            localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify([]));
        }

        const notes = JSON.parse(notesString);
        notes.forEach(createNote);
    }

    return {
        addNote,
        deleteNote,
        loadNotes
    }

})();
