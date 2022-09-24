import express from "express";
import fs from "fs";
import path from "path";
import * as url from 'url';
let __dirname = url.fileURLToPath(new URL('.', import.meta.url));
let app = express();
let PORT = process.env.PORT || 3001;
let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route for getting the notes.html page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// wildcard route that returns index.html page
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// route that returns database as json
app.get("/api/notes", (req, res) => {
    res.json(noteList);
});

// route for posting a new note
app.post("/api/notes", (req, res) => {
    let newNote = req.body;

    //gives new note a unique id by adding +1 to the highest number in the array
    if(!noteList.length) {
        newNote.id = "1";
    } else {    
        let idArray = noteList.map(note => Number(note.id));
        newNote.id = (Math.max(...idArray) + 1).toString();
    }

    //pushes new note to the array of saved notes
    noteList.push(newNote);

    //writes the updated list to db.json and returns the data as JSON
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

// route for deleting a note
app.delete("/api/notes/:id", (req, res) => {
    let noteId = (req.params.id);
    noteList = noteList.filter(selected => selected.id != noteId)

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

// port listener
app.listen(PORT, ()=>{
    console.log(`listening at http://localhost:${PORT}`);
})