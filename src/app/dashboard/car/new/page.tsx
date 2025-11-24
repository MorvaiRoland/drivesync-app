import { addCar } from "@/app/actions";
import Link from "next/link";

export default function NewCarPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Új autó rögzítése</h1>
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">
             ← Vissza
          </Link>
        </div>

        <form action={addCar} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Márka */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Márka</label>
              <input 
                name="brand" 
                type="text" 
                placeholder="Pl. BMW" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Típus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Típus</label>
              <input 
                name="type" 
                type="text" 
                placeholder="Pl. 320d" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Rendszám */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rendszám</label>
              <input 
                name="license" 
                type="text" 
                placeholder="ABC-123" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition uppercase"
              />
            </div>

            {/* Évjárat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Évjárat</label>
              <input 
                name="vintage" 
                type="number" 
                placeholder="2018" 
                min="1900" 
                max="2026"
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Üzemanyag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Üzemanyag</label>
              <select 
                name="fuelType" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="Benzin">Benzin</option>
                <option value="Dízel">Dízel</option>
                <option value="Elektromos">Elektromos</option>
                <option value="Hibrid">Hibrid</option>
              </select>
            </div>

            {/* Kilométeróra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jelenlegi Km állás</label>
              <input 
                name="km" 
                type="number" 
                placeholder="150000" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            
             {/* Színválasztó */}
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Autó színe (megjelenéshez)</label>
              <div className="flex items-center gap-4">
                  <input 
                    name="color" 
                    type="color" 
                    defaultValue="#3b82f6"
                    className="h-10 w-20 p-1 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">Válassz színt, ami megjelenik majd a kártyán</span>
              </div>
            </div>

          </div>

          <div className="pt-4 flex gap-4">
             <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg"
             >
               Mentés
             </button>
             <Link 
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
             >
                Mégse
             </Link>
          </div>

        </form>
      </div>
    </div>
  );
}