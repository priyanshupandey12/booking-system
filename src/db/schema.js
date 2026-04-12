import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";



export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  isbooked: integer("isbooked").default(0),
  userId: integer("user_id").references(() => users.id),
});

