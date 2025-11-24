import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addUpcomingService } from "@/app/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewUpcomingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const carId = Number(resolvedParams.id);
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) return <div>Autó nem található</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Új Emlékeztető</h1>
          <Link href={`/dashboard/car/${carId}`} className="text-gray-500 hover:text-gray-700">
             Mégse ✕
          </Link>
        </div>

        <form action={addUpcomingService} className="space-y-5">
          <input type="hidden" name="carId" value={carId} />

          {/* Feladat neve (Notes mezőbe mentjük) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mi a teendő?</label>
            <input 
              name="notes" 
              type="text" 
              placeholder="Pl. Műszaki vizsga, Olajcsere" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Dátum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Határidő</label>
            <input 
              name="serviceDate" 
              type="date" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Helyszín */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Helyszín / Szerviz neve (Opcionális)</label>
            <input 
              name="location" 
              type="text" 
              placeholder="Pl. Wallis Motor" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition shadow-md mt-4"
          >
            Emlékeztető Mentése
          </button>
        </form>
      </div>
    </div>
  );
}