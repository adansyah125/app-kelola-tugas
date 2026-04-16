import { useEffect, useState } from "react";
import { getUser, logout } from "./lib/auth";
import Login from "./Login";
import Upload from "./Upload";
import List from "./List";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const checkUser = async () => {
    const currentUser = await getUser();
    setUser(currentUser);
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔝 NAVBAR */}
      <header className="bg-white border-b border-gray-200 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* LOGO */}
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
            📚 Aplikasi Tugas Kecerdasan Buatan
          </h1>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE BURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 space-y-3">

              {user ? (
                <>
                  <p className="text-sm text-gray-600 break-all">
                    {user.email}
                  </p>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white py-2 rounded-lg"
                >
                  Login
                </button>
              )}

            </div>
          </div>
        )}
      </header>
        {/* Hero */}
      <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

        {/* 🔤 KIRI - TEXT */}
        <div className="text-center md:text-left max-w-xl 
          opacity-0 translate-y-10 animate-fadeUp">
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-gray-800">
            Upload & Kelola Tugas Dengan Mudah
          </h2>

          <p className="text-lg md:text-xl mb-6 text-gray-500 italic">
            "Kamu butuh banyak error dan backpropagation untuk sampai pada hasil yang akurat."
          </p>

        </div>

        {/* 👤 KANAN - PROFILE */}
        <div className="relative opacity-0 translate-y-10 animate-fadeUp delay-200">
          
          <div className="w-64 h-64 bg-white rounded-3xl border border-gray-200 
            flex flex-col items-center justify-center shadow-lg
            transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            
            <img
              src="syahdan-pp.jpg"
              alt="profile"
              className="w-24 h-24 rounded-full border-4 border-gray-200 mb-4 
              transition-transform duration-300 hover:scale-110"
            />

            <h3 className="font-semibold text-lg text-gray-800">
              Syahdan Mutahariq
            </h3>

            <p className="text-sm text-gray-500">
              23110065
            </p>
            <p className="text-sm text-gray-500">
              Mahasiswa
            </p>
          </div>

          {/* badge status */}
          <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm shadow
            transition-all duration-300 hover:scale-105">
            
            <span className="text-green-600 font-semibold animate-pulse">
              ● Aktif Kuliah
            </span>
          </div>
        </div>

      </div>
    </section>

      {/* 📤 UPLOAD SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {/* <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Upload Tugas
        </h3> */}

        {user ? (
          <Upload />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-600 mb-3">
              Login untuk upload tugas
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Login Sekarang
            </button>
          </div>
        )}
      </section>

      {/* 📋 LIST SECTION */}
      <section className="w-full mx-auto px-4 pb-10">
        <List />
      </section>

      {/* 🔐 LOGIN MODAL */}
      {showLogin && !user && (
        <Login
          onLogin={() => {
            checkUser();
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}