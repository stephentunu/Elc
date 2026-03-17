import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getDb } from "../db";
import { admins } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }

  // If OAuth auth failed, check for our custom admin token
  if (!user) {
    try {
      const authHeader = opts.req.headers["x-admin-token"] as string;
      const cookieHeader = opts.req.headers.cookie || "";
      
      // Extract elc_admin_email from header or cookie
      const adminEmail = opts.req.headers["x-admin-email"] as string;
      
      if (authHeader && authHeader.startsWith("admin_") && adminEmail) {
        const db = getDb();
        const adminResult = db.select().from(admins).where(eq(admins.email, adminEmail)).limit(1).all();
        
        if (adminResult.length > 0) {
          const admin = adminResult[0];
          // Create a synthetic user object with admin role
          user = {
            id: admin.id,
            openId: `admin_${admin.id}`,
            name: admin.name,
            email: admin.email,
            loginMethod: "local",
            role: "admin",
            createdAt: admin.createdAt,
            updatedAt: admin.createdAt,
            lastSignedIn: admin.createdAt,
          } as unknown as User;
        }
      }
    } catch (error) {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}