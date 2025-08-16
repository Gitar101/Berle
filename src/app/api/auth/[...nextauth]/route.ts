import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const authOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: schema.usersTable,
    accountsTable: schema.accountsTable,
    sessionsTable: schema.sessionsTable,
    verificationTokensTable: schema.verificationTokensTable,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT as string,
      clientSecret: process.env.OAUTH_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }