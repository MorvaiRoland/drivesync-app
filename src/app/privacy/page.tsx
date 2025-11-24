import Link from "next/link";

export default function PrivacyPage() {
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
          Adatvédelmi <span className="text-amber-500">Tájékoztató</span>
        </h1>
        
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="lead text-xl text-gray-500 mb-10">
            Utolsó frissítés: 2025. november 24.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">1. Bevezetés</h2>
              <p className="text-gray-600">
                A DriveSync ("mi", "miénk") elkötelezett a felhasználók ("te", "tiéd") adatainak védelme mellett. 
                Jelen tájékoztató részletezi, hogyan gyűjtjük, használjuk és védjük személyes adataidat a szolgáltatásunk használata során.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">2. Az általunk gyűjtött adatok</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><strong>Fiók adatok:</strong> Név, email cím (Google bejelentkezés vagy regisztráció során).</li>
                <li><strong>Jármű adatok:</strong> Márka, típus, rendszám, évjárat, üzemanyag típusa, alvázszám (opcionális).</li>
                <li><strong>Szerviztörténet:</strong> Rögzített karbantartások dátuma, leírása, költsége és kilométeróra állása.</li>
                <li><strong>Technikai adatok:</strong> IP cím, böngésző típusa, sütik (cookie-k) a működéshez.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">3. Az adatkezelés célja</h2>
              <p className="text-gray-600 mb-4">Adataidat kizárólag a szolgáltatás nyújtása érdekében kezeljük:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>A felhasználói fiók létrehozása és fenntartása.</li>
                <li>A digitális szervizkönyv és emlékeztetők funkcióinak biztosítása.</li>
                <li>Statisztikák és költségelemzések készítése saját használatra.</li>
                <li>Rendszerüzenetek és értesítések küldése (pl. lejáró műszaki).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">4. Adattárolás és Biztonság</h2>
              <p className="text-gray-600">
                Adataidat biztonságos SQL adatbázisokban tároljuk, melyekhez csak hitelesített hozzáféréssel lehet kapcsolódni. 
                A jelszavakat "bcrypt" technológiával titkosítjuk (hash-eljük), így azok eredeti formájukban nem visszafejthetők.
                Mindent megteszünk az adatok védelme érdekében, de az internetes adattovábbítás 100%-os biztonsága nem garantálható.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">5. Sütik (Cookies)</h2>
              <p className="text-gray-600">
                A weboldal működéséhez elengedhetetlen munkamenet sütiket (session cookies) használunk. 
                Harmadik féltől származó nyomkövető sütiket (pl. hirdetési célból) nem helyezünk el.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">6. Kapcsolat</h2>
              <p className="text-gray-600">
                Ha kérdésed van az adatkezeléssel kapcsolatban, írj nekünk a <a href="mailto:info@drivesync.hu" className="text-amber-600 hover:underline">info@drivesync.hu</a> email címre.
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