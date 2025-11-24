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

export async function updateCar(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Nincs bejelentkezve" };

  const carId = Number(formData.get("carId"));

  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cars: true }
  });
  const isMyCar = user?.cars.some(c => c.id === carId);
  if (!isMyCar) return { error: "Nincs jogosultságod szerkeszteni ezt az autót." };

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
    console.error("Hiba:", error);
    return { error: "Sikertelen frissítés" };
  }

  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}

// --- SZERVIZ MŰVELETEK ---

export async function addService(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Nincs bejelentkezve" };

  const carId = Number(formData.get("carId"));
  
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cars: true }
  });

  const isMyCar = user?.cars.some(c => c.id === carId);
  if (!isMyCar) return { error: "Nincs jogosultságod." };

  const serviceTypeId = Number(formData.get("serviceTypeId"));
  const dateStr = formData.get("date") as string;
  const km = Number(formData.get("km"));
  const price = Number(formData.get("price"));
  const replacedParts = formData.get("replacedParts") as string;

  try {
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

    // Frissítjük az autó kilométeróra állását is
    await prisma.car.update({
        where: { id: carId },
        data: { km: km }
    });

  } catch (error) {
    console.error("Szerviz mentési hiba:", error);
    return { error: "Sikertelen mentés" };
  }

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