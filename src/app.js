require("dotenv").config();
const express = require('express')
require('./db/conn')

const app = express();
const PORT = 3000;
const path = require('path')
const ejs = require('ejs')
const cookieParser=require('cookie-parser')
const routes=require("./routes/main")

const staticPath = path.join(__dirname, "../public")

app.use(express.static(staticPath));
app.set("view engine", "ejs")
app.use(cookieParser())
app.use(express.json()) 
app.use(express.urlencoded({ extended: false }))
app.use('',routes)
app.use(express.static(__dirname + '../public'));
app.use(express.static(__dirname + '../dist'));


app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})

