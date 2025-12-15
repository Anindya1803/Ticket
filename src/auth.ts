import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import type { NextAuthConfig } from "next-auth"

export const config = {
    adapter: PrismaAdapter(db) as any,
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Add logic here to verify credentials from DB
                // For now returning null as placeholder
                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            if (session.user && token.role) {
                session.user.role = token.role as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                token.role = user.role // Prisma adapter should provide this
            }
            return token
        }
    },
    session: { strategy: "jwt" },
    // pages: {
    //     signIn: '/auth/signin',
    // }

} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
