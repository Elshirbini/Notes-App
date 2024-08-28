import mongoose from "mongoose";

const Schema = mongoose.Schema

const note = new Schema({
    title : {
        type: String,
        required : true,
    },
    content : {
        type: String,
        required : true,
    },
    tags : {
        type: [String],
        default : [],
    },
    isPinned : {
        type: Boolean,
        default : false,
    },
    userId : {
        type: String,
        required : true,
    },
} , {timestamps : true})


export const Note = mongoose.model('notes' , note)