import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { deleteCar, deleteUpcomingService, deleteServiceRecord } from "@/app/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const carId = Number(resolvedParams.id);
  
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: {
      owner: true,
      services: {
        orderBy: { serviceDate: 'desc' },
        include: { serviceType: true }
      },
      upcomingServices: {
        orderBy: { serviceDate: 'asc' },
        where: { archived: false }
      }
    }
  });

  if (!car) notFound();
  if (car.owner.email !== session.user.email) return <div className="text-white p-10">Nincs hozzáférésed!</div>;

  // Stílus konstansok
  const GOLD_GRADIENT = "bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500";
  const GOLD_TEXT = "text-amber-400";
  const CARD_BG = "bg-gray-900/60 backdrop-blur-xl border border-white/10";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10 font-sans">
      
      {/* Háttér effekt */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.05),transparent_40%)]"></div>

      <div className="max-w-6xl mx-auto">
        
        {/* Navigáció és Autó Törlése */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-amber-400 flex items-center gap-2 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Vissza a garázsba
          </Link>
          <form action={async () => { 'use server'; await deleteCar(carId) }}>
              <button className="text-red-400/80 hover:text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-transparent hover:border-red-900/50">
                Autó törlése 🗑️
              </button>
          </form>
        </div>

        {/* --- AUTÓ FEJLÉC KÁRTYA --- */}
        <div className={`rounded-3xl overflow-hidden mb-10 shadow-2xl shadow-black/50 ${CARD_BG}`}>
            
            {/* Színes sáv (User által választott szín, vagy default Gold) */}
            <div style={{ backgroundColor: car.color || '#fbbf24' }} className="h-2 w-full shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
            
            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">{car.brand} <span className="text-gray-400 font-light">{car.type}</span></h1>
                        
                        {/* Szerkesztés gomb */}
                        <Link 
                            href={`/dashboard/car/${car.id}/edit`} 
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-amber-400 transition-all"
                            title="Szerkesztés"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-white/5 text-gray-300 px-3 py-1.5 rounded-md border border-white/10 font-mono tracking-wider">
                            {car.license}
                        </span>
                        <span className="bg-white/5 text-amber-400 px-3 py-1.5 rounded-md border border-amber-500/20 font-bold flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            {car.km?.toLocaleString()} km
                        </span>
                        <span className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-md border border-white/10">
                            {car.vintage} • {car.fuelType}
                        </span>
                    </div>
                </div>
                
                {/* Akció Gombok */}
                <div className="flex gap-3 w-full md:w-auto">
                    <Link href={`/dashboard/car/${car.id}/upcoming/new`} className="flex-1 md:flex-none bg-gray-800 text-gray-200 border border-gray-700 hover:border-amber-500/50 hover:text-amber-400 px-5 py-3 rounded-xl font-semibold transition-all text-center">
                        + Emlékeztető
                    </Link>
                    <Link href={`/dashboard/car/${car.id}/service/new`} className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-gray-950 ${GOLD_GRADIENT} hover:shadow-[0_0_20px_-5px_rgba(251,191,36,0.4)] transition-all text-center`}>
                        + Szerviz rögzítése
                    </Link>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- BAL OSZLOP: Szerviztörténet --- */}
            <div className="lg:col-span-2">
                <div className={`rounded-3xl overflow-hidden ${CARD_BG}`}>
                    <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            Szerviztörténet
                        </h2>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Elvégzett munkák</span>
                    </div>

                    {car.services.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <p className="text-gray-400">Nincs még rögzített szerviz.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-900/50 text-gray-400 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Dátum</th>
                                        <th className="px-6 py-4 font-medium">Munka</th>
                                        <th className="px-6 py-4 font-medium text-right">Ár</th>
                                        <th className="px-4 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {car.services.map((service) => (
                                        <tr key={service.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-mono">
                                                {new Date(service.serviceDate).toLocaleDateString('hu-HU')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="block text-white font-semibold text-base">{service.serviceType?.name || "Egyéb"}</span>
                                                <span className="block text-xs text-gray-500 mt-1 truncate max-w-[250px]">
                                                    {service.replacedParts || "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-amber-400 font-bold text-base">
                                                {service.price.toLocaleString()} Ft
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteServiceRecord(service.id);
                                                }}>
                                                    <button 
                                                        className="text-gray-600 hover:text-red-400 transition p-2 rounded-md hover:bg-red-400/10 opacity-0 group-hover:opacity-100"
                                                        title="Bejegyzés törlése"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* --- JOBB OSZLOP: Közelgő Teendők --- */}
            <div>
                <div className={`rounded-3xl overflow-hidden ${CARD_BG} sticky top-6`}>
                    <div className="px-6 py-5 border-b border-white/10 bg-amber-500/10 flex justify-between items-center">
                        <h2 className="font-bold text-amber-400 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Közelgő teendők
                        </h2>
                    </div>
                    
                    <div className="p-5 space-y-4">
                        {car.upcomingServices.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-6">Nincs közelgő teendő. <br/> Élvezd a vezetést! 🚗</p>
                        ) : (
                            car.upcomingServices.map((upcoming) => (
                                <div key={upcoming.id} className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-4 relative group hover:border-amber-500/40 transition-all">
                                    
                                    <form action={async () => { 
                                        'use server'; 
                                        await deleteUpcomingService(upcoming.id) 
                                    }} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-gray-500 hover:text-red-400 p-1" title="Törlés">✕</button>
                                    </form>

                                    <h3 className="font-bold text-gray-200 mb-2">{upcoming.notes}</h3>
                                    <div className="text-sm flex flex-col gap-2 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span className="text-amber-500/70">📅</span>
                                            <span className={new Date(upcoming.serviceDate) < new Date() ? "text-red-400 font-bold" : "text-gray-300"}>
                                                {new Date(upcoming.serviceDate).toLocaleDateString('hu-HU')}
                                            </span>
                                        </div>
                                        {upcoming.location && (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <span className="text-amber-500/70">📍</span> {upcoming.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        
                        <Link href={`/dashboard/car/${car.id}/upcoming/new`} className="block w-full text-center py-3 text-sm font-medium text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-xl border border-dashed border-gray-700 hover:border-amber-500/50 transition-all mt-2">
                            + Új emlékeztető felvétele
                        </Link>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}