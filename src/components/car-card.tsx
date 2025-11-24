import Link from "next/link";

interface CarProps {
  id: number;
  brand: string | null;
  type: string | null;
  license: string | null;
  vintage: number | null;
  color: string | null;
  km: number | null;
}

export function CarCard({ car }: { car: CarProps }) {
  // Alapértelmezett szín, ha nincs megadva
  const carColor = car.color || "#fbbf24"; 

  return (
    <Link href={`/dashboard/car/${car.id}`} className="block group">
      <div className="relative bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 transform hover:-translate-y-1 h-full backdrop-blur-sm">
        
        {/* Színes sáv + Fényeffekt */}
        <div style={{ backgroundColor: carColor }} className="h-1.5 w-full relative z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>
        
        {/* Háttér glow effekt hover-re a kártya színével */}
        <div 
            className="absolute top-0 left-0 w-full h-40 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none blur-3xl"
            style={{ background: `radial-gradient(circle at 50% 0%, ${carColor}, transparent)` }}
        />

        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">
                {car.brand}
              </h3>
              <p className="text-gray-400 font-medium">{car.type}</p>
            </div>
            {/* Rendszám 'badge' */}
            <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-gray-300 uppercase tracking-wider group-hover:border-amber-500/30 group-hover:text-amber-200/80 transition-colors">
              {car.license}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600 group-hover:text-amber-500/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{car.vintage}</span>
            </div>
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600 group-hover:text-amber-500/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="text-gray-300 font-semibold">{car.km ? `${car.km.toLocaleString()} km` : "Nincs adat"}</span>
            </div>
          </div>
        </div>
        
        {/* Hover nyíl */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
}