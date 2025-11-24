'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- AUTÓ MŰVELETEK ---

export async function addCar(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Nincs bejelentkezve!" }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return { error: "Felhasználó nem található" }

  const brand = formData.get("brand") as string
  const type = formData.get("type") as string
  const license = formData.get("license") as string
  const vintage = Number(formData.get("vintage"))
  const km = Number(formData.get("km"))
  const fuelType = formData.get("fuelType") as string
  const color = formData.get("color") as string

  try {
    await prisma.car.create({
      data: {
        ownerId: user.id,
        brand,
        type,
        license,
        vintage,
        km,
        fuelType,
        color,
        archived: false
      }
    })
  } catch (error) {
    console.error("Adatbázis hiba:", error)
    return { error: "Hiba történt a mentés során." }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteCar(carId: number) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Nincs bejelentkezve" }

  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
  })

  const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { ownerId: true }
  })

  if (!car || !user || car.ownerId !== user.id) {
      return { error: "Nincs jogosultságod törölni ezt az autót." }
  }

  await prisma.car.delete({
      where: { id: carId }
  })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// src/app/actions.ts

export async function updateCar(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return; // Ha nincs belépve, ne csináljon semmit, NextAuth kezeli

  const carId = Number(formData.get("carId"));

  // Ezt a rész lehet, hogy egyszerűbb lenne elhagyni a Vercel-hez.
  // Mivel a prisma.car.update a user.id alapján nem tud szűrni, 
  // így az ownerId checket kell futtatnunk itt, különben bárki frissíthetne.
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
  });

  const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { ownerId: true }
  })

  if (!car || !user || car.ownerId !== user.id) {
      // Hiba esetén NE adjunk vissza semmit, csak console log és visszairányítás a dashboardra
      console.error("JOGOSULTSÁGI HIBA: Valaki más autóját akarták szerkeszteni.");
      redirect('/dashboard'); 
  }

  // Típuskényszerítés nélkül
  const brand = formData.get("brand") as string;
  const type = formData.get("type") as string;
  const license = formData.get("license") as string;
  const vintage = Number(formData.get("vintage"));
  const fuelType = formData.get("fuelType") as string;
  const color = formData.get("color") as string;

  try {
    await prisma.car.update({
      where: { id: carId },
      data: {
        brand,
        type,
        license,
        vintage,
        fuelType,
        color
      }
    });
  } catch (error) {
    console.error("Adatbázis frissítési hiba:", error);
    // Ezt a hibát nem tudjuk elegánsan kijelezni a felhasználónak Server Actionben, csak logoljuk.
  }

  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}
// --- SZERVIZ MŰVELETEK ---

// src/app/actions.ts

export async function addService(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return; // Ha nincs belépve, ne csináljon semmit

  const carId = Number(formData.get("carId"));
  
  // Jogosultság ellenőrzés
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cars: true }
  });

  const isMyCar = user?.cars.some(c => c.id === carId);
  if (!isMyCar) {
    console.error("JOGOSULTSÁGI HIBA: Valaki más autójához akart szervizt hozzáadni.");
    redirect('/dashboard'); // Visszairányítjuk a dashboardra
  }

  // Adatok kinyerése
  const serviceTypeId = Number(formData.get("serviceTypeId"));
  const dateStr = formData.get("date") as string; // YYYY-MM-DD
  const km = Number(formData.get("km"));
  const price = Number(formData.get("price"));
  const replacedParts = formData.get("replacedParts") as string;

  try {
    // 1. Szerviz létrehozása
    await prisma.service.create({
      data: {
        carId,
        serviceTypeId,
        serviceDate: new Date(dateStr),
        km,
        price,
        replacedParts
      }
    });

    // 2. EXTRA: Az autó kilométerállását is frissítjük a legújabbra!
    await prisma.car.update({
        where: { id: carId },
        data: { km: km }
    });

  } catch (error) {
    console.error("Szerviz mentési hiba:", error);
    // Hiba esetén itt nem adunk vissza object-et, hanem csak befejezzük.
  }

  // Siker esetén navigálás
  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}
export async function deleteServiceRecord(serviceId: number) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { carId: true }
  });

  if (service) {
    await prisma.service.delete({
      where: { id: serviceId }
    });
    
    revalidatePath(`/dashboard/car/${service.carId}`);
  }
}

// --- EMLÉKEZTETŐ MŰVELETEK ---

export async function addUpcomingService(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Nincs bejelentkezve" };

  const carId = Number(formData.get("carId"));
  const dateStr = formData.get("serviceDate") as string;
  const location = formData.get("location") as string;
  const notes = formData.get("notes") as string;

  try {
    await prisma.upcomingService.create({
      data: {
        carId,
        serviceDate: new Date(dateStr),
        location,
        notes,
        reminder: true,
        archived: false
      }
    });
  } catch (error) {
    console.error("Hiba:", error);
    return { error: "Sikertelen mentés" };
  }

  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}

export async function deleteUpcomingService(id: number) {
  await prisma.upcomingService.delete({ where: { id } });
  revalidatePath('/dashboard/car/[id]', 'page'); 
}