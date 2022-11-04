const express = require("express");

const PORT = process.env.PORT || 3001;
const path = require("path");
const app = express();

let ids = [];

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/ids", (req, res) => {
  res.json({ ids });
});

app.post("/ids/:id", (req, res) => {
  let doesIdExist = ids.find((id) => id == req.params.id);
  if (!doesIdExist) {
    ids.push(req.params.id);
    res.json({
      message: "successfully created connection",
    });
  } else {
    res.json({
      message: "connection already exists",
    });
  }
});

app.delete("/ids/:id", (req, res) => {
  ids = ids.filter((i) => i != req.params.id);
  res.json({
    message: "successfully deleted connection",
  });
});

app.get("/reset", (req, res) => {
  ids = [];
  res.json({ ids });
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
