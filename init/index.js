import mongoose from "mongoose";
// const init=require("./db.js");
import {data} from "./db.js";
import {Listing} from "../models/listings.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = data.map((obj) => ({
    ...obj,
    owner: "682c1372c3911456d26ce31c",
  }));

  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};


initDB();