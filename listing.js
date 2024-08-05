const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
    type: String ,
},
    price: {
    type:Number,
 },
    country:{
    type: String ,
 },
    image:{
        type: String,
        default:"https://unsplash.com/photos/a-group-of-people-riding-surfboards-on-top-of-a-body-of-water-725siG9_FkA?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash",
        set: (v) => 
        v === "" 
        ? "https://unsplash.com/photos/a-group-of-people-riding-surfboards-on-top-of-a-body-of-water-725siG9_FkA?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash" : v,
    },
    location:{
        type: String,
     },
     reviews: [
        {
          type: Schema.Types.ObjectId,  
          ref: "Review",
        },
     ],
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;