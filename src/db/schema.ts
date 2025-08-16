import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm" // Import sql
import type { AdapterAccount } from "next-auth/adapters"

export const usersTable = sqliteTable("users", {
  id: text("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()), // Add default UUID generation
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image", { length: 255 }),
})

export const accountsTable = sqliteTable(
  "account",
  {
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessionsTable = sqliteTable("sessions", {
  sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: text("userId", { length: 255 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokensTable = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const logsTable = sqliteTable("logs", {
  id: text("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type", { length: 255 }).notNull(), // Add type field
  message: text("message").notNull(),
  Model: text("Model", { length: 255 }), // Add Model field (optional)
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  previousLogType: text("previous_log_type", { length: 255 }),
  previousLogTimestamp: integer("previous_log_timestamp", { mode: "timestamp_ms" }),
});