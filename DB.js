const mongoose = require('mongoose')

const initMongo = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology : true
        })
        console.log("Connected to the database")
    } catch (error) {
        console.error(error)        
    }
}

module.exports = initMongo
