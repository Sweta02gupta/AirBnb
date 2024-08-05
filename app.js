const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
main()
.then((res)=>{
    console.log(res);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/",(req,res)=>{
  res.send("hi, i am root");
});
const validateListing =(req, res, next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{ 
  next();
  }
}
//Index Route
app.get("/listings", wrapAsync(async (req, res) =>{
  const allListings = await Listing.find({});
  res.render(__dirname + "/views/index.ejs", {allListings});
}));
//new route
app.get("/listings/new",(req,res) =>{
  res.render(__dirname + "/views/new.ejs");
});
//show route
app.get("/listings/:id", wrapAsync(async (req, res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render(__dirname + "/views/show.ejs",{listing});
}));
//new route
app.get("/listings/new",(req,res) =>{
  res.render(__dirname + "/views/new.ejs");
});
//create route
app.post("/listings",
validateListing,
wrapAsync(async (req, res, next) =>{
  let result =  listingSchema.validation(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error);
  }
    //let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");   
}));
//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) =>{
  let {id} = req.params.id;
  const listing = await Listing.findById(id);
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    // Handle the case where listingId is not a valid ObjectId
    return res.status(400).send('Invalid ID');
}
  res.render(__dirname + "/views/edit.ejs" , {listing});

}));
app.get('/listings/:id', (req, res) => {
  const listingId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).send('Invalid Listing ID');
  }
  // Handle the listing retrieval
});

//update route
app.put("/listings/:id",
validateListing,
wrapAsync(async(req, res) =>{
  
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
})); 
//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) =>{
  let {id} = req.params;
 let deletdListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

//Reviews
//post route
app.post("/listings/:id/reviews", async(req,res) =>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   
   
   res.redirect(`/listings/${listing._id}`);
});

/*app.get("/testListing", async (req, res)=>{
  let samplelisting = new Listing({
    title: "My new Villa",
    description: "By the beach",
    pricing: 1200,
    location: "Calangute, Goa",
    country: "India",
  });
 await samplelisting.save();
 console.log("sample was saved");
 res.send("successful");
});*/
app.all("*",(req, res, next) =>{
  next(new ExpressError(404, "Page Not Found!"));
})
app.use('/listings/:id',(err, req, res, next) =>{
  let {status =500, message= "Something went wrong!"} = err;
 res.status(status).render("error.ejs",{message});
  // res.status(status).send(message);
});
app.listen(8000,() =>{
   console.log("server listening to port  8000");
})
