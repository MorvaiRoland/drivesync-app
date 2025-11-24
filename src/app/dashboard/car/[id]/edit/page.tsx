import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateCar } from "@/app/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: PageProps) {
  const resolvedParams = await params;
  const carId = Number(resolvedParams.id);
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  // Lekérjük a jelenlegi adatokat
  const car = await prisma.car.findUnique({ where: { id: carId } });
  
  if (!car) return <div>Autó nem található</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Autó szerkesztése</h1>
          <Link href={`/dashboard/car/${carId}`} className="text-gray-500 hover:text-gray-700 text-sm">
             Mégse ✕
          </Link>
        </div>

        <form action={updateCar} className="space-y-6">
          <input type="hidden" name="carId" value={carId} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Márka */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Márka</label>
              <input 
                name="brand" 
                defaultValue={car.brand || ""}
                type="text" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Típus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Típus</label>
              <input 
                name="type" 
                defaultValue={car.type || ""}
                type="text" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Rendszám */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rendszám</label>
              <input 
                name="license" 
                defaultValue={car.license || ""}
                type="text" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
            </div>

            {/* Évjárat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Évjárat</label>
              <input 
                name="vintage" 
                defaultValue={car.vintage || ""}
                type="number" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Üzemanyag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Üzemanyag</label>
              <select 
                name="fuelType" 
                defaultValue={car.fuelType || "Benzin"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Benzin">Benzin</option>
                <option value="Dízel">Dízel</option>
                <option value="Elektromos">Elektromos</option>
                <option value="Hibrid">Hibrid</option>
              </select>
            </div>
            
             {/* Szín */}
             <div className="md:col-span-2 flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Szín</label>
                  <input 
                    name="color" 
                    type="color" 
                    defaultValue={car.color || "#3b82f6"}
                    className="h-10 w-20 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="text-sm text-gray-500 pt-6">
                    A kilométeróra állást ({car.km} km) csak új szerviz rögzítésével tudod frissíteni.
                </div>
            </div>

          </div>

          <div className="pt-4">
             <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg"
             >
               Módosítások mentése
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}