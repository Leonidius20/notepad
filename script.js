'use strict'

let currentNoteId = null;
let listItemTemplate = null;
const idListItemMap = new Map();

window.onload = async () => {
    listItemTemplate = await fetchHtml('notes_list_item.html');
    showNoteList();
    document.getElementById('titleBox').addEventListener('input', saveCurrentNode);
    document.getElementById('textBox').addEventListener('input', saveCurrentNode);
    document.getElementById('titleBox').removeAttribute('readonly');
    document.getElementById('textBox').removeAttribute('readonly');
}

async function fetchHtml(path) {
    const response = await fetch(path);
    return await response.text();
}

function saveCurrentNode() {
    const title = document.getElementById('titleBox').value;
    const text = document.getElementById('textBox').value;

    if (currentNoteId === null) {
        currentNoteId = createNote(title, text);
    } else {
        saveNote(currentNoteId, title, text);
    }

    showNoteList();
}

function showNoteList() {
    const notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // deleting existing notes

    for (let note of notes) {
        const item = getTemplatedElement(listItemTemplate, {
            id: note.id,
            title: note.title === ''
                ? '<p class="text-muted">Untitled</p>'
                : escapeHtml(note.title),
            date: new Intl.DateTimeFormat(undefined, {
                hour12: false,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            }).format(note.date),
            content: note.text.slice(0, 20),
        });

        item.getElementById('parentDiv').onclick = (event) => {
            onNoteSelected(note.id);
            event.stopPropagation();
        };

        item.getElementById('delButton').onclick = (event) => {
            onDeleteButtonPressed(note.id);
            event.stopPropagation();
        }

        const element = item.body.firstChild;
        if (currentNoteId === note.id) {
            element.classList.add('active');
        }
        idListItemMap.set(note.id, element);
        notesList.appendChild(element);
    }
}

function onDeleteButtonPressed(id) {
    deleteNote(id);
    if (id === currentNoteId) {
        currentNoteId = null;
        document.getElementById('titleBox').value = '';
        document.getElementById('textBox').value = '';
    }

    const notesList = document.getElementById('notes-list');
    notesList.removeChild(idListItemMap.get(id));
}

function onNoteSelected(id) {
    currentNoteId = id;
    idListItemMap.forEach((value, key) => {
        if (key === id) value.classList.add('active');
        else value.classList.remove('active');
    });
    const note = getNote(id);
    document.getElementById('titleBox').value = note.title;
    document.getElementById('textBox').value = note.text;
}

function onNewNoteButtonPressed() {
    if (document.getElementById('titleBox').value !== ''
        || document.getElementById('textBox').value !== '') {
        saveCurrentNode();
    }
    currentNoteId = null;
    document.getElementById('titleBox').value = '';
    document.getElementById('textBox').value = '';
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}