import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Típusbővítés, hogy a TypeScript ne reklamáljon az egyedi mezők miatt
declare module "next-auth" {
  interface Session {
    user: {
      id: string;      // Az ID nálunk string lesz (az adatbázis INT-jéből konvertálva)
      username: string;
      email: string;
      name: string;
      image?: string | null;
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // Ha nincs user, vagy Google-ös user (nincs jelszava), nem engedjük be itt
        if (!user || !user.password || user.password === "GOOGLE_LOGIN_GENERATED_PASSWORD") {
          return null; 
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null; 
        }

        // Visszatérünk egy egyszerű objektummal, ami megfelel a User típusnak
        return {
            id: user.id.toString(), // Itt konvertáljuk stringgé az INT-et
            email: user.email,
            name: user.username,
            username: user.username,
        }; 
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // 1. JWT létrehozása/frissítése
    async jwt({ token, user }) {
        // Bejelentkezéskor (amikor van 'user' objektum)
        if (user) {
            token.id = user.id;
            token.email = user.email;
            // @ts-ignore - A username mezőt mi adtuk hozzá
            token.username = user.username; 
        }
        return token;
    },
    // 2. Session létrehozása a kliensnek
    async session({ session }) {
       // A legbiztosabb módszer: Mindig az adatbázisból kérjük le az ID-t az email alapján.
       // Ez garantálja, hogy Google login esetén is a MySQL ID-t kapjuk meg, ne a Google ID-t.
       if (session.user?.email) {
           const dbUser = await prisma.user.findUnique({
               where: { email: session.user.email }
           });
           
           if (dbUser) {
               // Itt végezzük el a kritikus típuskonverziót (number -> string)
               session.user.id = dbUser.id.toString();
               session.user.username = dbUser.username;
               // Ha nincs név beállítva, használjuk a felhasználónevet
               session.user.name = dbUser.username || dbUser.email;
           }
       }
       return session;
    },
    async signIn({ user, account }) {
      // Google bejelentkezés logika
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
  },
})