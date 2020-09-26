'use strict'

let currentNoteId = null;
let listItemTemplate = null;

window.onload = async () => {
    listItemTemplate = await fetchHtml('notes_list_item.html');
    await showNoteList();
    document.getElementById('titleBox').addEventListener('input', saveCurrentNode);
    document.getElementById('textBox').addEventListener('input', saveCurrentNode);
    document.getElementById('titleBox').removeAttribute('readonly');
    document.getElementById('textBox').removeAttribute('readonly');
}

function saveCurrentNode() {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    if (currentNoteId === null) {
        currentNoteId = notes.length;
        notes[notes.length] = {
            id: currentNoteId,
            title: document.getElementById('titleBox').value,
            text: document.getElementById('textBox').value,
            date: Date.now(),
        };
    } else {
        for (let i = 0, n = notes.length; i < n; i++) {
            if (notes[i].id === currentNoteId) {
                notes[i].title = document.getElementById('titleBox').value;
                notes[i].text = document.getElementById('textBox').value;
                notes[i].date = Date.now();
            }
        }
    }

    window.localStorage.setItem('notes', JSON.stringify(notes));
    showNoteList();
}

function showNoteList() {
    const notes = JSON.parse(window.localStorage.getItem('notes') || []);
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // deleting existing notes
    for (let note of notes) {
        notesList.appendChild(getNoteTitleCard(note.id, note.title, note.date, note.text.slice(0, 20)));
    }
}

function getNoteTitleCard(id, title, date, shortContent) {
    const parser = new DOMParser();
    const domString = getNotesListItem( {
        id: id,
        title: title === '' ? '<p class="text-muted">Untitled</p>' : escapeHtml(title),
        date: new Intl.DateTimeFormat(undefined, {
            hour12: false,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }).format(date),
        content: shortContent,
    });
    const html = parser.parseFromString(domString, 'text/html');
    html.getElementById('delButton').onclick = (event) => {
        deleteNote(id);
        event.stopPropagation();
    }
    return html.body.firstChild;
}

function getNote(id) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    return notes.find(note => note.id === id);
}

function deleteNote(id) {
    console.log('deleting a node ' + id);
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    window.localStorage.setItem('notes', JSON.stringify(notes));
    if (id === currentNoteId) {
        currentNoteId = null;
        document.getElementById('titleBox').value = '';
        document.getElementById('textBox').value = '';
    }
    showNoteList();
}

function showNote(id) {
    currentNoteId = id;
    const note = getNote(id);
    document.getElementById('titleBox').value = note.title;
    document.getElementById('textBox').value = note.text;
}

function newNote() {
    if (document.getElementById('titleBox').value !== ''
        || document.getElementById('textBox').value !== '') {
        saveCurrentNode();
    }
    currentNoteId = null;
    document.getElementById('titleBox').value = '';
    document.getElementById('textBox').value = '';
}

function getNotesListItem(replacements) {
    let template = listItemTemplate.slice();
    for (const replacement in replacements) {
        template = template.replace('${' + replacement + "}", replacements[replacement]);
    }
    return template;
}

async function fetchHtml(path) {
    const response = await fetch(path);
    return await response.text();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}