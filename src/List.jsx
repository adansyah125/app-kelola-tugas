import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "react-toastify";
import { Eye, Download, Link as LinkIcon, Trash2, Search, FileText, Archive } from "lucide-react";

export default function List() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("tugas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTasks(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
    fetchData();
  }, []);

  const handleDelete = async (item) => {
    const confirmDelete = confirm("Yakin ingin menghapus tugas ini?");
    if (!confirmDelete) return;

    try {
      if (item.file_url) {
        const fileName = item.file_url.split("/").pop();
        await supabase.storage.from("tugas").remove([fileName]);
      }

      const { data, error } = await supabase
        .from("tugas")
        .delete()
        .eq("id", item.id)
        .select();

      if (error) throw error;

      setTasks((prev) => prev.filter((t) => t.id !== item.id));
      toast.success("Berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus");
    }
  };

  const handleDownload = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = url.split("/").pop();
    link.click();
  };

  const filteredTasks = tasks.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.matkul?.toLowerCase().includes(search.toLowerCase()) ||
    item.pertemuan?.toString().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      {/* SEARCH BAR - Clean Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
          <input
            type="text"
            placeholder="Cari tugas atau mata kuliah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-6 py-4 focus:ring-4 focus:ring-gray-50 focus:border-gray-200 outline-none transition-all placeholder:text-gray-300 font-medium shadow-sm"
          />
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Submission</p>
          <p className="text-2xl font-medium">{filteredTasks.length} Berkas</p>
        </div>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
          <p className="text-gray-400 font-medium">Tidak ada data ditemukan</p>
        </div>
      )}

      {/* CARD GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTasks.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-[2rem] border border-gray-50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
          >
            {/* ICON & BADGE */}
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-black group-hover:text-white transition-all duration-500">
                {item.file_url?.endsWith(".pdf") ? <FileText size={20} /> : <Archive size={20} />}
              </div>
              {item.pertemuan && (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                  Pertemuan {item.pertemuan}
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="mb-8 flex-grow">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {item.matkul || "Tanpa Mata Kuliah"}
              </p>
              <h3 className="font-semibold text-gray-900 text-xl leading-tight tracking-tight">
                {item.nama}
              </h3>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {item.file_url && (
                <>
                  {item.file_url.endsWith(".pdf") && (
                    <button
                      onClick={() => setPreview(item.file_url)}
                      className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-gray-50 hover:bg-gray-100 py-3 rounded-xl transition-colors"
                    >
                      <Eye size={14} /> Preview
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(item.file_url)}
                    className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                  >
                    <Download size={14} /> Get File
                  </button>
                </>
              )}
              
              {item.link_url && (
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all ${
                    item.file_url ? 'col-span-2 bg-green-50 text-green-700 hover:bg-green-100' : 'col-span-2 bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <LinkIcon size={14} /> Open Link
                </a>
              )}
            </div>

            {/* FOOTER & DELETE */}
            <div className="flex justify-between items-center pt-5 border-t border-gray-50">
              <span className="text-[10px] text-gray-400 font-medium">
                {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              
              {user && user.id === item.user_id && (
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Hapus Tugas"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PREVIEW - Elegant Backdrop */}
      {preview && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={() => setPreview(null)}
                className="bg-white/80 backdrop-blur-md text-black w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-black hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <iframe src={preview} title="preview" className="w-full h-full border-none" />
          </div>
        </div>
      )}
    </div>
  );
}