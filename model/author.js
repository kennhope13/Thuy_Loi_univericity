const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Author';
const COLLECTION_NAME = 'authors';
const authorSchema = new Schema({
    name:{
        type:String,
        trim:true,
        maxLength:150
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    dateOfBirth:{
        type:Date,
    },
    // articleID: { 
    //     type: Schema.Types.ObjectId, 
    //     ref: 'article',
    //     default: ''
    // }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, authorSchema);