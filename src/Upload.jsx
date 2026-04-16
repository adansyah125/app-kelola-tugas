import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [nama, setNama] = useState("");
  const [link, setLink] = useState("");
  const [matkul, setMatkul] = useState("");
  const [pertemuan, setPertemuan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        alert("Harus login dulu!");
        setLoading(false);
        return;
      }

      let fileUrl = "";

      if (file) {
        if (!file.name.endsWith(".pdf") && !file.name.endsWith(".zip")) {
          alert("Hanya PDF & ZIP!");
          setLoading(false);
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("Max 5MB!");
          setLoading(false);
          return;
        }

        const cleanName = file.name.replace(/\s+/g, "_");
        const fileName = Date.now() + "_" + cleanName;

        const { error } = await supabase.storage
          .from("tugas")
          .upload(fileName, file);

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        fileUrl = supabase.storage
          .from("tugas")
          .getPublicUrl(fileName).data.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("tugas")
        .insert([
          {
            nama,
            matkul,
            pertemuan,
            file_url: fileUrl,
            link_url: link,
            user_id: user.id,
          },
        ]);

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }

      alert("Berhasil upload!");

      setNama("");
      setMatkul("");
      setPertemuan("");
      setFile(null);
      setLink("");
    } catch (err) {
      alert("Terjadi error!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
  
  {/* HEADER */}
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">
      Upload Tugas
    </h2>
    <p className="text-sm text-gray-500">
      Isi data tugas dan upload file atau link
    </p>
  </div>

  <form onSubmit={handleUpload} className="space-y-5">

    {/* Nama */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        Nama Tugas
      </label>
      <input
        type="text"
        placeholder="Contoh: Tugas AI"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
      />
    </div>

    {/* Grid 2 kolom */}
    <div className="grid md:grid-cols-2 gap-4">

      {/* Mata Kuliah */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Mata Kuliah
        </label>
        <input
          type="text"
          placeholder="Contoh: Kecerdasan Buatan"
          value={matkul}
          onChange={(e) => setMatkul(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
        />
      </div>

      {/* Pertemuan */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Pertemuan
        </label>
        <input
          type="number"
          placeholder="Contoh: 3"
          value={pertemuan}
          onChange={(e) => setPertemuan(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
        />
      </div>

    </div>

    {/* Upload File */}
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        Upload File (PDF / ZIP)
      </label>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-gray-900 transition">
        <input
          type="file"
          accept=".pdf,.zip"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {file ? (
          <div className="text-center">
            <p className="text-gray-800 font-medium">
              📄 {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Klik untuk ganti file
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-sm">
              Klik atau drag file ke sini
            </p>
            <p className="text-xs mt-1">
              Maksimal 5MB
            </p>
          </div>
        )}
      </label>
    </div>

    {/* Divider */}
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400">atau</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>

    {/* Link */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        Link (Opsional)
      </label>
      <input
        type="text"
        placeholder="https://contoh.com"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
      />
    </div>

    {/* Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
    >
      {loading ? "Uploading..." : "Upload Tugas"}
    </button>

  </form>
</div>
  );
}