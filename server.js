const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 7777;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"))

const myJSON = [];

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {  
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    renderIt();
    return res.json(myJSON);
});

app.post("/api/notes", function (req, res) {
    renderIt();

    const newNote = req.body;    
    newNote.id = myJSON.length;
    myJSON.push(newNote);                  
    
    fs.writeFileSync( path.join( __dirname, "db/db.json"), JSON.stringify(myJSON)); 

    return res.json(myJSON);
});

app.delete("/api/notes/:id", function (req, res) {
   
    renderIt();

    const thisID = req.params.id;
    myJSON.splice(thisID,1);
    
    myJSON.forEach((element,index) =>{      // sort id
        element.id = index;
    })

    fs.writeFileSync( path.join( __dirname, "db/db.json"), JSON.stringify(myJSON));

    return res.json(myJSON);
});

function renderIt(){
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"),"utf-8"));
    myJSON.length = 0;                      // empty array
    data.forEach((element,index) => {
        element.id = index;
        myJSON.push(element);
    });

}

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});