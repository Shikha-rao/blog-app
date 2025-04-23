const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const posts = [];

const SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJibG9nLWxvZ2luIiwibmFtZSI6IkpvaG4iLCJpYXQiOjE1MTYyMzkwMjJ9.PHq7UVcLlUhMG7pDj0cVJ6oKRT1J81hxRy1_mgxrarQ';

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed });
    res.json({ message: 'User registered' });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Protected: Create post
app.get('/api/posts', authenticateToken, (req, res) => {
    // const post = { title: req.body.title, content: req.body.content, author: req.user.username };
    // posts.push(post);
    res.json(posts);
});

// Protected: Create post
app.post('/api/posts', authenticateToken, (req, res) => {
    const post = { title: req.body.title, content: req.body.content, author: req.user.username };
    posts.push(post);
    res.json(post);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
