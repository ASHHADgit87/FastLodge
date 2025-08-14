import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user" , "hotelOwner"],
        default: "user"
    },
    recentSearchedCities:[{
        type: String,
        required: false
    }]
},{
    timestamps: true
})

const User = mongoose.model("User", UserSchema)
export default  User;