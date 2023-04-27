const SIMPLE_NOTES_STORAGE_KEY = "simpleNodes";

const controller = (() => {
  function getAndClearInputNoteTitle() {
    const element = document.getElementById("input-add-note-title");
    const value = element.value;
    element.value = "";
    return value;
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const imgElements = document.getElementsByTagName("img");
    for (let i = 0; i < imgElements.length; i++) {
      imgElements[i].classList.toggle("image-dark-mode");
    }
  }

  function getAndClearTextareaNoteText() {
    const element = document.getElementById("textarea-add-note-text");
    const value = element.value;
    element.value = "";
    return value;
  }

  function createNote({ noteId, title, text, time }) {
    const existingNotes = document.getElementById("flex-wrapper");
    const existingNoteTemplate = document.getElementById(
      "existing-note-template"
    );
    const newNode = existingNoteTemplate.cloneNode(true);
    const elementId = `existing-node-${noteId}`;
    newNode.setAttribute("id", elementId);
    existingNotes.appendChild(newNode);
    document.querySelector(`#${elementId} #existing-note-title`).innerText =
      title;
    document.querySelector(`#${elementId} #existing-note-text`).innerText =
      text;
    document.querySelector(`#${elementId} #existing-note-date`).innerText =
      time;
    document
      .querySelector(`#${elementId} #existing-note-delete-button`)
      .setAttribute("onclick", `controller.deleteNote('${noteId}')`);
    document
      .querySelector(`#${elementId} #existing-note-edit-button`)
      .setAttribute("onclick", `controller.editNote('${noteId}')`);
  }

  function createNoteList({noteId, title, time}) {
    const existingNotes = document.getElementById("note-list-wrapper");
    const existingNoteTemplate = document.getElementById("existing-notes-list-template");
    const newNode = existingNoteTemplate.cloneNode(true);
    const elementId = `existing-node-list-${noteId}`;
    newNode.setAttribute("id", elementId);
    existingNotes.appendChild(newNode);
    document.querySelector(`#${elementId} #existing-note-list-title`).innerText =
      title;
    document.querySelector(`#${elementId} #existing-note-list-date`).innerText =
      time;
    document.querySelector(`#${elementId}`).setAttribute("onclick", `controller.highlightAndScrollToDiv('existing-node-${noteId}')`);
  }

  function addNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    notes.push(note);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
  }

  function deleteNoteFromLocalStorage(id) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const foundIndex = notes.findIndex((note) => note.noteId === id);
    notes.splice(foundIndex, 1);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
  }

  function setInNoteFromLocalStorage(id) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const foundIndex = notes.findIndex((note) => note.noteId === id);
    const foundNote = notes[foundIndex];
    document.getElementById("input-add-note-title").value = foundNote.title;
    document.getElementById("textarea-add-note-text").value = foundNote.text;
    document.getElementById("edit-note-button").style.display = "block";
    document.getElementById("edit-note-button").setAttribute("onclick", `controller.updateNote('${id}')`);
    document.getElementById("add-note-button").style.display = "none";
  }

  function updateNoteToLocalStorage(noteId) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const foundIndex = notes.findIndex((note) => note.noteId === noteId);
    const title = getAndClearInputNoteTitle();
    const text = getAndClearTextareaNoteText();
    const time = getFormattedDate();

    if (!title || !text) {
      return;
    }

    notes[foundIndex] = { noteId, title, text, time};
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    document.getElementById("edit-note-button").style.display = "none";
    document.getElementById("add-note-button").style.display = "block";
  }

  function getFormattedDate() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
  }

  function addNote() {
    const title = getAndClearInputNoteTitle();
    const text = getAndClearTextareaNoteText();
    const time = getFormattedDate();

    if (!title || !text) {
      return;
    }
    autoResize();

    const noteId = new Date().getTime().toString();

    addNoteToLocalStorage({ noteId, title, text, time });
    loadNotes();
  }

  function deleteNote(noteId) {
    deleteNoteFromLocalStorage(noteId);
    loadNotes();
  }
  function editNote(noteId) {
    setInNoteFromLocalStorage(noteId);
    autoResize();
  }

  function updateNote(noteId) {
    updateNoteToLocalStorage(noteId);
    loadNotes();
    autoResize();
  }

  function loadNotes() {
    const elements = document.getElementsByClassName("notes-container");
    const length = elements.length;
    for (let i = length - 1; i > 0; i--) {
      elements[i].remove();
    }
    document.getElementById('note-list-wrapper').innerHTML = '';
    const notesString = localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY);

    if (!notesString) {
      localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify([]));
    }

    const notes = JSON.parse(notesString);
    if (notes.length == null) {
      return;
    }
    for (let i = 0; i < notes.length; i++) {
      createNote(notes[i]);
      createNoteList(notes[i]);
    }
  }

  function autoResize() {
    const textarea = document.getElementById("textarea-add-note-text");
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  function highlightAndScrollToDiv(divId) {
    const element = document.getElementById(divId);
    if (element) {
      const leftOffset = element.offsetLeft - 20;
      background = element.style.backgroundColor;
      if (document.body.classList.contains("dark-mode")){
        element.style.backgroundColor = "#383838";
      }
      else {
        element.style.backgroundColor = "d4d4d4";
      }
      window.scroll(leftOffset, 0)
      setTimeout(function(){
        element.style.backgroundColor = background;
      }, 1000);
    }
  }
  
  function deleteAll() {
    document.getElementById("delete-confirm").classList.remove("hidden");
    document.getElementById("delete-confirm").classList.add("delete-confirm");
    loadNotes();
  }

  function deleteAllConfirm() {
    document.getElementById("delete-confirm").classList.add("hidden");
    document.getElementById("delete-confirm").classList.remove("delete-confirm");
    window.localStorage.clear();
    loadNotes();
  }

  function deleteAllCancel() {
    document.getElementById("delete-confirm").classList.add("hidden");
    document.getElementById("delete-confirm").classList.remove("delete-confirm");
  }

  return {
    addNote,
    deleteNote,
    loadNotes,
    editNote,
    toggleTheme,
    updateNote,
    autoResize,
    getFormattedDate,
    highlightAndScrollToDiv,
    deleteAll,
    deleteAllConfirm,
    deleteAllCancel
  };
})();
