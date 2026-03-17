import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users Table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
  lastSignedIn: text("lastSignedIn").default(sql`(datetime('now'))`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Admins Table
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

// Members Table
export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  membershipId: text("membershipId").notNull().unique(),
  fullName: text("fullName").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  studentId: text("studentId").unique(),
  course: text("course"),
  yearOfStudy: integer("yearOfStudy"),
  role: text("role").default("Member"),
  photoUrl: text("photoUrl"),
  status: text("status").default("Active"),
  joinedDate: text("joinedDate"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
}, (table) => [index("idx_status").on(table.status)]);

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

// Contributions Table
export const contributions = sqliteTable("contributions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("memberId").notNull(),
  amount: real("amount").notNull(),
  paymentType: text("paymentType").default("Subscription"),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  status: text("status").default("Paid"),
  mpesaCode: text("mpesaCode"),
  recordedBy: integer("recordedBy"),
  notes: text("notes"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
}, (table) => [index("idx_member_month_year").on(table.memberId, table.month, table.year)]);

export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = typeof contributions.$inferInsert;

// Announcements Table
export const announcements = sqliteTable("announcements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").default("General"),
  priority: text("priority").default("Normal"),
  isPublished: integer("isPublished", { mode: "boolean" }).default(true),
  imageUrl: text("imageUrl"),
  postedBy: integer("postedBy"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
}, (table) => [index("idx_published").on(table.isPublished)]);

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// Events Table
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: text("eventDate").notNull(),
  eventTime: text("eventTime"),
  venue: text("venue"),
  category: text("category").default("Meeting"),
  imageUrl: text("imageUrl"),
  isPublished: integer("isPublished", { mode: "boolean" }).default(true),
  createdBy: integer("createdBy"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
}, (table) => [index("idx_event_date").on(table.eventDate)]);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Gallery Table
export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: text("caption"),
  eventId: integer("eventId"),
  uploadedBy: integer("uploadedBy"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
});

export type GalleryImage = typeof gallery.$inferSelect;
export type InsertGalleryImage = typeof gallery.$inferInsert;

// Meeting Minutes Table
export const meetingMinutes = sqliteTable("meetingMinutes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  meetingDate: text("meetingDate").notNull(),
  agenda: text("agenda"),
  minutesContent: text("minutesContent").notNull(),
  attendees: text("attendees"),
  decisions: text("decisions"),
  nextMeetingDate: text("nextMeetingDate"),
  recordedBy: integer("recordedBy"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
});

export type MeetingMinutes = typeof meetingMinutes.$inferSelect;
export type InsertMeetingMinutes = typeof meetingMinutes.$inferInsert;

// Fund Transactions Table
export const fundTransactions = sqliteTable("fundTransactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["Income", "Expense"] }).notNull(),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  reference: text("reference"),
  transactionDate: text("transactionDate"),
  balanceAfter: real("balanceAfter"),
  recordedBy: integer("recordedBy"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
}, (table) => [index("idx_type_date").on(table.type, table.transactionDate)]);

export type FundTransaction = typeof fundTransactions.$inferSelect;
export type InsertFundTransaction = typeof fundTransactions.$inferInsert;