const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();

// Set up the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_database_password', // Replace with your database password
    database: 'your_database_name'     // Replace with your database name
});

// Middleware to parse JSON request body
app.use(express.json());

// Sign-Up Route
app.post('/signup', (req, res) => {
    const { email, password} = req.body;

    // Validate the input
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing the password' });
        }

        // Insert user details (email, username, hashed password) into the database
        const query = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
        db.execute(query, [email, hashedPassword, username], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email is already in use' });
                }
                return res.status(500).json({ error: 'Error saving user to the database' });
            }
            return res.status(201).json({ message: 'User created successfully' });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
require('dotenv').config();

function submitSignupForm() {
    const userData = {
        email: EmailInput.value,
        password: passwordInput.value,
    };

    // Send data to the backend via AJAX
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Sign up successful!');
            window.location.href = '/main';  // Redirect to the main application
        } else {
            showErrorMessages([data.error]);
        }
    })
    .catch(error => {
        showErrorMessages(['An error occurred. Please try again later.']);
        console.error('Error:', error);
    });
}
app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/path-to-your-main-app/index.html'); // Serve the main app page
});
const multer = require('multer');
const path = require('path');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage });

// File Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { originalname, filename, path: filepath } = req.file;

  // Optional: Save file details to the database
  const query = 'INSERT INTO files (name, path) VALUES (?, ?)';
  db.execute(query, [originalname, filepath], (err, result) => {
    if (err) {
      console.error('Error saving file to database:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(201).json({
      message: 'File uploaded successfully.',
      fileId: result.insertId,
      filePath: filepath,
    });
  });
});

