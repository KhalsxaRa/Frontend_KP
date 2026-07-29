import { useState } from "react";
import { User, Mail, Save, Camera, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "Admin PROBIT",
    email: "admin@probit.com",
  });
  const [avatar, setAvatar] = useState(null); // Untuk file gambar
  const [preview, setPreview] = useState(null); // Untuk preview gambar
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    if (avatar) formData.append("image", avatar);

    try {
      await api.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.dispatchEvent(new Event("profileUpdated"));
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/admin");
      }, 2000);
    } catch (err) {
      // PERUBAHAN DI SINI: Lihat error lengkapnya di console
      console.error("Detail Error:", err.response?.data);
      alert(err.response?.data?.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Berhasil!</h3>
            <p className="text-slate-500">Profil Anda telah diperbarui.</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white/80 backdrop-blur-xl border border-slate-100 p-10 rounded-[2rem] shadow-xl"
      >
        <h2 className="text-2xl font-black text-slate-800 mb-8">Edit Profil</h2>

        {/* Avatar Upload */}
        <div className="flex justify-center mb-8">
          <label className="relative cursor-pointer group">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-50 overflow-hidden bg-slate-100 flex items-center justify-center">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-slate-300" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full text-white shadow-lg">
              <Camera size={18} />
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="relative">
            <User
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />
            <input
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              placeholder="Username"
            />
          </div>
          <div className="relative">
            <Mail
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              placeholder="Email"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            "Menyimpan..."
          ) : (
            <>
              <Save size={18} /> Simpan Perubahan
            </>
          )}
        </button>
      </form>
    </div>
  );
}


