import { sqliteTable, AnySQLiteColumn, foreignKey, primaryKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const account = sqliteTable("account", {
	userId: text({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	type: text({ length: 255 }).notNull(),
	provider: text({ length: 255 }).notNull(),
	providerAccountId: text({ length: 255 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type", { length: 255 }),
	scope: text({ length: 255 }),
	idToken: text("id_token"),
	sessionState: text("session_state", { length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
]);

export const logs = sqliteTable("logs", {
	id: text({ length: 255 }).primaryKey().notNull(),
	type: text({ length: 255 }).notNull(),
	message: text().notNull(),
	model: text("Model", { length: 255 }),
	timestamp: integer().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	previousLogType: text("previous_log_type", { length: 255 }),
	previousLogTimestamp: integer("previous_log_timestamp"),
});

export const sessions = sqliteTable("sessions", {
	sessionToken: text({ length: 255 }).primaryKey().notNull(),
	userId: text({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	expires: integer().notNull(),
});

export const users = sqliteTable("users", {
	id: text({ length: 255 }).primaryKey().notNull(),
	name: text({ length: 255 }),
	email: text({ length: 255 }).notNull(),
	emailVerified: integer(),
	image: text({ length: 255 }),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

export const verificationToken = sqliteTable("verificationToken", {
	identifier: text({ length: 255 }).notNull(),
	token: text({ length: 255 }).notNull(),
	expires: integer().notNull(),
},
(table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"})
]);

