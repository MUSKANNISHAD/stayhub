if(process.env.NODE_ENV!=="production"){ 
import { config } from 'dotenv';
config();

}

import express from 'express';
const app=express();
const mongoose=require('mongoose');
import Listings from './models/listings.js';
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const WrapAsync=require("./utils/wrapAsync.js");
const Reviews = require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportMongoose=require("passport-local-mongoose");
const User=require("./models/user.js");
const port = process.env.PORT || 3000;




const listingsRoutes=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const userRoutes=require("./routes/user.js");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
// const db_Url=process.env.MONGO_API;

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
  await mongoose.connect(MONGO_URL);
}


// async function main() {
//   await mongoose.connect(db_Url);
// }


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,"/public")));

 const sessionOption={
    secret:"mysecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.get("/", (req, res) => {
    res.send("Hii, I am root"); // 
});
 


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.get("/registerUser",async(req,res)=>{
//     let fakeUser=new User({
//         username:"muskankumarinishad",
//         email:"muskan@gmail.com",
//     });
//     let registerUser=await User.register(fakeUser,"muskannishad");
//     res.send(registerUser);
// })

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});




const isAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be signed in first!");
  res.redirect("/login");
};

// then use it on routes:
app.use("/listings",  listingsRoutes);

// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     console.log(res.locals.success);
// })


app.use("/listings/:id/reviews",reviews);
app.use("/",userRoutes);

/*app.get("/ListingsSample", async (req, res) => {
    await Listings.insertMany(sampleListings);
    console.log("Sample listings were saved");
    res.send("Success");
  });
  */

  
 /* app.all("*", (req, res, next) => {
    console.log(`Unhandled route: ${req.originalUrl}`);
    next(new expressError(404, "page not found"));
  });
  
    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong!" } = err;
        res.status(statusCode).send(message);
    });
    */



app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
