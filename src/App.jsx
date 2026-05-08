import { useEffect, useState, useRef } from "react";
import { getUser, logout } from "./lib/auth";
import Login from "./Login";
import Upload from "./Upload";
import List from "./List";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const homeRef = useRef(null);
  const bioRef = useRef(null);
  const tugasRef = useRef(null);

  const [displayText, setDisplayText] = useState("");
const fullText = "Platform pengumpulan tugas yang lebih intuitif.";

useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 70); // Pastikan menggunakan koma/titik koma yang benar di sini

    return () => clearInterval(typingInterval);
  }, []); // Array dependensi kosong agar hanya jalan sekali saat mount

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const checkUser = async () => {
    const currentUser = await getUser();
    setUser(currentUser);
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-blue-100">
      
      {/* 🔝 NAVBAR - Minimalist Floating */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo(homeRef)}>
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <h1 className="text-sm font-semibold tracking-tight uppercase">Aplikasi Pengumpulan Tugas</h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo(homeRef)} className="text-xs font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Home</button>
            <button onClick={() => scrollTo(bioRef)} className="text-xs font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Biodata</button>
            <button onClick={() => scrollTo(tugasRef)} className="text-xs font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Tugas</button>
            
            {user ? (
              <button onClick={logout} className="text-xs font-bold bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all">
                LOGOUT
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-xs font-bold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all">
                SIGN IN
              </button>
            )}
          </div>

          
        </div>
      </nav>

     {/* 🚀 HERO SECTION */}
<section ref={homeRef} className="pt-40 pb-56 px-6 overflow-hidden">
  <div className="max-w-4xl mx-auto text-center space-y-6">
    {/* Badge dengan animasi muncul perlahan */}
    <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-blue-600 bg-blue-50 rounded-full uppercase animate-fade-in">
      Informatics Engineering
    </span>

    {/* Efek Ketikan pada Judul */}
    <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 min-h-[80px] md:min-h-[140px]">
      {displayText}
      <span className="inline-block w-[3px] h-[40px] md:h-[60px] bg-blue-600 ml-1 animate-pulse align-middle"></span>
    </h2>

    {/* Deskripsi dengan animasi Fade Up */}
    <p className="max-w-lg mx-auto text-gray-500 text-lg leading-relaxed opacity-0 animate-[fadeInUp_1s_ease_1.5s_forwards]">
      Didesain khusus untuk efisiensi mahasiswa dalam mengelola proyek mata kuliah Kecerdasan Buatan.
    </p>

    <div className="pt-4 opacity-0 animate-[fadeInUp_1s_ease_2s_forwards]">
      <button 
        onClick={() => scrollTo(tugasRef)} 
        className="group relative bg-black text-white px-8 py-3 rounded-full font-medium transition-all hover:pr-12"
      >
        <span>Klik Disini</span>
        <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all">→</span>
      </button>
    </div>
  </div>
</section>

      {/* 👤 BIODATA SECTION - Bento Style Clean */}
      <section ref={bioRef} className="py-46 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Kartu Foto */}
            <div className="bg-[#f3f3f3] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <img
                src="syahdan-pp.jpg"
                alt="profile"
                className="w-32 h-32 rounded-full grayscale hover:grayscale-0 transition-all duration-500 mb-4 border-4 border-white shadow-sm"
              />
              <h3 className="text-xl font-semibold">Syahdan Mutahariq</h3>
              <p className="text-sm text-gray-400">@adansyah125</p>
            </div>

            {/* Grid Informasi */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "NIM", value: "23110065" },
                { label: "Kelas", value: "J 2023" },
                { label: "Jurusan", value: "S1 Teknik Informatika" },
                { label: "Kampus", value: "STMIK Mardira Indonesia" },
              ].map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-2xl p-6 hover:bg-gray-50 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-medium text-gray-800">{item.value}</p>
                </div>
              ))}
              <div className="sm:col-span-2 bg-black text-white rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Mahasiswa</p>
                  <p className="text-lg font-medium">Aktif Perkuliahan</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 📤 TUGAS SECTION */}
      <section ref={tugasRef} className="max-w-5xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h3 className="text-3xl font-medium tracking-tight">Daftar Tugas</h3>
            <p className="text-gray-400 mt-2">Kelola berkas .zip atau .pdf tugas Anda di sini.</p>
          </div>
          {!user && (
            <button onClick={() => setShowLogin(true)} className="text-sm font-bold underline underline-offset-4 hover:text-blue-600 transition-colors">
              Login untuk upload →
            </button>
          )}
        </div>

        <div className="space-y-8">
          {user && (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
               <Upload />
            </div>
          )}
          
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <List />
          </div>
        </div>
      </section>

      {/* 📁 FOOTER */}
      <footer className="py-20 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400 font-medium">
          © 2026 — Syahdan Mutahariq. Made with Focus.
        </p>
      </footer>

      {/* 🔐 LOGIN MODAL - Elegant Blur */}
      {showLogin && !user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/80 backdrop-blur-md">
           <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
             <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-2xl relative">
                <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">✕</button>
                <Login onLogin={() => { checkUser(); setShowLogin(false); }} />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}