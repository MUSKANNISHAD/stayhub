// models/user.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    }
});

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);
