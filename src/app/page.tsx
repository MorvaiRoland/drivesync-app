'use client'

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [cars, setCars] = useState(2);
  const [services, setServices] = useState(10);
  const [cookieAccepted, setCookieAccepted] = useState(true); 
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [ping, setPing] = useState(24);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- EFFECTS ---
  useEffect(() => {
    const savedCookie = localStorage.getItem('cookiesAccepted');
    if (!savedCookie) setCookieAccepted(false);

    const interval = setInterval(() => {
        setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setCookieAccepted(true);
  };

  // Calculator Logic
  const minutesSaved = cars * services * 13;
  const hoursSaved = Math.floor(minutesSaved / 60);
  const displaySaved = hoursSaved < 1 ? `${minutesSaved} perc` : `${hoursSaved} óra`;

  // Gallery Data (Használj saját képeket a public mappában!)
  const galleryImages = [
    "/screenshot1.png", "/screenshot2.png", "/screenshot3.png" 
  ];
  // Ha nincsenek képek, placeholder színeket használunk a demóhoz
  const usePlaceholders = true; 

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === (usePlaceholders ? 2 : galleryImages.length - 1) ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? (usePlaceholders ? 2 : galleryImages.length - 1) : prev - 1));
  };

  // --- STYLES ---
  const GOLD_GRADIENT = "bg-gradient-to-r from-amber-400 to-yellow-500";
  const GOLD_TEXT_GRADIENT = "bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600";
  const SECTION_PAD = "py-24 px-6";
  const H2_STYLE = "text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 text-center";
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 selection:bg-amber-100 selection:text-amber-800 font-sans overflow-x-hidden relative">
      
      {/* --- HÁTTÉR --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-amber-100/40 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[800px] h-[800px] bg-yellow-100/40 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      {/* --- FEJLÉC --- */}
      <header className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* Helyezd el a logót a public mappába! */}
            <img src="/drivesync-logo.png" alt="Logo" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"/>
            <span className={`text-2xl font-extrabold tracking-tight ${GOLD_TEXT_GRADIENT}`}>DriveSync</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <a href="#features" className="hover:text-amber-500 transition-colors">Funkciók</a>
            <a href="#gallery" className="hover:text-amber-500 transition-colors">Galéria</a>
            <a href="#roadmap" className="hover:text-amber-500 transition-colors">Tervek</a>
            <a href="#calculator" className="hover:text-amber-500 transition-colors">Kalkulátor</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/login" className="hidden md:block text-sm font-bold text-gray-600 hover:text-amber-500 transition-colors">Bejelentkezés</a>
            <a href="/login" className={`px-6 py-2.5 text-sm font-bold text-white ${GOLD_GRADIENT} rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5`}>
              Kezdés
            </a>
          </div>
        </div>
      </header>

      {/* --- HERO --- */}
      <main className="flex-1 pt-40 pb-20 px-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <p className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm animate-fade-in">A digitális garázsod</p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-gray-900">
            Kezeld autódat <br />
            <span className={GOLD_TEXT_GRADIENT}>profi módon.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
            A végső megoldás a szerviznapló vezetésére, költségvetés követésre és a teljes autóparkod menedzselésére.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a href="/login" className={`w-full sm:w-auto px-8 py-4 text-lg font-bold text-white ${GOLD_GRADIENT} rounded-xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Motor Indítása
            </a>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              Tudj meg többet
            </a>
          </div>
        </div>
      </main>

      {/* --- 3 LÉPÉS (STEPS) --- */}
      <section className={`${SECTION_PAD} bg-gray-50/50`}>
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className={H2_STYLE}>Így <span className="text-amber-500">Kezdj Bele</span></h2>
                <p className="text-gray-500">Három egyszerű lépés, és már rendben is vannak az autóid.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* Step 1 */}
                <div className="flex-1 text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-white rounded-full shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform duration-500">
                        <span className="absolute text-6xl font-black text-gray-100 -z-10 top-0">01</span>
                        <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Regisztráció</h3>
                    <p className="text-gray-500 text-sm px-4">Hozz létre egy ingyenes fiókot Google belépéssel vagy email címmel.</p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block text-amber-300 text-2xl">➜</div>
                {/* Step 2 */}
                <div className="flex-1 text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-white rounded-full shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform duration-500">
                        <span className="absolute text-6xl font-black text-gray-100 -z-10 top-0">02</span>
                        <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Autó Hozzáadása</h3>
                    <p className="text-gray-500 text-sm px-4">Rögzítsd a járműved adatait: márka, típus, évjárat és rendszám.</p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block text-amber-300 text-2xl">➜</div>
                {/* Step 3 */}
                <div className="flex-1 text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-white rounded-full shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform duration-500">
                        <span className="absolute text-6xl font-black text-gray-100 -z-10 top-0">03</span>
                        <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Szervizelés</h3>
                    <p className="text-gray-500 text-sm px-4">Kezdd el vezetni a szerviznaplót és élvezd az átláthatóságot.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className={SECTION_PAD}>
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className={H2_STYLE}>Prémium <span className="text-amber-500">Funkciók</span></h2>
                <p className="text-gray-500">Minden eszköz, amire egy autó tulajdonosnak szüksége lehet.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Költségkövetés", desc: "Lásd át a pénzügyeidet másodpercek alatt. Interaktív diagramok." },
                    { icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", title: "Felhő Szinkronizáció", desc: "Adataid biztonságban vannak. Minden adatod a felhőbe kerül." },
                    { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: "Digitális Szervizkönyv", desc: "Felejtsd el a papírokat. Rögzíts minden olajcserét és vizsgát digitálisan." },
                    { icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Okos Kalkulátorok", desc: "Utazást tervezel? A beépített kalkulátorok kiszámolják a költséget." },
                    { icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", title: "Biztonságos Adatbázis", desc: "Profi MySQL adatbázist használunk a háttérben a maximális sebességért." },
                    { icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z", title: "Modern UI", desc: "Letisztult, modern felület, ami nem csak jól néz ki, de profi élmény." },
                ].map((f, i) => (
                    <div key={i} className="group p-8 rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 hover:border-amber-300/50 transition-all duration-500 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 border border-amber-100 group-hover:scale-110 transition-transform text-amber-500">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- GALÉRIA (Saját Slider) --- */}
      <section id="gallery" className={`${SECTION_PAD} bg-gray-900 text-white overflow-hidden relative`}>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1f2937,transparent)] opacity-50"></div>
         <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">Galéria</h2>
            <p className="text-gray-400 mb-12">Nézz bele a program működésébe.</p>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800 aspect-video bg-gray-800">
                {/* Kép Helyőrző (Placeholder) */}
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                    {usePlaceholders ? (
                        <div className="text-center">
                            <div className="text-6xl mb-4">📸</div>
                            <p className="text-xl font-bold">Screenshot {currentSlide + 1}</p>
                            <p className="text-sm text-gray-600">Töltsd fel a képeket a /public mappába!</p>
                        </div>
                    ) : (
                        <img src={galleryImages[currentSlide]} className="w-full h-full object-cover" alt="App Screenshot"/>
                    )}
                </div>
                
                {/* Vezérlők */}
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
         </div>
      </section>

      {/* --- KALKULÁTOR --- */}
      <section id="calculator" className={`${SECTION_PAD} bg-white relative overflow-hidden`}>
        <div className="absolute -right-20 top-20 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className={H2_STYLE}>Mennyit <span className="text-amber-500">Spórolhatsz?</span></h2>
                <p className="text-gray-500">Számold ki, mennyi időt és energiát takarítasz meg az adminisztráción.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl shadow-gray-200/50 backdrop-blur-xl relative">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-2 font-bold text-gray-700">
                                <label>Autók száma a családban</label>
                                <span className="text-amber-500">{cars} db</span>
                            </div>
                            <input type="range" min="1" max="20" value={cars} onChange={(e) => setCars(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2 font-bold text-gray-700">
                                <label>Szervizek/Tankolások évente</label>
                                <span className="text-amber-500">{services} alkalom</span>
                            </div>
                            <input type="range" min="1" max="50" value={services} onChange={(e) => setServices(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                        </div>
                    </div>
                    <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-12">
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Megspórolt idő évente</p>
                        <div className={`text-6xl font-black ${GOLD_TEXT_GRADIENT} mb-4`}>{displaySaved}</div>
                        <p className="text-gray-600 font-medium flex items-center justify-center md:justify-end gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            Átlátható költségek azonnal
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- TECH STACK (MARQUEE) --- */}
      <div className="py-10 border-y border-gray-100 bg-gray-50 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap text-gray-400 font-bold text-xl uppercase tracking-widest items-center">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-16">
                    <span className="flex items-center gap-2">Next.js 15</span>
                    <span className="flex items-center gap-2">MySQL</span>
                    <span className="flex items-center gap-2">Auth.js</span>
                    <span className="flex items-center gap-2">Tailwind</span>
                    <span className="flex items-center gap-2">Prisma</span>
                    <span className="flex items-center gap-2">Vercel</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- ROADMAP & COMPARISON --- */}
      <section id="roadmap" className={`${SECTION_PAD} max-w-7xl mx-auto`}>
        <div className="grid md:grid-cols-2 gap-16">
            {/* Comparison */}
            <div>
                <h3 className="text-2xl font-bold mb-8 text-gray-900">Miért válts <span className="text-amber-500">DriveSync</span>-re?</h3>
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr><th className="p-4">Funkció</th><th className="p-4">Excel / Papír</th><th className="p-4 text-amber-600">DriveSync</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {[
                                { label: "Költségek", bad: "Manuális", good: "Automatikus" },
                                { label: "Biztonság", bad: "Elveszhet", good: "Felhő mentés" },
                                { label: "Grafikonok", bad: "Bonyolult", good: "Azonnali" },
                                { label: "Élmény", bad: "Unalmas", good: "Modern UI" },
                            ].map((row, idx) => (
                                <tr key={idx}>
                                    <td className="p-4 font-bold text-gray-700">{row.label}</td>
                                    <td className="p-4 text-red-400">✖ {row.bad}</td>
                                    <td className="p-4 text-green-600 font-bold">✓ {row.good}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Roadmap */}
            <div>
                <h3 className="text-2xl font-bold mb-8 text-gray-900">Fejlesztési Tervek</h3>
                <div className="space-y-8 relative pl-8 border-l-2 border-gray-100">
                    <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-md"></span>
                        <div className="text-xs font-bold text-amber-500 mb-1">JELENLEG</div>
                        <h4 className="font-bold text-gray-900">Verzió 2.0 Webapp</h4>
                        <p className="text-sm text-gray-500">Stabil Next.js alaprendszer, felhő szinkronizáció, modern design.</p>
                    </div>
                    <div className="relative opacity-60">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-gray-300 border-4 border-white"></span>
                        <div className="text-xs font-bold text-gray-400 mb-1">HAMAROSAN</div>
                        <h4 className="font-bold text-gray-900">Mobil Applikáció</h4>
                        <p className="text-sm text-gray-500">Natív iOS és Android alkalmazás értesítésekkel.</p>
                    </div>
                    <div className="relative opacity-60">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-gray-300 border-4 border-white"></span>
                        <div className="text-xs font-bold text-gray-400 mb-1">TERV</div>
                        <h4 className="font-bold text-gray-900">AI Szerelő</h4>
                        <p className="text-sm text-gray-500">Mesterséges intelligencia alapú hibadiagnosztika.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className={`${SECTION_PAD} bg-gray-50`}>
        <div className="max-w-3xl mx-auto">
            <h2 className={H2_STYLE}>Gyakori Kérdések</h2>
            <div className="space-y-4 mt-8">
                {[
                    { q: "Mennyibe kerül?", a: "Teljesen ingyenes. Ez egy nyílt forráskódú projekt." },
                    { q: "Biztonságban vannak az adataim?", a: "Igen. Biztonságos SQL adatbázist használunk, jelszavad titkosítva van." },
                    { q: "Hogyan érem el mobilon?", a: "A weboldal teljesen reszponzív, megnyithatod a telefonod böngészőjében is." }
                ].map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-5 text-left font-bold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition">
                            {item.q}
                            <span className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-amber-500' : 'text-gray-400'}`}>▼</span>
                        </button>
                        <div className={`px-5 text-gray-500 text-sm transition-all duration-300 overflow-hidden ${activeFaq === idx ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                            {item.a}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- HÍRLEVÉL --- */}
      <section className="py-20 px-6 bg-gray-900 text-white text-center">
         <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ne maradj le az újdonságokról!</h2>
            <p className="text-gray-400 mb-8">Iratkozz fel, és értesítünk az új funkciókról és a mobil app érkezéséről.</p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="E-mail címed..." className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-amber-500 outline-none"/>
                <button className="bg-amber-500 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition">Feliratkozás</button>
            </form>
         </div>
      </section>

      {/* --- AUTHOR --- */}
      <section id="author" className="bg-white py-16 px-6 text-center">
         <div className="inline-block p-1 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full mb-6">
            <img src="https://github.com/MorvaiRoland.png" alt="Author" className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 object-cover"/>
         </div>
         <h3 className="text-2xl font-bold text-gray-900">Morvai Roland</h3>
         <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Lead Developer</p>
         <p className="text-gray-500 italic max-w-sm mx-auto">"A célom egy olyan autós szoftver létrehozása volt, amit én is szívesen használok minden nap."</p>
      </section>

      {/* --- SYSTEM WIDGET --- */}
      <div className="fixed bottom-5 left-5 z-40 bg-gray-900/90 backdrop-blur text-white p-3 rounded-xl border border-gray-700 shadow-2xl text-xs font-mono hidden md:block group hover:border-amber-500/50 transition-colors">
         <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-400">Rendszer:</span> <span className="text-green-400 font-bold">Online</span>
         </div>
         <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
            Ping: <span className={ping > 40 ? 'text-yellow-400' : 'text-green-400'}>{ping}ms</span> • DB: OK
         </div>
      </div>

      {/* --- COOKIE BANNER --- */}
      {!cookieAccepted && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-center gap-4 shadow-2xl border-t border-gray-700 animate-slide-up">
            <p className="text-sm">Ez a weboldal sütiket használ a jobb felhasználói élmény érdekében. 🍪</p>
            <button onClick={acceptCookies} className="bg-amber-500 text-gray-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-amber-400 transition">
                Rendben
            </button>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <img src="/drivesync-logo.png" className="w-6 h-6 grayscale opacity-50"/>
                        <span className="font-bold text-gray-900">DriveSync</span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">A modern autófenntartás elengedhetetlen eszköze.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Navigáció</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-amber-600">Főoldal</a></li>
                        <li><a href="/login" className="hover:text-amber-600">Belépés</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Kapcsolat</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="mailto:info@drivesync.hu" className="hover:text-amber-600">info@drivesync.hu</a></li>
                        <li>Budapest, Magyarország</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
                <p>© 2025 DriveSync Technologies.</p>
                <div className="flex gap-6">
                    <a href="/privacy" className="hover:text-gray-600">Adatvédelem</a>
                    <a href="/terms" className="hover:text-gray-600">ÁSZF</a>
                </div>
            </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}