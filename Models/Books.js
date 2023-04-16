

/**
 * **********************
 * Group Name : Group_Saravjeet_Singh
 * Members : Saravjeet Singh, Amandeep Kaur, Kuldeep Kaur
 * 
 */

const mongoose  = require("mongoose");

const BookSchema = new mongoose.Schema({
    Title : {
        type : String,
        required : true,
        unique: true
    },
    Description : {
        type: String,
        default:"N/A"
    },
    Author : {
        type : String,
        default:"N/A"
    },
    Price : {
        type: Number,
        required : true
    },
    Publisher: {
        type : String,
        default:"N/A"
    },
    BookImage: {
        type: String
    }
})

module.exports = mongoose.model("Books", BookSchema)
