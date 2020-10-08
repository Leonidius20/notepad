'use strict'

let currentNoteId = null;
let listItemTemplate = null;
const idListItemMap = new Map();

window.onload = async () => {
    listItemTemplate = await fetchHtml('notes_list_item.html');
    showNoteList();
    onHashChange();

    const textBox = document.getElementById('textBox');
    const titleBox = document.getElementById('titleBox');
    textBox.addEventListener('input', saveCurrentNode);
    titleBox.addEventListener('input', saveCurrentNode);
    textBox.removeAttribute('readonly');
    titleBox.removeAttribute('readonly');
}

window.onhashchange = onHashChange;

function onHashChange() {
    const hash = window.location.hash.slice(1);
    if (hash === '') {
        if (currentNoteId !== null) { // there's a note open
            clearEditor();            // closing the open note
        } else return;
    }
    showNote(hash);
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
        document.getElementById('notes-list').prepend(element);
        window.location.hash = currentNoteId;
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
        }).format(note.date);
    element.querySelector('#content').innerText = note.text.slice(0, 20).replaceAll('\n', ' ');
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
        if (key === id) {
            highlightListItem(value);
        }
        else {
            deHighlightListItem(value);
        }
    });

    document.getElementById('titleBox').value = note.title;
    document.getElementById('textBox').value = note.text;
}

function onNewNoteButtonPressed() {
    clearEditor();
}

function clearEditor() {
    idListItemMap.forEach((item) => {
        deHighlightListItem(item);
    });
    currentNoteId = null;
    document.getElementById('titleBox').value = '';
    document.getElementById('textBox').value = '';
    window.location.hash = '';
}

function highlightListItem(item) {
    item.classList.add('active');
    item.querySelector('#delButton').classList.remove('btn-outline-primary');
    item.querySelector('#delButton').classList.add('btn-primary');
}

function deHighlightListItem(item) {
    item.classList.remove('active');
    item.querySelector('#delButton').classList.remove('btn-primary');
    item.querySelector('#delButton').classList.add('btn-outline-primary');
}