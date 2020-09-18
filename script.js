window.onload = showNoteList;

// maybe we should take this variable outta here
let currentNoteId = null;

async function saveCurrentNode() {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    if (currentNoteId === null) {
        currentNoteId = notes.length;
        notes[notes.length] = {
            id: currentNoteId,
            title: document.getElementById('titleBox').value,
            text: document.getElementById('textBox').value,
            date: 'currentDate',
        };
    } else {
        for (let i = 0, n = notes.length; i < n; i++) {
            if (notes[i].id === currentNoteId) {
                notes[i].title = document.getElementById('titleBox').value;
                notes[i].text = document.getElementById('textBox').value;
                notes[i].date = 'newDate';
            }
        }
    }

    window.localStorage.setItem('notes', JSON.stringify(notes));
    await showNoteList();
}

async function showNoteList() {
    const notes = JSON.parse(window.localStorage.getItem('notes') || []);
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // deleting existing notes
    for (let note of notes) {
        notesList.appendChild(await getNoteTitleCard(note.id, note.title, note.date, note.text.slice(0, 20)));
    }
}

async function getNoteTitleCard(id, title, date, shortContent) {
    /*const div = document.createElement('div');
    div.appendChild(document.createTextNode(`${title}`));
    div.appendChild(document.createElement('br'));
    div.appendChild(document.createTextNode(`${date}`));

    const showButton = document.createElement('button');
    showButton.innerHTML = 'show';
    showButton.onclick = () => showNote(id);
    div.appendChild(showButton);

    const delButton = document.createElement('button');
    delButton.innerHTML = 'del';
    delButton.onclick = () => deleteNote(id);
    div.appendChild(delButton);

    div.setAttribute('id', id);

    return div;*/
    const div = document.createElement('div');
    div.innerHTML = await getTemplatedElement('notes_list_item.html', {
        id: id,
        title: title,
        date: date,
        content: shortContent,
    });
    return div;
}

function getNote(id) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    return notes.find(note => note.id === id);
}

async function deleteNote(id) {
    let notes = JSON.parse(window.localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    window.localStorage.setItem('notes', JSON.stringify(notes));
    if (id === currentNoteId) {
        currentNoteId = null;
        document.getElementById('titleBox').value = '';
        document.getElementById('textBox').value = '';
    }
    await showNoteList();
}

function showNote(id) {
    currentNoteId = id;
    const note = getNote(id);
    document.getElementById('titleBox').value = note.title;
    document.getElementById('textBox').value = note.text;
}

async function newNote() {
    if (document.getElementById('titleBox').value !== ''
        || document.getElementById('textBox').value !== '') {
        await saveCurrentNode();
    }
    currentNoteId = null;
    document.getElementById('titleBox').value = '';
    document.getElementById('textBox').value = '';
}

async function getTemplatedElement(name, replacements) {
    let template = await fetchHtml(name);
    for (const replacement in replacements) {
        template = template.replace('${' + replacement + "}", replacements[replacement]);
    }
    return template;
}

async function fetchHtml(path) {
    const response = await fetch(path);
    return await response.text();
}