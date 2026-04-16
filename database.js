const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('./reservation.db');

// Initialize database tables
db.serialize(() => {
  // Reservations table
  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT,
    star_class TEXT,
    hotel TEXT,
    ac_type TEXT,
    meal_type TEXT,
    timing TEXT,
    date TEXT,
    persons INTEGER,
    table_number INTEGER,
    customer_name TEXT,
    mobile TEXT,
    email TEXT,
    advance_paid INTEGER,
    payment_method TEXT,
    booking_status TEXT DEFAULT 'confirmed'
  )`);

  // Reserved tables tracking
  db.run(`CREATE TABLE IF NOT EXISTS reserved_tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER,
    date TEXT,
    hotel TEXT,
    UNIQUE(table_number, date, hotel)
  )`);

  // Clear existing data and insert fresh reserved tables
  db.run("DELETE FROM reserved_tables", () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];
    
    const stmt = db.prepare("INSERT INTO reserved_tables (table_number, date, hotel) VALUES (?, ?, ?)");
    
    // 5 tables reserved
    stmt.run(3, today, 'ALL');
    stmt.run(7, today, 'ALL');
    stmt.run(12, tomorrow, 'ALL');
    stmt.run(15, tomorrow, 'ALL');
    stmt.run(18, dayAfter, 'ALL');
    
    stmt.finalize();
    console.log('✓ Database initialized with 5 reserved tables (3,7,12,15,18)');
  });
});

module.exports = db;