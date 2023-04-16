const express = require("express");
require('dotenv').config()
const paypal = require("paypal-rest-sdk");
const initMongo = require('./DB');
const { addExampleData, getAllBooks, getBookById } = require("./Controller/BookController");
const Order = require("./Models/Order");


/**
 * 
 * Group Name : Group_Saravjeet_Singh
 * members : Saravjeet Singh, Amandeep Kaur, Kuldeep Kaur
 */

initMongo(process.env.MONGOURI)




addExampleData(process.env.NYT_API)




paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret:
    process.env.PAYPAL_CLIENT_SECRET,
});

const PORT = process.env.PORT || 3000;
const app = express();


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));




app.get("/books", getAllBooks);


app.post("/pay", async (req, res) => {
  
  let bookId = req.body.bookId
  let quantity = req.body.quantity

  let book = await getBookById(bookId)

  

  const create_payment_json = {
    intent: `AUTHORIZE`,
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/cancel`,
    },
    transactions: [
      {
        books_list: {
          books: [
            {
              name: book.Title,
              Author: book.Author,
              price: book.Price,
              currency: "USD",
              quantity: req.body.quantity,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: `${book.Price * quantity}`,
        },
        description: `${book.Title} Book Purchasing`,
      },
    ],
  };

  // create order for the paypal payment intent
  paypal.payment.create(create_payment_json, function (error, payment) {
    
    if (error) {

      throw error;

    } else {

      let approvalLink = payment.links.filter((link) => {
        return link.rel === "approval_url"
      })[0].href

      // save data to MongoDB database
      Order.create({
        Amount : book.Price * quantity,
        Quantity: quantity,
        BookId: bookId,
        PaymentIntenId: payment.id,
        PaymentMethod: payment.payer.payment_method,
        IsCaptured : false,
        ApprovalUrl: approvalLink
      })
      

      // redirect to the approval link
      return res.redirect(approvalLink);
      
      // for (let i = 0; i < payment.links.length; i++) {
      //   if (payment.links[i].rel === "approval_url") {
      //     res.redirect(payment.links[i].href);
      //   }
      // }

    }
  });

});


app.get("/success",  (req, res) => {

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  
  // Retrieve the payment/ order created for the user
  paypal.payment.get(paymentId, {}, async (error, order) => {

    if (error) {
      console.log(error);

      throw error;
    } else {
      //retrieve Order from database
      let localOrder = await Order.findOne({ PaymentIntenId: paymentId });

      if (order.payer.status === "VERIFIED") {    
        const execute_payment_json = {
          payer_id: payerId,
          transactions: [
            {
              amount: {
                currency: "USD",
                total: localOrder.Amount,
              },
            },
          ],
        };
        
        // capture the payment and transfer the amount
        paypal.payment.execute(paymentId, execute_payment_json, function (
          error,
          payment
        ) {
          if (error) {

            console.log(error.response);

            throw error;
          } else {

            localOrder.IsCaptured = true
            localOrder.save()
            res.sendFile(__dirname + "/success.html");
          }
        });
      }
    }
  })
  
  
});

app.get("/cancel", (req, res) => res.sendFile(__dirname + "/failure.html"));

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
