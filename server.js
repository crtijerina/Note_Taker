const express = require("express");
const { v4: uuidv4 } = require("uuid");
const dbJSON = require("./db/db.json");
const app = express();
const PORT = 3001;
const path = require("path");
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//html routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.delete("/api/notes/:id", (req, res) => {
  //this will readd all note fome db.son file/
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    const updatedNotes = allNotes.filter(({ id }) => id !== req.params.id);
    console.log(updatedNotes);
    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(updatedNotes),
      (err) => {
        if (err) {
          return res.json({ error: "Error writing to file" });
        }
        return res.json(updatedNotes);
      }
    );
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// api routes
app.get("/api/notes", (req, res) => {
  return res.json(dbJSON);
});

// post routes
app.post("/api/notes", (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };

  // BONUS: Use a RegEx Pattern to remove spaces from newCharacter
  //newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

  dbJSON.push(newNote);
  console.log(dbJSON);

  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(dbJSON, null, 2),
    (err) => {
      if (err) {
        return res.json({ error: "Error writing to file" });
      }
      return res.json(newNote);
    }
  );
});

//THIS WILL ALWALYS BE AT THE BOTTOM (footer)
app.listen(PORT, () => {
  console.log(`This is conferation that our server is working on port ${PORT}`);
});
