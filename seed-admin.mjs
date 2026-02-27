import { drizzle } from "drizzle-orm/mysql2";
import bcryptjs from "bcryptjs";
import mysql from "mysql2/promise";
import { admins } from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seedAdmin() {
  try {
    // Create connection
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    // Hash the password
    const hashedPassword = await bcryptjs.hash("pass1234", 10);

    // Check if admin already exists
    const existing = await db.select().from(admins);

    if (existing.length > 0) {
      console.log("Admin user already exists");
      await connection.end();
      return;
    }

    // Insert admin user
    await db.insert(admins).values({
      name: "Admin",
      email: "admins@gmail.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    console.log("✓ Admin user created successfully");
    console.log("Email: admins@gmail.com");
    console.log("Password: pass1234");

    await connection.end();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
