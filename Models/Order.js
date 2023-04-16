

/**
 * **********************
 * Group Name : Group_Saravjeet_Singh
 * Members : Saravjeet Singh, Amandeep Kaur, Kuldeep Kaur
 * 
 */

const mongoose  = require("mongoose");

const OrderSchema = new mongoose.Schema({
    
    PaymentIntenId : {
        type: String,
        required: true
    },
    Amount : {
        type : String,
        default:"N/A"
    },
    BookId : {
        type: String
    },
    Quantity: {
        type : Number,
        default : 1
    },
    PaymentMethod : {
        type: String
    },
    IsCaptured : {
        type : Boolean,
        default : false
    },
    ApprovalUrl : {
        type: String
    },
    PayerId : {
        type: String
    }

    
})

module.exports = mongoose.model("Order", OrderSchema)
