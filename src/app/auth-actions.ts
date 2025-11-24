'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string

  if (!email || !password || !username) {
    return { error: "Minden mező kitöltése kötelező!" }
  }

  // Ellenőrizzük, hogy létezik-e már
  const existingUser = await prisma.user.findFirst({
    where: {
        OR: [
            { email: email },
            { username: username }
        ]
    }
  })

  if (existingUser) {
    return { error: "Ez az email cím vagy felhasználónév már foglalt." }
  }

  // Jelszó titkosítása
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        isDark: false,
        registerDate: new Date(),
        twoFactorAuthEnabled: false
      }
    })
  } catch (err) {
    return { error: "Hiba történt a regisztráció során." }
  }

  // Sikeres regisztráció után automatikus belépés
  // De itt most visszatérünk sikerrel, hogy a UI átváltson
  return { success: true }
}

export async function loginUser(formData: FormData) {
    try {
      await signIn("credentials", formData)
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Hibás email cím vagy jelszó." }
          default:
            return { error: "Valami hiba történt." }
        }
      }
      throw error
    }
}