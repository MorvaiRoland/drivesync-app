import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma"; 
import { redirect } from "next/navigation";
import { CarCard } from "@/components/car-card"; 
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Adatok lekérése
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cars: {
        orderBy: { brand: 'asc' } 
      }
    }
  });

  if (!user) {
    return <div className="text-white p-10">Hiba történt. Kérlek jelentkezz be újra.</div>;
  }

  // Stílus konstansok
  const GOLD_GRADIENT = "bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500";
  const GOLD_TEXT_GRADIENT = "bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10 font-sans relative overflow-hidden">
      
      {/* Háttér effekt */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.05),transparent_40%)]"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.03),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Fejléc */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Garázsom
            </h1>
            <p className="text-gray-400">
              Üdvözlünk, <span className={`font-bold ${GOLD_TEXT_GRADIENT}`}>{user.username}</span>! Itt kezelheted a flottádat.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Új autó gomb */}
            <Link 
              href="/dashboard/car/new" 
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-gray-950 ${GOLD_GRADIENT} hover:shadow-[0_0_20px_-5px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5`}
            >
              <span>+</span> Új autó
            </Link>
            
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="h-full px-6 py-3 text-gray-300 border border-white/10 rounded-xl font-medium hover:bg-white/5 hover:text-white transition-all">
                Kilépés
              </button>
            </form>
          </div>
        </div>

        {/* Autók listázása */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {user.cars.length > 0 ? (
            user.cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))
          ) : (
            // Üres állapot
            <div className="col-span-full bg-gray-900/50 border border-dashed border-gray-700 rounded-3xl p-16 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                 <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Még üres a garázsod</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Add hozzá az első autódat, hogy elkezdhesd a profi nyilvántartást és költségkövetést.</p>
              
              <Link
                href="/dashboard/car/new" 
                className="text-amber-400 font-bold hover:text-amber-300 border-b border-amber-400/30 hover:border-amber-300 transition-all pb-1"
              >
                + Autó hozzáadása most
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}