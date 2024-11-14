const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
  res.json(books);
});


// Get the book list available in the shop
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]; // Use the ISBN to find the book
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book.reviews);  // Assuming reviews are stored in the 'reviews' field of the book object
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});




// Task 10: Get all books
const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/books'); // Replace with the actual endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};
// Task 11: Get book by ISBN
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`); // Replace with the actual endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
    throw error;
  }
};
// Task 12: Get books by author
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/books?author=${author}`); // Replace with the actual endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error);
    throw error;
  }
};
// Task 13: Get books by title
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/books?title=${title}`); // Replace with the actual endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error);
    throw error;
  }
};



module.exports.general = public_users;
