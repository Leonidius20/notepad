'use strict'

/**
 * Add a new note to the list of notes
 * @param title title of the note
 * @param text contents of the note
 * @returns saved note
 */
function createNote(title, text) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];

    let id;
    for (id = 0; ; id++) {
        if (notes[id] == null) break;
    }

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
 * Saves changes made to the note with the specified id
 * @param id id of the changed note
 * @param title new title of the note
 * @param text new contents of the note
 * @returns updated note
 */
function saveNote(id, title, text) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];

    // trying to find a note with the specified id
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
 * Finds and returns the note object with the specified id
 * @param id id of the note to return
 * @returns object note object if a note with such an id exists,
 *          undefined otherwise
 */
function getNote(id) {
    const notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    return notes[id];
}

/**
 * Deletes the note with the specified id
 * @param id
 */
function deleteNote(id) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    delete notes[id];
    window.localStorage.setItem('notes', JSON.stringify(notes));
}

/**
 * Retrieve all saved notes
 * @returns array of notes
 */
function getAllNotes() {
    const notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    return notes
        .filter(note => note !== null && note !== undefined)
        .sort((note1, note2) => {
            if (note1.date > note2.date) return -1;
            if (note1.date < note2.date) return 1;
            else return 0;
        });
}