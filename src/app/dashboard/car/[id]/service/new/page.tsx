import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addService } from "@/app/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const carId = Number(resolvedParams.id);
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  // Lekérjük az autót (hogy kiírjuk a nevét) és a szerviztípusokat (a legördülőhöz)
  const car = await prisma.car.findUnique({ where: { id: carId } });
  const serviceTypes = await prisma.serviceType.findMany({
      orderBy: { name: 'asc' } // ABC sorrendben
  });

  if (!car) return <div>Autó nem található</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Szerviz rögzítése</h1>
            <p className="text-gray-500 text-sm">Jármű: {car.brand} {car.type} ({car.license})</p>
          </div>
          <Link href={`/dashboard/car/${carId}`} className="text-gray-500 hover:text-gray-700 text-sm">
             Mégse ✕
          </Link>
        </div>

        <form action={addService} className="space-y-6">
          {/* Rejtett mező, hogy tudjuk melyik autóhoz mentünk */}
          <input type="hidden" name="carId" value={carId} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dátum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dátum</label>
              <input 
                name="date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]} // Mai nap alapból
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Szerviz Típusa (Legördülő) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Elvégzett munka</label>
              <select 
                name="serviceTypeId" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">-- Válassz típust --</option>
                {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
              </select>
            </div>

            {/* Kilométeróra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aktuális Km óra állás</label>
              <input 
                name="km" 
                type="number" 
                defaultValue={car.km || 0}
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Költség */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Költség (Ft)</label>
              <input 
                name="price" 
                type="number" 
                placeholder="25000" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
             {/* Megjegyzés / Alkatrészek */}
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cserélt alkatrészek / Megjegyzés</label>
              <textarea 
                name="replacedParts" 
                rows={3}
                placeholder="Pl. Castrol 5W30 olaj, Mann filter..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

          </div>

          <div className="pt-4">
             <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg"
             >
               Szerviz Mentése
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}