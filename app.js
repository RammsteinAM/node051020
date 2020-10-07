const http = require("http");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const port = 8080;

const app = express();

app.set('view engine', 'pug')

app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use("/", function (req, res, next) {
  const cookie = req.cookies.time;
  if (cookie === undefined) {
    const time = (new Date()).toLocaleTimeString("hy-AM");
    res.cookie("time", time, { maxAge: 60000 });
  }
  next();
});

app.get("/", function (req, res) {
  const cookie = req.cookies.time;
  res.render('index', { title: 'Homework', message: 'Hello world', timeFromCookie: cookie || "No Time Cookie" });
});

app.get("/myroute/:param", function (req, res) {
  const param = req.params;
  const query = req.query;
  const headers = req.headers;
  const cookies = req.cookies
  res.render('myroute', { title: 'Homework', param, query, headers, cookies });
});

app.get("/form", function (req, res) {
  res.render('form');
});

const users = [];

app.post("/form", function (req, res) {
  const user = {
    username: req.body.username || "",
    password: req.body.password || "",
    gender: req.body.gender || "",
    agree: req.body.agree || false,
  }
  users.push(user);
  res.redirect('/result');
});

app.get("/result", function (req, res) {
  res.render('users', { title: 'Users', users });
});

app.get("/api/time", function (req, res) {
  const cookie = req.cookies.time;
  if (cookie) {
    res.send(JSON.stringify({time: cookie}));
  }
  else{
    res.status(404).send("No Time Cookie");
  }
});

app.get("/api/users", function (req, res) {
  res.send(users);
});

app.post("/api/users", function (req, res) {
  const { username, password, gender, agree } = req.body;
  const user = {
    username: username || "",
    password: password || "",
    gender: gender || "",
    agree: agree || false,
  }

  users.push(user);
  res.send(users);
});

app.listen(port);
