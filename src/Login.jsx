import { useState } from "react";
import { login } from "./lib/auth";
import { toast } from "react-toastify";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center mb-6">
            <button onClick={onLogin} className=" top-4 right-4 absolute">
  ✖
</button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Masuk ke Akun
          </h2>
          <p className="text-sm text-gray-500">
            Silakan login untuk upload tugas
          </p>
          
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        

        
        
      </div>
    </div>
  );
}