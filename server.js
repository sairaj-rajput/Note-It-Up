const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    res.render("index", { files: files });
  });
});

app.get("/file/:task", (req, res) => {
  fs.readFile(`./files/${req.params.task}.txt`, (err, data) => {
    if (err) throw err;
    res.render("show", { taskname: req.params.task, data: data });
  });
});

app.get("/edit/:task", (req, res) => {
  fs.readFile(`./files/${req.params.task}.txt`, "utf8", (err, data) => {
    if (err) throw err;
    res.render("edit", { taskname: req.params.task, data: data });
  });
});

app.post('/update',(req,res)=>{
  const oldTitle = req.body.oldtitle;
  const newTitle = req.body.newtitle;
  const content = req.body.content;
  fs.rename(`./files/${oldTitle}.txt`, `./files/newTitle.txt`, (err) => {
    if (err) throw err;
    fs.writeFile(`./files/${newTitle}.txt`, content, (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  })
})

app.get("/delete/:task", (req, res) => {
  fs.unlink(`./files/${req.params.task}.txt`, (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.content,
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port : http://localhost:${port}`);
});
