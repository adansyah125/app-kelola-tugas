import { useState } from "react";
import { login } from "./lib/auth";
import { toast } from "react-toastify";
import { Mail, Lock, X } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      toast.error("gagal login: " + error.message);
    } else {
      toast.success("berhasil login");
      onLogin();
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative animate-fadeIn">

    {/* CLOSE */}
    <button
      onClick={onLogin}
      className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
    >
      <X size={18} />
    </button>

    {/* HEADER */}
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Masuk ke Akun
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Silakan login untuk upload tugas
      </p>
    </div>

    {/* FORM */}
    <form onSubmit={handleLogin} className="space-y-4">

      {/* EMAIL */}
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login"}
      </button>

    </form>
  </div>
</div>
  );
}