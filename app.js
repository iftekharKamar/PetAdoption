const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Use a strong secret key in a production environment
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection
// const MONGO_URL = 'mongodb://127.0.0.1:27017/petAdoption';

// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.error("Failed to connect to MongoDB:", err));

const MONGO_URL = 'mongodb://127.0.0.1:27017/petAdoption';

main().then(()=>{
    console.log("Connect to DB");
}).catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
  }

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // User is authenticated, proceed to the next middleware/route
    }
    res.redirect("/login"); // User is not authenticated, redirect to login
}

// Routes
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Signup route
app.get('/signup', (req, res) => {
    res.render('signup.ejs', { error: null }); // Render signup page
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser  = await User.findOne({ username });
        if (existingUser ) {
            return res.render('signup.ejs', { error: "Username already exists. Please choose another one." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ username, password: hashedPassword });
        await newUser .save();

        // Automatically log the user in after signup
        req.session.userId = newUser ._id;
        res.redirect("/login"); // Redirect to home after signup
    } catch (error) {
        console.error(error);
        res.render('signup.ejs', { error: "An error occurred during registration." });
    }
});

// Login route
app.get("/login", (req, res) => {
    res.render("login.ejs",{error:null});
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.render("login.ejs",{error:"User Not Found ,Firstly SignUp."});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.render("login.ejs",{error:"Invalid password or username"});
        }

        // Successful login
        req.session.userId = user._id; // Store user ID in session
        res.redirect("/home"); // Redirect to home after login
    } catch (error) {
        console.error("Login error:", error);
        res.render('login.ejs', { error: "An error occurred during login." });
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect("/home");
        }
        res.redirect("/login");
    });
});

// Protected Routes
app.use("/home", isAuthenticated);

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