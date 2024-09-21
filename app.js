const express = require("express");
const app = express();
const path = require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"assets")));

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.get("/showdog",(req,res)=>{
    res.render("new.ejs");
})

app.get("/showcat",(req,res)=>{
    res.render("new.ejs");
})
app.get("/showrabbit",(req,res)=>{
    res.render("new.ejs");
})
app.listen(8080,(req,res)=>{
    console.log("app is listining");
})