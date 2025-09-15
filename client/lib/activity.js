export function recordActivity(type, payload = {}) {
  const now = new Date().toISOString();
  const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` , type, payload, ts: now };
  const list = getActivity();
  list.unshift(item);
  localStorage.setItem("dp_activity", JSON.stringify(list.slice(0, 500)));
  return item;
}

export function getActivity() {
  try {
    const raw = localStorage.getItem("dp_activity");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function summarizeActivityByDay() {
  const byDay = {};
  for (const a of getActivity()) {
    const day = a.ts.slice(0, 10);
    byDay[day] = byDay[day] || { day, events: 0 };
    byDay[day].events += 1;
  }
  return Object.values(byDay).sort((a, b) => (a.day > b.day ? 1 : -1));
}
