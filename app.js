const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("main");
});

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// All articles

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("success");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully deleted");
      }
    });
  });

//Specific Article

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, results) {
        if (results) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, results) {
        if (results) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content } },
      function (err, results) {
        if (results) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne(
      { title: req.params.articleTitle },
      function (err, results) {
        if (results) {
          res.send(results);
        } else {
          console.log(err);
        }
      }
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
