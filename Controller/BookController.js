
const { default: axios } = require('axios');

const Books = require('../Models/Books');


const findBookByTitle = async (title) => {

    return await Books.findOne({ Title: title})
}

const getAllBooks = async (req, res) => {
    let books = await Books.find({})

    return res.status(200).json({
        "books": books,

    })
}

const getBookById = async (bookId) => {
    return await Books.findById(bookId)
}

/**
 * **********************
 * Group Name : Group_Saravjeet_Singh
 * Members : Saravjeet Singh, Amandeep Kaur, Kuldeep Kaur
 * 
 */
// add example data to the mongodb
const addExampleData = async (NYT_KEY ) => {
    
    
    axios.get(`https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=${NYT_KEY}`, {
        "headers": {
            "Accept": "application/json"
          }
    }).then(async apiResponse => {
        const booksResponse = apiResponse.data
        books = booksResponse.results.lists[0].books
        
        for (let i = 0; i < (books.length < 10 ? books.length : 10); i++) {
             
            let book = books[i];

            let preBook = await findBookByTitle(book.title)

            if (!preBook) {
               
                Books.create({
                    Title:book.title,
                    Description: book.description || book.description == "" ? book.description : "N/A",
                    Author:book.author,
                    Price:Math.round((Math.random() * 20) + 20),
                    Publisher: book.publisher ? book.publisher : "N/A",
                    BookImage:book.book_image
                })  
              
            }
            

            
        }
        
    }).catch(err => {
        console.log(err)
        
    })


}

// get CourseId for the next course 
const getBookIdForNewBook = async () => {
    return ((await Books.findOne().sort('-CourseId')).CourseId + 1);
}


module.exports = {
    addExampleData,
    findBookByTitle,
    getBookIdForNewBook,
    getAllBooks,
    getBookById
}