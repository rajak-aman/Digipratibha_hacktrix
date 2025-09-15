export function getProfile() {
  try {
    return (
      JSON.parse(localStorage.getItem("dp_profile")) || {
        username: "",
        description: "",
        photo: "",
        website: "",
        location: "",
        skills: "",
        github: "",
        linkedin: "",
        twitter: "",
      }
    );
  } catch {
    return {
      username: "",
      description: "",
      photo: "",
      website: "",
      location: "",
      skills: "",
      github: "",
      linkedin: "",
      twitter: "",
    };
  }
}

export function saveProfile(p) {
  localStorage.setItem("dp_profile", JSON.stringify(p));
}

export function getStats() {
  try {
    return (
      JSON.parse(localStorage.getItem("dp_stats")) || {
        pdfExports: 0,
        htmlDownloads: 0,
      }
    );
  } catch {
    return { pdfExports: 0, htmlDownloads: 0 };
  }
}

export function bumpStat(key) {
  const s = getStats();
  s[key] = (s[key] || 0) + 1;
  localStorage.setItem("dp_stats", JSON.stringify(s));
}
