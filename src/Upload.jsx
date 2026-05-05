import { useState } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "react-toastify";

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
        toast.error("Silakan login terlebih dahulu");
        setLoading(false);
        return;
      }

      let fileUrl = "";

      if (file) {
        if (!file.name.endsWith(".pdf") && !file.name.endsWith(".zip")) {
          toast.warn("Format file harus PDF atau ZIP");
          setLoading(false);
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.warn("Ukuran file maksimal 5MB");
          setLoading(false);
          return;
        }

        const cleanName = file.name.replace(/\s+/g, "_");
        const fileName = Date.now() + "_" + cleanName;

        const { error } = await supabase.storage
          .from("tugas")
          .upload(fileName, file);

        if (error) {
          toast.error(error.message);
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
        toast.error(insertError.message);
        setLoading(false);
        return;
      }

      toast.success("Tugas berhasil diunggah!");
      setNama("");
      setMatkul("");
      setPertemuan("");
      setFile(null);
      setLink("");
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
      
      {/* HEADER */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Submission Open
        </div>
        <h2 className="text-3xl font-medium tracking-tight text-gray-900">
          Unggah Tugas Baru
        </h2>
        <p className="text-gray-400 mt-1">Lengkapi informasi berkas untuk verifikasi mata kuliah.</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-8">
        
        {/* INPUT GROUP: Nama Tugas */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
            Judul Tugas
          </label>
          <input
            type="text"
            placeholder="Masukkan nama tugas..."
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
          />
        </div>

        {/* GRID 2 KOLOM: Matkul & Pertemuan */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
              Mata Kuliah
            </label>
            <input
              type="text"
              placeholder="Contoh: Kecerdasan Buatan"
              value={matkul}
              onChange={(e) => setMatkul(e.target.value)}
              required
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
              Pertemuan Ke-
            </label>
            <input
              type="number"
              placeholder="0"
              value={pertemuan}
              onChange={(e) => setPertemuan(e.target.value)}
              required
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
            />
          </div>
        </div>

        {/* FILE UPLOAD AREA */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
            Lampiran Berkas (Opsional)
          </label>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-10 cursor-pointer transition-all duration-300 ${
            file ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
          }`}>
            <input
              type="file"
              accept=".pdf,.zip"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            
            <div className="text-center">
              {file ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-4 border border-blue-100">
                    <span className="text-2xl text-blue-500">{file.name.endsWith('.pdf') ? '📕' : '📦'}</span>
                  </div>
                  <p className="text-sm font-bold text-blue-600 truncate max-w-[250px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-tighter">Ganti Berkas</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm mb-4">
                    <span className="text-xl text-gray-300">📁</span>
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    Tarik file atau <span className="text-black font-bold">Pilih Dokumen</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold tracking-widest uppercase">
                    PDF / ZIP • MAX 5MB
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* LINK ALTERNATIVE */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
            Tautan Eksternal (Opsional)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-blue-400 transition-colors">
              🔗
            </div>
            <input
              type="text"
              placeholder="https://github.com/syahdan/project-ai"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 font-medium"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-5 rounded-[2rem] font-bold text-sm tracking-widest uppercase hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-20 disabled:pointer-events-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Kirim Tugas"
          )}
        </button>
      </form>
    </div>
  );
}