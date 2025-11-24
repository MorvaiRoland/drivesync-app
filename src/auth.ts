import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Típusbővítés
declare module "next-auth" {
  interface Session {
    user: {
      id: string;      
      username: string;
      email: string;
      name: string;
      image?: string | null;
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, // Élesben majd kapcsold ki, ha minden stabil!
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

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });

          // Google loginnal regisztrált usernek nincs jelszava, vagy placeholder van
          if (!user || !user.password || user.password === "GOOGLE_LOGIN_GENERATED_PASSWORD") {
            return null; 
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) return null; 

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            username: user.username,
          }; 
        } catch (error) {
          console.error("Adatbázis hiba a belépésnél:", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // @ts-ignore
        token.username = user.username; 
      }
      return token;
    },
    async session({ session }) {
       if (session.user?.email) {
           try {
             const dbUser = await prisma.user.findUnique({
                 where: { email: session.user.email }
             });
             
             if (dbUser) {
                 session.user.id = dbUser.id.toString();
                 session.user.username = dbUser.username;
                 session.user.name = dbUser.username || dbUser.email;
             }
           } catch (error) {
             console.error("Session lekérdezési hiba:", error);
           }
       }
       return session;
    },
    async signIn({ user, account }) {
      // Csak Google belépésnél futtatjuk ezt a logikát
      if (account?.provider === "google") {
        const email = user.email
        if (!email) return false 

        try {
          const existingUser = await prisma.user.findUnique({ where: { email } })

          if (!existingUser) {
            // --- JAVÍTOTT FELHASZNÁLÓNÉV GENERÁLÁS ---
            // Az email első része + egy random szám + időbélyeg utolsó 3 számjegye
            // Ez szinte garantálja az egyediséget ütközés nélkül.
            let baseName = email.split('@')[0].substring(0, 15); // Max 15 karakter az elejéből
            let newUsername = `${baseName}_${Math.floor(Math.random() * 10000)}`;

            // Biztonsági ellenőrzés (bár az esély minimális)
            const checkUsername = await prisma.user.findUnique({ where: { username: newUsername } })
            if (checkUsername) {
                newUsername = `${baseName}_${Date.now()}`;
            }

            await prisma.user.create({
              data: {
                email: email,
                username: newUsername,
                password: "GOOGLE_LOGIN_GENERATED_PASSWORD",
                isDark: false,
                registerDate: new Date(),
                twoFactorAuthEnabled: false,
                // Itt NE hozzunk létre autókat, mert az "User" modellben lehet, hogy a cars kötelező reláció, 
                // de a create-nél elég, ha üres tömböt sem adunk át, ha a prisma schema engedi.
                // Ha a prisma sémában a 'cars' nincs explicit megkövetelve create-nél, akkor ez így jó.
              }
            })
            console.log(`Új Google felhasználó létrehozva: ${email}`);
          }
        } catch (error) {
          console.error("KRITIKUS HIBA a Google SignIn callbackben:", error);
          // FONTOS: Ha itt hibát dobunk (return false), a user "Access Denied"-et kap.
          // Ha return true-t adunk, a NextAuth beengedi a usert sessionbe, 
          // de az adatbázisban nem lesz ott.
          // Mivel megcsináltuk a "Dashboard lazy creation"-t az előző lépésben,
          // itt biztonságosabb a 'true' visszaadása, hogy a Dashboard majd megoldja a mentést.
          return true; 
        }
      }
      return true
    },
  },
})