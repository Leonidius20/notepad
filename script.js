window.onload = showNoteList;

function saveCurrentNode() {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    notes[notes.length] = {
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
    let string = '';
    for (let note of notes) {
        string += getNoteTitleCard(note.title, note.date);
    }
    document.getElementById('notes-list').innerHTML = string;
}

function getNoteTitleCard(title, date) {
    return `<div>
    ${title}
    <br>
    ${date}
    <button>Del</button>
    </div>`;
}

function deleteNote(title) {
    console.log("wanna delete node " + title);
}