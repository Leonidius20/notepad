'use strict'

/**
 * Add a new note to the list of notes
 * @param title title of the note
 * @param text contents of the note
 * @returns saved note
 */
function createNote(title, text) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    const id = notes.length;
    notes[id] = {
        id,
        title,
        text,
        date: Date.now()
    };
    window.localStorage.setItem('notes', JSON.stringify(notes));
    return notes[id];
}

/**
 * Saves changes made to the note with a specified id
 * @param id id of the changed note
 * @param title new title of the note
 * @param text new contents of the note
 * @returns updated note
 */
function saveNote(id, title, text) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];

    // trying to find a note with the specified id
    let note;
    for (let i = 0, n = notes.length; i < n; i++) {
        if (notes[i].id === id) {
            notes[i] = {
                id,
                title,
                text,
                date: Date.now()
            };
            note = notes[i];
            break;
        }
    }

    window.localStorage.setItem('notes', JSON.stringify(notes));
    return note;
}

/**
 * Finds and returns the note object with a specified id
 * @param id id of the note to return
 * @returns object note object
 */
function getNote(id) {
    const notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    return notes.find(note => note.id === id);
}

/**
 * Deletes the note with a specified id
 * @param id
 */
function deleteNote(id) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    window.localStorage.setItem('notes', JSON.stringify(notes));
}