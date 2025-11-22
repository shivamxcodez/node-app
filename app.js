import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./db.js";
import logger from "./logger.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (_, res) => {
  logger.info("Getting data from the database");
  db.query("SELECT * FROM user_tb", (err, results) => {
    logger.info("Data:", results);
    if (err) {
      logger.error("Error getting data from the database:", err);
      throw err;
    }

    res.render("index", { users: results });
  });
});

app.get("/add", (_, res) => {
  logger.info("Adding user");
  return res.render("add-user");
});


app.post("/add", (req, res) => {
  const { name, email } = req.body;
  logger.info("Adding user: ", [name, email]);
  db.query(
    "INSERT INTO user_tb (name, email) VALUES (?, ?)",
    [name, email],
    (err) => {
      if (err) {
        logger.error("Error adding user:", err);
        throw err;
      }
      logger.info("Added user");
      res.redirect("/");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  console.log("Deleting user:", req.params.id);
  db.query("DELETE FROM user_tb WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      logger.error("Error deleting: ", err);
      throw err;
    }
    logger.info("Deleted user");
    res.redirect("/");
  });
});

// write a api handling for Update user details
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM user_tb WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (!results || results.length === 0) return res.status(404).send("User not found");
    res.render("edit", { user: results[0] });
  });
  console.log("id got successfully");
});


app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  db.query(
    "UPDATE user_tb SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    (err, result) => {
      if (err) return res.status(500).send("Database error");
      res.redirect("/");
    }
  );
});


const port = process.env.PORT || 3000;
app.listen(port, () =>
  logger.info(`Server running on http://localhost:${port}`)
);
