import Link from "next/link";

export default function TermsPage() {
  const GOLD_TEXT_GRADIENT = "bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-amber-100 selection:text-amber-800">
      
      {/* Háttér Textúra */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
      </div>

      {/* Fejléc */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/drivesync-logo.png" alt="Logo" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"/>
            <span className={`text-xl font-extrabold tracking-tight ${GOLD_TEXT_GRADIENT}`}>DriveSync</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-amber-500 transition-colors">
            ← Vissza a főoldalra
          </Link>
        </div>
      </header>

      {/* Tartalom */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900">
          Általános Szerződési <span className="text-amber-500">Feltételek</span>
        </h1>
        
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="lead text-xl text-gray-500 mb-10">
            Hatályos: 2025. november 24.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">1. A Szolgáltatás Leírása</h2>
              <p className="text-gray-600">
                A DriveSync egy online járműnyilvántartó és szervizmenedzsment alkalmazás ("Szolgáltatás"). 
                Az alkalmazás lehetővé teszi a felhasználók számára járműveik adatainak rögzítését, szerviztörténet vezetését és költségek nyomon követését.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">2. Regisztráció és Fiók</h2>
              <p className="text-gray-600">
                A Szolgáltatás használata regisztrációhoz kötött. A felhasználó felelős a fiókjához tartozó jelszó biztonságáért. 
                Fenntartjuk a jogot, hogy töröljük azokat a fiókokat, amelyek sértik jelen szabályzatot vagy inaktívak több mint 12 hónapja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">3. Felelősség Kizárása</h2>
              <p className="text-gray-600 mb-4">
                A DriveSync "adott állapotban" (as-is) kerül szolgáltatásra. Nem vállalunk garanciát a rögzített adatok pontosságáért, elvesztéséért vagy a szolgáltatás folyamatos elérhetőségéért.
              </p>
              <p className="text-gray-600">
                Az alkalmazás által küldött emlékeztetők (pl. műszaki vizsga) csak tájékoztató jellegűek. A felhasználó felelőssége a járműve jogszabályi megfelelőségének biztosítása.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">4. Felhasználói Magatartás</h2>
              <p className="text-gray-600">
                Tilos a Szolgáltatást jogellenes célokra, vírusok terjesztésére vagy a rendszer integritásának veszélyeztetésére használni.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">5. Változtatások joga</h2>
              <p className="text-gray-600">
                Fenntartjuk a jogot, hogy a Szolgáltatást vagy jelen feltételeket bármikor módosítsuk. A jelentős változásokról értesítést küldünk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">6. Irányadó Jog</h2>
              <p className="text-gray-600">
                Jelen feltételekre Magyarország jogszabályai az irányadók. Bármely jogvita esetén a magyar bíróságok illetékesek.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Lábléc */}
      <footer className="border-t border-gray-200 py-8 bg-gray-50 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2025 DriveSync Technologies. Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}
