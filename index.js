// // library.js
// class Library {
//     constructor() {
//       this.books = [];
//       this.users = [];
//     }
  
//     addBook(book) {
//       this.books.push(book);
//     }
  
//     borrowBook(userId, bookId) {
//       const book = this.books.find(b => b.id === bookId);
//       if (book && book.status === 'available') {
//         book.status = 'borrowed';
//         const user = this.users.find(u => u.id === userId);
//         user.borrowedBooks.push(bookId);
//         return true;
//       }
//       return false;
//     }
  
//     getAvailableBooks() {
//       return this.books.filter(book => book.status === 'available');
//     }
  
//     // Add other methods here
//   }
  
//   module.exports = Library;

import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRoutes from './routes/User.routes.js';
import bookRoutes from './routes/Book.routes.js';

dotenv.config()
const app = express()

let uri = 'mongodb+srv://abhayvidja09:hb4CC6F5pwRLWfEl@cluster0.an2kk.mongodb.net/'

mongoose.set('strictQuery', false)
const connect = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('MongoDb database connected')
    } catch (error) {
        console.log(error)
        console.log("MongoDb database connection failed")
    }
}

app.use(express.json())

app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes)

app.listen(3000 , () => {
    connect()
    console.log('Server is running on port 3000')
})
