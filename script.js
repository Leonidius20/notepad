'use strict'

let currentNoteId = null;
let listItemTemplate = null;
const idListItemMap = new Map();

window.onload = async () => {
    listItemTemplate = await fetchHtml('notes_list_item.html');
    showNoteList();
    onHashChange();
    document.getElementById('titleBox').addEventListener('input', saveCurrentNode);
    document.getElementById('textBox').addEventListener('input', saveCurrentNode);
    document.getElementById('titleBox').removeAttribute('readonly');
    document.getElementById('textBox').removeAttribute('readonly');
}

window.onhashchange = onHashChange;

function onHashChange() {
    const hash = window.location.hash.slice(1);
    if (hash === '') {
        if (currentNoteId !== null) { // there's a note open
            clearEditor();            // closing the open note
        } else return;
    }
    showNote(parseInt(hash, 10));
}

async function fetchHtml(path) {
    const response = await fetch(path);
    return await response.text();
}

function saveCurrentNode() {
    const title = document.getElementById('titleBox').value;
    const text = document.getElementById('textBox').value;

    let note;
    if (currentNoteId === null) {
        note = createNote(title, text);
        currentNoteId = note.id;

        const element = createItemListItem(note);
        element.classList.add('active');
        idListItemMap.set(note.id, element);
        document.getElementById('notes-list').appendChild(element);
    } else {
        note = saveNote(currentNoteId, title, text);
        const element = idListItemMap.get(currentNoteId);
        fillItemListItem(element, note);
    }
}

function showNoteList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // deleting existing notes

    for (let note of getAllNotes()) {
        const element = createItemListItem(note);
        if (currentNoteId === note.id) {
            element.classList.add('active');
        }
        idListItemMap.set(note.id, element);
        notesList.appendChild(element);
    }
}

function createItemListItem(note) {
    const parser = new DOMParser();
    const item = parser.parseFromString(listItemTemplate, 'text/html');

    fillItemListItem(item, note);

    item.getElementById('parentDiv').onclick = () => {
        onNotesListItemClicked(note.id);
    };

    item.getElementById('delButton').onclick = (event) => {
        onDeleteButtonPressed(note.id);
        event.stopPropagation();
    }

    return item.body.firstChild;
}

function fillItemListItem(element, note) {
    if (note.title === '') {
        element.querySelector('#title').innerHTML = '<p class="text-muted">Untitled</p>';
    } else element.querySelector('#title').innerText = note.title;

    element.querySelector('#date').innerText =
        new Intl.DateTimeFormat(undefined, {
            hour12: false,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }).format(note.date);
    element.querySelector('#content').innerText = note.text.slice(0, 20);
}

function onDeleteButtonPressed(id) {
    deleteNote(id);

    if (id === currentNoteId) {
        clearEditor();
    }

    const notesList = document.getElementById('notes-list');
    notesList.removeChild(idListItemMap.get(id));
}

function onNotesListItemClicked(id) {
    // this triggers onHashChange and showNote() is called
    window.location.hash = id;
}

function showNote(id) {
    const note = getNote(id);

    if (note === undefined) {
        clearEditor();
        return;
    }

    currentNoteId = id;
    idListItemMap.forEach((value, key) => {
        if (key === id) value.classList.add('active');
        else value.classList.remove('active');
    });

    document.getElementById('titleBox').value = note.title;
    document.getElementById('textBox').value = note.text;
}

function onNewNoteButtonPressed() {
    if (document.getElementById('titleBox').value !== ''
        || document.getElementById('textBox').value !== '') {
        saveCurrentNode();
    }
    clearEditor();
}

function clearEditor() {
    idListItemMap.forEach((item) => {
        item.classList.remove('active');
    });
    currentNoteId = null;
    document.getElementById('titleBox').value = '';
    document.getElementById('textBox').value = '';
    window.location.hash = '';
}