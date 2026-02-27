import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, admins, members, contributions, announcements, events, gallery, meetingMinutes, fundTransactions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// MMU ELC Database Helpers

export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function generateMembershipId() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const year = new Date().getFullYear();
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(members).where(sql`YEAR(${members.joinedDate}) = ${year}`);
  const count = (result[0]?.count || 0) + 1;
  const paddedNumber = String(count).padStart(4, '0');
  return `ELC-${year}-${paddedNumber}`;
}

export async function getAllMembers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(members).limit(limit).offset(offset);
}

export async function getMemberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAnnouncementsByStatus(isPublished = true, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(announcements).where(eq(announcements.isPublished, isPublished)).orderBy(desc(announcements.createdAt)).limit(limit);
}

export async function getEventsByDate(upcomingOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const today = new Date().toISOString().split('T')[0];
  const query = upcomingOnly ? sql`${events.eventDate} >= ${today}` : sql`${events.eventDate} < ${today}`;
  return await db.select().from(events).where(and(eq(events.isPublished, true), query)).orderBy(events.eventDate);
}

export async function getContributionsByMember(memberId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contributions).where(eq(contributions.memberId, memberId)).orderBy(desc(contributions.createdAt));
}

export async function getTotalFundBalance() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ balance: sql<number>`COALESCE(SUM(CASE WHEN ${fundTransactions.type} = 'Income' THEN ${fundTransactions.amount} ELSE -${fundTransactions.amount} END), 0)` }).from(fundTransactions);
  return parseFloat(result[0]?.balance?.toString() || '0');
}

export async function getGalleryImages(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(gallery).orderBy(desc(gallery.createdAt)).limit(limit);
}
