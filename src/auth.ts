import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ÚJ: Felhasználónév/Jelszó bejelentkezés támogatása
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Jelszó", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Keressük a felhasználót email alapján
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null; // Nincs ilyen user
        }

        // Jelszó ellenőrzése (összehasonlítjuk a megadottat a titkosítottal)
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Rossz jelszó
        }

        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      // Google logika marad a régi
      if (account?.provider === "google") {
        const email = user.email
        if (!email) return false 

        try {
          const existingUser = await prisma.user.findUnique({ where: { email } })

          if (!existingUser) {
            let newUsername = email.split('@')[0]
            const checkUsername = await prisma.user.findUnique({ where: { username: newUsername } })
            if (checkUsername) newUsername = `${newUsername}${Math.floor(Math.random() * 1000)}`

            await prisma.user.create({
              data: {
                email: email,
                username: newUsername,
                password: "GOOGLE_LOGIN_GENERATED_PASSWORD",
                isDark: false,
                registerDate: new Date(),
                twoFactorAuthEnabled: false
              }
            })
          }
        } catch (error) {
          console.error("Hiba:", error)
          return false
        }
      }
      return true
    },
    async session({ session }) {
       if (session.user && session.user.email) {
         const dbUser = await prisma.user.findUnique({ 
            where: { email: session.user.email }
         })
         if (dbUser) {
             // @ts-ignore
             session.user.id = dbUser.id.toString() 
             // @ts-ignore
             session.user.username = dbUser.username
         }
       }
       return session
    }
  },
})