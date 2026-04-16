import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "react-toastify";
import { Eye, Download, Link as LinkIcon, Trash2 } from "lucide-react";

export default function List() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [user, setUser] = useState(null);

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

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Loading...</p>;
  }
const handleDelete = async (item) => {
  const confirmDelete = confirm("Yakin mau hapus?");
  if (!confirmDelete) return;


  try {
    // hapus file
    if (item.file_url) {
      const fileName = item.file_url.split("/").pop();

      await supabase.storage
        .from("tugas")
        .remove([fileName]);
    }

    // 🔥 delete + return data
    const { data, error } = await supabase
      .from("tugas")
      .delete()
      .eq("id", item.id)
      .select();

    console.log("DELETED:", data);

    if (error) throw error;

    // ❗ kalau tidak ada yang kehapus
    if (!data || data.length === 0) {
      toast.error("Tidak ada data yang dihapus");
      return;
    }

    // update UI
    setTasks((prev) => prev.filter((t) => t.id !== item.id));

    toast.success("Berhasil hapus");

  } catch (error) {
    console.error(error);
   toast.error("Gagal hapus");
  }
};
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Daftar Tugas
      </h2> */}

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow">
          Tidak ada data
        </div>
      )}

      {/* CARD GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {tasks.map((item) => (
    <div
      key={item.id}
      className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* TOP */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-lg leading-tight">
          {item.nama}
        </h3>

        {/* BADGE PERTEMUAN */}
        {item.pertemuan && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
            Pertemuan {item.pertemuan}
          </span>
        )}
      </div>

      {/* MATKUL */}
      {item.matkul && (
        <div className="mb-4">
          <span className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full">
            {item.matkul}
          </span>
        </div>
      )}

      {/* ACTION */}
      <div className="space-y-2 mt-auto">

        {/* FILE */}
        {item.file_url && (
            <>
            {item.file_url.endsWith(".pdf") && (
                <button
                onClick={() => setPreview(item.file_url)}
                className="w-full flex items-center justify-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
                >
                <Eye size={16} />
                Preview
                </button>
            )}

            <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 text-sm bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
                <Download size={16} />
                Download
            </a>
            </>
        )}

        {/* LINK */}
        {item.link_url && (
            <a
            href={item.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-sm bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition"
            >
            <LinkIcon size={16} />
            Buka Link
            </a>
        )}
    </div>

        {/* DELETE */}
        {user && user.id === item.user_id && (
        <button
            onClick={() => handleDelete(item)}
            className="w-full mt-3 flex items-center justify-center gap-2 text-sm bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition"
        >
            <Trash2 size={16} />
            Hapus
        </button>
        )}
      

      {/* FOOTER */}
      <div className="mt-4 text-xs text-gray-400">
        Diupload Pada  {new Date(item.created_at).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(/\./g, ':')}
    </div>
        </div>
    ))}
    </div>

      {/* MODAL PREVIEW */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden shadow-lg relative">
            
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded"
            >
              ✕
            </button>

            {/* Preview PDF */}
            <iframe
              src={preview}
              title="preview"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}