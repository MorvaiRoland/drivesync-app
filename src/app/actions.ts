'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Definiáljuk a választípusokat a TypeScriptnek
type ActionResponse = { error?: string } | void;

// --- AUTÓ MŰVELETEK ---

export async function addCar(formData: FormData): Promise<ActionResponse> {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/login');
  }

  const brand = formData.get("brand") as string
  const type = formData.get("type") as string
  const license = formData.get("license") as string
  const vintage = Number(formData.get("vintage"))
  const km = Number(formData.get("km"))
  const fuelType = formData.get("fuelType") as string
  const color = formData.get("color") as string

  // Validáció
  if (!brand || !license) {
      return { error: "A márka és a rendszám kötelező!" };
  }

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
    console.error("Adatbázis hiba az autó mentésekor:", error)
    return { error: "Sikertelen mentés. Az adatbázis nem érhető el, vagy a rendszám már létezik." };
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteCar(carId: number): Promise<ActionResponse> {
  const session = await auth()
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
  })

  const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { ownerId: true }
  })

  if (!car || !user || car.ownerId !== user.id) {
      return { error: "Nincs jogosultságod törölni ezt az autót." };
  }

  try {
    await prisma.car.delete({
        where: { id: carId }
    })
  } catch (error) {
      console.error("Hiba törléskor:", error);
      return { error: "Nem sikerült törölni az autót." };
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateCar(formData: FormData): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const carId = Number(formData.get("carId"));
  
  // Jogosultság ellenőrzés
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cars: { select: { id: true } } } 
  });
  
  const isMyCar = user?.cars.some(c => c.id === carId);
  if (!isMyCar) {
      return { error: "Nincs jogosultságod szerkeszteni ezt az autót." };
  }

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
    console.error("Hiba a frissítés során:", error);
    return { error: "Sikertelen frissítés." };
  }

  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}

// --- SZERVIZ MŰVELETEK ---

export async function addService(formData: FormData): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const carId = Number(formData.get("carId"));
  
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cars: { select: { id: true } } }
  });

  const isMyCar = user?.cars.some(c => c.id === carId);
  if (!isMyCar) {
      return { error: "Hiba: Nem a te autódhoz próbálsz szervizt rögzíteni." };
  }

  const serviceTypeId = Number(formData.get("serviceTypeId"));
  const dateStr = formData.get("date") as string;
  const km = Number(formData.get("km"));
  const price = Number(formData.get("price"));
  const replacedParts = formData.get("replacedParts") as string;

  try {
    // Tranzakció: Szerviz létrehozása ÉS autó kilométeróra frissítése egyszerre
    await prisma.$transaction([
        prisma.service.create({
            data: {
                carId,
                serviceTypeId,
                serviceDate: new Date(dateStr),
                km,
                price,
                replacedParts
            }
        }),
        prisma.car.update({
            where: { id: carId },
            data: { km: km } 
        })
    ]);

  } catch (error) {
    console.error("Szerviz mentési hiba:", error);
    return { error: "Sikertelen szerviz mentés." };
  }

  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}

export async function deleteServiceRecord(serviceId: number): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { carId: true } // Csak a carId kell a revalidate-hez
    });

    if (service) {
      await prisma.service.delete({
        where: { id: serviceId }
      });
      
      revalidatePath(`/dashboard/car/${service.carId}`);
    }
  } catch (error) {
    console.error("Hiba a szerviz törlésekor:", error);
    return { error: "Nem sikerült törölni a bejegyzést." };
  }
}

// --- EMLÉKEZTETŐ MŰVELETEK ---

export async function addUpcomingService(formData: FormData): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

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
    console.error("Emlékeztető mentési hiba:", error);
    return { error: "Nem sikerült menteni az emlékeztetőt." };
  }

  revalidatePath(`/dashboard/car/${carId}`);
  redirect(`/dashboard/car/${carId}`);
}

export async function deleteUpcomingService(id: number): Promise<ActionResponse> {
  try {
      await prisma.upcomingService.delete({ where: { id } });
      // Megjegyzés: Itt a pontos path megadása a legbiztonságosabb, de mivel nincs contextünk a carId-ról,
      // a dashboard/car/[id] nem mindig működik jól revalidate-nél paraméter nélkül. 
      // Ha van ID-d, inkább azt használd, vagy revalidate-eld a teljes dashboardot.
      revalidatePath('/dashboard'); 
  } catch (e) {
      console.error(e);
      return { error: "Hiba a törléskor" };
  }
}