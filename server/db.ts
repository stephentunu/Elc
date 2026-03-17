import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users, admins, members, contributions, announcements, events, gallery, meetingMinutes, fundTransactions } from "../drizzle/schema";

export type InsertUser = typeof users.$inferInsert;

const sqlite = new Database("./database.db");
const db = drizzle(sqlite);

export function getDb() {
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date().toISOString() };
  if (user.name !== undefined) updateSet.name = user.name;
  if (user.email !== undefined) updateSet.email = user.email;
  if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod;
  if (user.role !== undefined) updateSet.role = user.role;
  db.insert(users).values({
    ...user,
    lastSignedIn: new Date().toISOString(),
  }).onConflictDoUpdate({
    target: users.openId,
    set: updateSet,
  }).run();
}

export async function getUserByOpenId(openId: string) {
  const result = db.select().from(users).where(eq(users.openId, openId)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getAdminByEmail(email: string) {
  const result = db.select().from(admins).where(eq(admins.email, email)).limit(1).all();
  return result[0] ?? undefined;
}

export async function generateMembershipId() {
  const year = new Date().getFullYear();
  const result = db.select({ count: sql<number>`COUNT(*)` })
    .from(members)
    .where(sql`strftime('%Y', ${members.joinedDate}) = ${String(year)}`)
    .all();
  const count = (result[0]?.count || 0) + 1;
  return `ELC-${year}-${String(count).padStart(4, '0')}`;
}

export async function getAllMembers(limit = 50, offset = 0) {
  return db.select().from(members).limit(limit).offset(offset).all();
}

export async function getMemberById(id: number) {
  const result = db.select().from(members).where(eq(members.id, id)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getAnnouncementsByStatus(isPublished = true, limit = 20) {
  return db.select().from(announcements)
    .where(eq(announcements.isPublished, isPublished))
    .orderBy(desc(announcements.createdAt))
    .limit(limit).all();
}

export async function getEventsByDate(upcomingOnly = true) {
  return db.select().from(events)
    .where(eq(events.isPublished, true))
    .orderBy(events.eventDate).all();
}

export async function getContributionsByMember(memberId: number) {
  return db.select().from(contributions)
    .where(eq(contributions.memberId, memberId))
    .orderBy(desc(contributions.createdAt)).all();
}

export async function getTotalFundBalance() {
  const result = db.select({
    balance: sql<number>`COALESCE(SUM(CASE WHEN ${fundTransactions.type} = 'Income' THEN ${fundTransactions.amount} ELSE -${fundTransactions.amount} END), 0)`
  }).from(fundTransactions).all();
  return parseFloat(result[0]?.balance?.toString() || '0');
}

export async function getGalleryImages(limit = 50) {
  return db.select().from(gallery).orderBy(desc(gallery.createdAt)).limit(limit).all();
}