import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcryptjs from "bcryptjs";
import { getDb, getAdminByEmail, generateMembershipId, getAllMembers, getMemberById, getAnnouncementsByStatus, getEventsByDate, getContributionsByMember, getTotalFundBalance, getGalleryImages } from "./db";
import { admins, members, contributions, announcements, events, gallery, meetingMinutes, fundTransactions } from "../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    
    adminLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const admin = await getAdminByEmail(input.email);
        if (!admin) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        
        const passwordMatch = await bcryptjs.compare(input.password, admin.password);
        if (!passwordMatch) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        
        return { admin: { id: admin.id, name: admin.name, email: admin.email } };
      }),
  }),

  members: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0), status: z.string().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        
        if (input.status) {
          return await db.select().from(members).where(eq(members.status, input.status)).limit(input.limit).offset(input.offset) as any;
        }
        return await db.select().from(members).limit(input.limit).offset(input.offset) as any;
      }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getMemberById(input);
      }),
    
    create: adminProcedure
      .input(z.object({
        fullName: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        studentId: z.string().optional(),
        course: z.string().optional(),
        yearOfStudy: z.number().optional(),
        role: z.string().default("Member"),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const membershipId = await generateMembershipId();
        const joinedDate = new Date().toISOString().split('T')[0];
        
        const result = await db.insert(members).values({
          membershipId,
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          studentId: input.studentId,
          course: input.course,
          yearOfStudy: input.yearOfStudy,
          role: input.role,
          photoUrl: input.photoUrl,
          joinedDate: joinedDate as any,
        });
        
        return { membershipId, id: (result as any).insertId };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        course: z.string().optional(),
        yearOfStudy: z.number().optional(),
        role: z.string().optional(),
        photoUrl: z.string().optional(),
        status: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const { id, ...updateData } = input;
        await db.update(members).set(updateData).where(eq(members.id, id));
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        await db.update(members).set({ status: "Inactive" }).where(eq(members.id, input));
        return { success: true };
      }),
    
    getContributions: adminProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getContributionsByMember(input);
      }),
  }),

  contributions: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db.select().from(contributions).orderBy(desc(contributions.createdAt)).limit(input.limit).offset(input.offset) as any;
      }),
    
    create: adminProcedure
      .input(z.object({
        memberId: z.number(),
        amount: z.number(),
        paymentType: z.string().default("Subscription"),
        month: z.string(),
        year: z.number(),
        mpesaCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const result = await db.insert(contributions).values({
          memberId: input.memberId,
          amount: input.amount.toString() as any,
          paymentType: input.paymentType,
          month: input.month,
          year: input.year,
          mpesaCode: input.mpesaCode,
          notes: input.notes,
          status: "Paid",
        });
        
        return { success: true, id: (result as any).insertId };
      }),
  }),

  announcements: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getAnnouncementsByStatus(true, input.limit);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        category: z.string().default("General"),
        priority: z.string().default("Normal"),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const result = await db.insert(announcements).values({
          title: input.title,
          content: input.content,
          category: input.category,
          priority: input.priority,
          imageUrl: input.imageUrl,
          isPublished: true,
        });
        
        return { success: true, id: (result as any).insertId };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        priority: z.string().optional(),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const { id, ...updateData } = input;
        await db.update(announcements).set(updateData).where(eq(announcements.id, id));
        return { success: true };
      }),
  }),

  events: router({
    list: publicProcedure
      .input(z.object({ upcoming: z.boolean().default(true) }))
      .query(async ({ input }) => {
        return await getEventsByDate(input.upcoming);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        eventDate: z.string(),
        eventTime: z.string().optional(),
        venue: z.string().optional(),
        category: z.string().default("Meeting"),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const result = await db.insert(events).values({
          title: input.title,
          description: input.description,
          eventDate: input.eventDate as any,
          eventTime: input.eventTime,
          venue: input.venue,
          category: input.category,
          imageUrl: input.imageUrl,
          isPublished: true,
        });
        
        return { success: true, id: (result as any).insertId };
      }),
  }),

  gallery: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await getGalleryImages(input.limit);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        imageUrl: z.string(),
        caption: z.string().optional(),
        eventId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const result = await db.insert(gallery).values({
          title: input.title,
          imageUrl: input.imageUrl,
          caption: input.caption,
          eventId: input.eventId,
        });
        
        return { success: true, id: (result as any).insertId };
      }),
  }),

  minutes: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db.select().from(meetingMinutes).orderBy(desc(meetingMinutes.meetingDate)).limit(input.limit) as any;
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        meetingDate: z.string(),
        agenda: z.string().optional(),
        minutesContent: z.string(),
        attendees: z.string().optional(),
        decisions: z.string().optional(),
        nextMeetingDate: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const result = await db.insert(meetingMinutes).values({
          title: input.title,
          meetingDate: input.meetingDate as any,
          agenda: input.agenda,
          minutesContent: input.minutesContent,
          attendees: input.attendees,
          decisions: input.decisions,
          nextMeetingDate: input.nextMeetingDate as any,
        });
        
        return { success: true, id: (result as any).insertId };
      }),
  }),

  finance: router({
    getBalance: adminProcedure.query(async () => {
      return await getTotalFundBalance();
    }),
    
    listTransactions: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db.select().from(fundTransactions).orderBy(desc(fundTransactions.transactionDate)).limit(input.limit).offset(input.offset) as any;
      }),
    
    recordTransaction: adminProcedure
      .input(z.object({
        type: z.enum(["Income", "Expense"]),
        amount: z.number(),
        description: z.string(),
        category: z.string().optional(),
        reference: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const balance = await getTotalFundBalance();
        const newBalance = input.type === "Income" ? balance + input.amount : balance - input.amount;
        
        const result = await db.insert(fundTransactions).values({
          type: input.type,
          amount: input.amount.toString() as any,
          description: input.description,
          category: input.category,
          reference: input.reference,
          transactionDate: new Date().toISOString().split('T')[0] as any,
          balanceAfter: newBalance.toString() as any,
        });
        
        return { success: true, newBalance, id: (result as any).insertId };
      }),
  }),

  dashboard: router({
    getStats: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { totalMembers: 0, activeMembers: 0, totalContributions: 0, balance: 0 };
      
      const totalMembersResult = await db.select({ count: sql<number>`COUNT(*)` }).from(members) as any;
      const activeMembersResult = await db.select({ count: sql<number>`COUNT(*)` }).from(members).where(eq(members.status, "Active")) as any;
      const balance = await getTotalFundBalance();
      
      return {
        totalMembers: totalMembersResult[0]?.count || 0,
        activeMembers: activeMembersResult[0]?.count || 0,
        balance,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
