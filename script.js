window.onload = showNoteList;

function saveCurrentNode() {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    notes[notes.length] = {
        id: notes.length,
        title: document.getElementById('titleBox').value,
        text: document.getElementById('textBox').value,
        date: 'currentDate',
    };
    console.log(JSON.stringify(notes));
    window.localStorage.setItem('notes', JSON.stringify(notes));
    showNoteList();
}

function showNoteList() {
    const notes = JSON.parse(window.localStorage.getItem('notes') || []);
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // deleting existing notes
    for (let note of notes) {
        notesList.appendChild(getNoteTitleCard(note.id, note.title, note.date));
    }
}

function getNoteTitleCard(id, title, date) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(`${title}`));
    div.appendChild(document.createElement('br'));
    div.appendChild(document.createTextNode(`${date}`));

    const delButton = document.createElement('button');
    delButton.innerHTML = 'del';
    delButton.onclick = () => deleteNote(id);

    div.appendChild(delButton);

    div.setAttribute('id', id);
    return div;
}

function deleteNote(id) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    window.localStorage.setItem('notes', JSON.stringify(notes));
    showNoteList();
}