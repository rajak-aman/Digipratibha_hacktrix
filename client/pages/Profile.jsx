import { useEffect, useState } from "react";
import { getProfile, saveProfile, getStats } from "@/lib/profile";

export default function Profile() {
  const [profile, setProfile] = useState(getProfile());
  const [stats, setStats] = useState(getStats());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const onStorage = () => setStats(getStats());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...profile, [name]: value };
    setProfile(next);
    saveProfile(next);
    setSaved(true);
    clearTimeout((window)._dpSavedT);
    (window)._dpSavedT = setTimeout(() => setSaved(false), 1200);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0a0112] text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold">Profile</h1>
        <p className="text-white/70">Manage your profile and see quick stats.</p>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Profile</h2>
              {saved && <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/80">Saved</span>}
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4 items-start">
              <div className="flex items-center gap-4">
                <div className="size-20 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                  {profile.photo ? (
                    <img src={profile.photo} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/60 text-sm">No Photo</span>
                  )}
                </div>
                <label className="text-sm">
                  <span className="block text-white/70 mb-1">Profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const next = { ...profile, photo: reader.result };
                        setProfile(next);
                        saveProfile(next);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="block text-white/70"
                  />
                </label>
              </div>
              <div className="grid gap-3">
                <label className="text-sm">
                  <span className="block text-white/70 mb-1">Username</span>
                  <input name="username" value={profile.username} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="Your name" />
                </label>
                <label className="text-sm">
                  <span className="block text-white/70 mb-1">Description</span>
                  <textarea name="description" value={profile.description} onChange={handleChange} rows={3} className="w-full rounded-md bg-white/10 px-3 py-2" placeholder="Short bio" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm">
                    <span className="block text-white/70 mb-1">Website</span>
                    <input name="website" value={profile.website || ""} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="https://" />
                  </label>
                  <label className="text-sm">
                    <span className="block text-white/70 mb-1">Location</span>
                    <input name="location" value={profile.location || ""} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="City, Country" />
                  </label>
                </div>
                <label className="text-sm">
                  <span className="block text-white/70 mb-1">Skills (comma separated)</span>
                  <input name="skills" value={profile.skills || ""} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="React, Node, UI/UX" />
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="text-sm">
                    <span className="block text-white/70 mb-1">GitHub</span>
                    <input name="github" value={profile.github || ""} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="username" />
                  </label>
                  <label className="text-sm">
                    <span className="block text-white/70 mb-1">LinkedIn</span>
                    <input name="linkedin" value={profile.linkedin || ""} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="username" />
                  </label>
                  <label className="text-sm">
                    <span className="block text-white/70 mb-1">Twitter</span>
                    <input name="twitter" value={profile.twitter || ""} onChange={handleChange} className="h-10 w-full rounded-md bg-white/10 px-3" placeholder="username" />
                  </label>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { const next = { ...profile, photo: "" }; setProfile(next); saveProfile(next); }} className="h-9 px-3 rounded-md bg-white/10 hover:bg-white/20">Remove photo</button>
                  <button onClick={() => { const empty = { username: "", description: "", photo: "", website: "", location: "", skills: "", github: "", linkedin: "", twitter: "" }; setProfile(empty); saveProfile(empty); }} className="h-9 px-3 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/30">Clear profile</button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-6">
            <div>
              <h2 className="font-semibold">Stats</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-extrabold">{stats.pdfExports || 0}</div>
                  <div className="text-white/70 text-sm">PDF Exports</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-2xl font-extrabold">{stats.htmlDownloads || 0}</div>
                  <div className="text-white/70 text-sm">HTML Downloads</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-semibold">Preview</h2>
              <div className="mt-3 rounded-lg bg-[#0d0b12] p-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                    {profile.photo ? <img src={profile.photo} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-xs text-white/60">No Photo</span>}
                  </div>
                  <div>
                    <div className="font-semibold">{profile.username || "Your name"}</div>
                    <div className="text-xs text-white/70">{profile.location || "Location"}</div>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-3">{profile.description || "Short bio"}</p>
                {profile.skills && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.skills.split(",").map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-white/10 text-white/80">{s.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
