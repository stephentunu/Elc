import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("./database.db");

// Create all tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openId TEXT NOT NULL UNIQUE,
    name TEXT,
    email TEXT,
    loginMethod TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    lastSignedIn TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    membershipId TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    studentId TEXT UNIQUE,
    course TEXT,
    yearOfStudy INTEGER,
    role TEXT DEFAULT 'Member',
    photoUrl TEXT,
    status TEXT DEFAULT 'Active',
    joinedDate TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memberId INTEGER NOT NULL,
    amount REAL NOT NULL,
    paymentType TEXT DEFAULT 'Subscription',
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    status TEXT DEFAULT 'Paid',
    mpesaCode TEXT,
    recordedBy INTEGER,
    notes TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    priority TEXT DEFAULT 'Normal',
    isPublished INTEGER DEFAULT 1,
    imageUrl TEXT,
    postedBy INTEGER,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    eventDate TEXT NOT NULL,
    eventTime TEXT,
    venue TEXT,
    category TEXT DEFAULT 'Meeting',
    imageUrl TEXT,
    isPublished INTEGER DEFAULT 1,
    createdBy INTEGER,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    caption TEXT,
    eventId INTEGER,
    uploadedBy INTEGER,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS meetingMinutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    meetingDate TEXT NOT NULL,
    agenda TEXT,
    minutesContent TEXT NOT NULL,
    attendees TEXT,
    decisions TEXT,
    nextMeetingDate TEXT,
    recordedBy INTEGER,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS fundTransactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    reference TEXT,
    transactionDate TEXT,
    balanceAfter REAL,
    recordedBy INTEGER,
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

// Seed admin user
const existing = db.prepare("SELECT * FROM admins WHERE email = ?").get("admins@gmail.com");
if (!existing) {
  const hash = bcrypt.hashSync("pass1234", 10);
  db.prepare("INSERT INTO admins (email, password, name) VALUES (?, ?, ?)").run("admins@gmail.com", hash, "Club Admin");
  console.log("✅ Admin user created: admins@gmail.com / pass1234");
} else {
  console.log("✅ Admin user already exists");
}

db.close();
console.log("✅ Database seeded successfully");