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

    let note;
    if (currentNoteId === null) {
        note = createNote(title, text);
        currentNoteId = note.id;

        const element = createItemListItem(note);
        idListItemMap.set(note.id, element);
        document.getElementById('notes-list').appendChild(element);
    } else {
        note = saveNote(currentNoteId, title, text);
        const element = idListItemMap.get(currentNoteId);
        fillItemListItem(element, note);
    }
}

function showNoteList() {
    const notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // deleting existing notes

    for (let note of notes) {
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

    item.getElementById('parentDiv').onclick = (event) => {
        onNoteSelected(note.id);
        event.stopPropagation();
    };

    item.getElementById('delButton').onclick = (event) => {
        onDeleteButtonPressed(note.id);
        event.stopPropagation();
    }

    return item.body.firstChild;
}

function fillItemListItem(element, note) {
    element.querySelector('#title').innerText =
        note.title === ''
            ? '<p class="text-muted">Untitled</p>'
            : note.title;
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