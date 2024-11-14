const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const SECRET_KEY = 'A9!b2@X6#y$R8^f0&ZL*3qWE!4d7F';
let users = [];

// Validate if the username is unique
const isValid = (username) => {
  return !users.some(user => user.username === username);
}

// Check if the username and password match any registered user
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
};

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// User login to receive a JWT token
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required for authentication" });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const username = decoded.username;
    const { review } = req.body;

    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }

    const isbn = req.params.isbn;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;
    res.json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
