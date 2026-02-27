import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// MMU ELC Admin Users Table
export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

// Members Table
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  membershipId: varchar("membershipId", { length: 50 }).notNull().unique(),
  fullName: text("fullName").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  studentId: varchar("studentId", { length: 50 }).unique(),
  course: text("course"),
  yearOfStudy: int("yearOfStudy"),
  role: varchar("role", { length: 50 }).default("Member"),
  photoUrl: text("photoUrl"),
  status: varchar("status", { length: 50 }).default("Active"),
  joinedDate: date("joinedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_status").on(table.status)]);

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

// Contributions Table
export const contributions = mysqlTable("contributions", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("memberId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: varchar("paymentType", { length: 50 }).default("Subscription"),
  month: varchar("month", { length: 50 }).notNull(),
  year: int("year").notNull(),
  status: varchar("status", { length: 50 }).default("Paid"),
  mpesaCode: varchar("mpesaCode", { length: 100 }),
  recordedBy: int("recordedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_member_month_year").on(table.memberId, table.month, table.year)]);

export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = typeof contributions.$inferInsert;

// Announcements Table
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).default("General"),
  priority: varchar("priority", { length: 50 }).default("Normal"),
  isPublished: boolean("isPublished").default(true),
  imageUrl: text("imageUrl"),
  postedBy: int("postedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("idx_published").on(table.isPublished)]);

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// Events Table
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: date("eventDate").notNull(),
  eventTime: varchar("eventTime", { length: 50 }),
  venue: text("venue"),
  category: varchar("category", { length: 50 }).default("Meeting"),
  imageUrl: text("imageUrl"),
  isPublished: boolean("isPublished").default(true),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_event_date").on(table.eventDate)]);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Gallery Table
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: text("caption"),
  eventId: int("eventId"),
  uploadedBy: int("uploadedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryImage = typeof gallery.$inferSelect;
export type InsertGalleryImage = typeof gallery.$inferInsert;

// Meeting Minutes Table
export const meetingMinutes = mysqlTable("meetingMinutes", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  meetingDate: date("meetingDate").notNull(),
  agenda: text("agenda"),
  minutesContent: text("minutesContent").notNull(),
  attendees: text("attendees"),
  decisions: text("decisions"),
  nextMeetingDate: date("nextMeetingDate"),
  recordedBy: int("recordedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MeetingMinutes = typeof meetingMinutes.$inferSelect;
export type InsertMeetingMinutes = typeof meetingMinutes.$inferInsert;

// Fund Transactions Table
export const fundTransactions = mysqlTable("fundTransactions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["Income", "Expense"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  reference: varchar("reference", { length: 100 }),
  transactionDate: date("transactionDate"),
  balanceAfter: decimal("balanceAfter", { precision: 10, scale: 2 }),
  recordedBy: int("recordedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("idx_type_date").on(table.type, table.transactionDate)]);

export type FundTransaction = typeof fundTransactions.$inferSelect;
export type InsertFundTransaction = typeof fundTransactions.$inferInsert;