const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { name } = require("ejs");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"assets")));
app.use(express.urlencoded({extended:true}));

const MONGO_URL = 'mongodb://127.0.0.1:27017/petAdoption';

main().then(()=>{
    console.log("Connect to DB");
}).catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
  }


  app.get("/",(req,res)=>{
    console.log("working");
})

app.get("/home",(req,res)=>{
    res.render("index.ejs");
})


app.get("/home/showcat",async(req,res)=>{
    const allListings = await Listing.find({});
    let name= "cat";
    res.render("show.ejs",{allListings,name});
})


app.get("/home/showdog",async(req,res)=>{
    const allListings = await Listing.find({});
    let name= "dog";
    res.render("show.ejs",{allListings,name});
})


app.get("/home/showrabbit",async(req,res)=>{
    const allListings = await Listing.find({});
    let name= "rabbit";
    res.render("show.ejs",{allListings,name});
})

app.get("/home/showdog/:id",async(req,res)=>{
    let id = req.params.id;
    let li = await Listing.findById(id);
    res.render("showdetails.ejs",{li});
})

app.get("/home/showcat/:id",async(req,res)=>{
    let id = req.params.id;
    let li = await Listing.findById(id);
    res.render("showdetails.ejs",{li});
})


app.get("/home/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/home",async(req,res)=>{
   let newListing = new Listing(req.body.listing);
   newListing.save();
  res.redirect("/home");
})


app.get("/home/adopt",(req,res)=>{
    res.render("adopt.ejs")
})


app.get("/home/adoption_checklist",(req,res)=>{
    res.render("checklist.ejs")
})

app.get("/home/detail_dog",(req,res)=>{
    res.render("detail.ejs")
})

app.get("/home/pet_faq",(req,res)=>{
    res.render("faq.ejs")
})

app.get("/home/about_us",(req,res)=>{
    res.render("about.ejs")
})

app.get("/home/contact_us",(req,res)=>{
    res.render("contact.ejs")
})
app.get("/home/adopted_success",(req,res)=>{
    res.render("success.ejs")
})

app.listen(8080,(req,res)=>{
    console.log("app is listining");
})