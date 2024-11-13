const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:String,
    name:String,
    img:String,
    breed:String,
    height:String,
    gender:String
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;
