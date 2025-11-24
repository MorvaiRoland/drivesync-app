'use client'

import { useState } from 'react'
import { signIn } from "next-auth/react" // Fontos: Client side signIn
import { registerUser, loginUser } from "@/app/auth-actions"
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Váltó: Login vagy Regisztráció
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginUser(formData);
    if (result?.error) {
        setError(result.error);
        setLoading(false);
    }
    // Ha sikeres, a NextAuth redirectel automatikusan
  }

  async function handleRegister(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await registerUser(formData);
    
    if (result?.error) {
        setError(result.error);
    } else if (result?.success) {
        setSuccess("Sikeres regisztráció! Most már bejelentkezhetsz.");
        setIsLogin(true); // Átváltunk login nézetre
    }
    setLoading(false);
  }

  const GOLD_GRADIENT = "bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600";
  const TEXT_GRADIENT = "bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Háttér effektek */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,53,15,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Logó és Cím */}
        <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 group">
                <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:border-amber-500/50 transition-all duration-500 group-hover:scale-110">
                    <img src="/drivesync-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                </div>
            </Link>
            <h1 className={`text-3xl font-bold ${TEXT_GRADIENT} mb-2`}>
                {isLogin ? "Üdvözlünk újra!" : "Fiók létrehozása"}
            </h1>
            <p className="text-gray-500 text-sm">
                {isLogin ? "Jelentkezz be a járműveid kezeléséhez." : "Csatlakozz a DriveSync közösséghez."}
            </p>
        </div>

        {/* Fő Kártya */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Váltógombok (Tabs) */}
            <div className="flex border-b border-white/5">
                <button 
                    onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
                    className={`flex-1 py-4 text-sm font-medium transition-all relative ${isLogin ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Bejelentkezés
                    {isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                </button>
                <button 
                    onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
                    className={`flex-1 py-4 text-sm font-medium transition-all relative ${!isLogin ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Regisztráció
                    {!isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                </button>
            </div>

            <div className="p-8">
                
                {/* Google Gomb */}
                <button 
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] mb-6"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Folytatás Google fiókkal
                </button>

                <div className="relative flex py-3 items-center mb-6">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">vagy email címmel</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                {/* Üzenetek */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-pulse">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form action={isLogin ? handleLogin : handleRegister} className="space-y-4">
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Felhasználónév</label>
                            <input 
                                name="username" 
                                type="text" 
                                required
                                className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                                placeholder="Válassz felhasználónevet"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Email cím</label>
                        <input 
                            name="email" 
                            type="email" 
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                            placeholder="pelda@email.hu"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Jelszó</label>
                        <input 
                            name="password" 
                            type="password" 
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full ${GOLD_GRADIENT} text-gray-900 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {loading ? "Feldolgozás..." : (isLogin ? "Bejelentkezés" : "Regisztráció")}
                    </button>

                </form>
            </div>
            
            {/* Lábléc linkek */}
            <div className="bg-gray-900/80 px-8 py-4 border-t border-white/5 text-center">
                <p className="text-xs text-gray-500">
                    A folytatással elfogadod az <a href="#" className="text-amber-500 hover:underline">ÁSZF</a>-et és az <a href="#" className="text-amber-500 hover:underline">Adatvédelmi szabályzatot</a>.
                </p>
            </div>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-8">
            © 2025 DriveSync Technologies.
        </p>

      </div>
    </div>
  );
}