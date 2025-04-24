import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Add these lines to debug file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

console.log('Database file path:', DB_FILE); // Add this line
const app = express();

// Create empty DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }));
}

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    credentials: true, // This is the key change
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));

// Helper to read/write DB
function readDB() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }));
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading DB:', err);
      return { users: [] };
    }
  }
  
  function writeDB(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      console.log('DB updated successfully'); // Add this line
    } catch (err) {
      console.error('Error writing DB:', err);
    }
  }

// Routes
app.post('/api/register', (req, res) => {
  const db = readDB();
  const { username, password } = req.body;

  if (db.users.some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username taken' });
    
  }

  db.users.push({ username, password });
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const db = readDB();
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);

  res.json({ success: !!user, user });
});

app.listen(3000, () => console.log('Backend running on Server running with CORS support'));