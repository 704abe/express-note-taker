const express = require('express');
const fs = require("fs");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/notes.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes.html/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    console.log(noteList);
    let noteId = (Number(req.params.id) - 1).toString();
    console.log(noteId);
    let saidNote = noteList[noteId];
    console.log(saidNote);
    res.json(saidNote);
});

app.post("/api/notes.html", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteLength = noteList.length + 1;
    // console.log(typeof noteLength, 'noteLength', noteLength);
    //create new property called id based on length and assigns it to each json object
    newNote.id = noteLength.toString();
    //push updated note to the data containing notes history in db.json
    noteList.push(newNote);

    //write the updated data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.delete("/api/notes.html/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id);
    noteList = noteList.filter(selected => selected.id != noteId)

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

app.listen(PORT, ()=>{
    console.log(`listening at http://localhost:${PORT}`);
})