import React, { useState, useEffect } from "react";

const REPORT_DATE = "March 12, 2026";
const DAY_NUMBER = 13;

const STATUS = {
  CLOSED: { label: "CLOSED", bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", dot: "#EF4444" },
  SUSPENDED: { label: "SUSPENDED", bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", dot: "#EF4444" },
  LIMITED: { label: "LIMITED", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  RESTRICTED: { label: "RESTRICTED", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  PARTIAL: { label: "PARTIAL", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  OPERATIONAL: { label: "OPERATIONAL", bg: "#F0FDF4", border: "#BBF7D0", text: "#166534", dot: "#22C55E" },
  HALTED: { label: "HALTED", bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", dot: "#EF4444" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.CLOSED;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "'IBM Plex Mono', monospace", background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, boxShadow: `0 0 4px ${s.dot}50` }} />
      {s.label}
    </span>
  );
};

const PulseDot = ({ color }) => (
  <span style={{ position: "relative", display: "inline-block", width: 8, height: 8, marginRight: 6 }}>
    <span style={{ position: "absolute", inset: -3, borderRadius: "50%", background: color, opacity: 0.25, animation: "pulse 2s ease-in-out infinite" }} />
    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
  </span>
);

// ===== UPDATED DATA FOR MARCH 12 =====
const maritimePorts = [
  { country: "UAE", port: "Jebel Ali (T1–T4)", status: "OPERATIONAL", note: "Enhanced security. Carrier bookings remain largely suspended. Citi evacuated Dubai finance-centre office; PwC closed ME offices." },
  { country: "UAE", port: "Khalifa Port (Abu Dhabi)", status: "OPERATIONAL", note: "Operational but cut off by Hormuz closure. Mayuree Naree departed here before being attacked in Hormuz." },
  { country: "UAE", port: "Fujairah / Khor Fakkan", status: "OPERATIONAL", note: "Key alternative hub. GPS spoofing persists offshore. Temp customs facilitation for road transfer to Jebel Ali." },
  { country: "UAE", port: "Sharjah / Hamriyah", status: "OPERATIONAL", note: "Operations smooth. No alerts." },
  { country: "Oman", port: "Sohar", status: "OPERATIONAL", note: "Emerging transshipment alternative outside Hormuz." },
  { country: "Oman", port: "Salalah", status: "SUSPENDED", note: "NEW: Maersk halted operations until further notice. Drone strikes hit fuel storage tanks. Major escalation." },
  { country: "Oman", port: "Duqm", status: "RESTRICTED", note: "Previously struck by 2 Iranian drones. Fuel tanks damaged. Additional drone strikes reported." },
  { country: "Saudi Arabia", port: "Ras Tanura", status: "RESTRICTED", note: "Under heightened alert. Saudi intercepted 6 ballistic missiles at Prince Sultan Air Base Mar 11." },
  { country: "Saudi Arabia", port: "Jeddah (Islamic Port)", status: "OPERATIONAL", note: "Red Sea side — outside Hormuz. Houthi threat persists." },
  { country: "Saudi Arabia", port: "King Abdullah / Yanbu", status: "OPERATIONAL", note: "Red Sea coast. Accepting diverted bookings." },
  { country: "Saudi Arabia", port: "Dammam", status: "OPERATIONAL", note: "Gulf-side. Trapped behind Hormuz. LSCI 95." },
  { country: "Qatar", port: "Hamad Port", status: "RESTRICTED", note: "Qatari military intercepted missile attack Mar 11. Ukrainian anti-drone teams now operating in-country." },
  { country: "Bahrain", port: "KBSP / Bahrain Steel", status: "SUSPENDED", note: "Not operating. Dozens wounded in Sitra including children. Fire at Ma'ameer facility after drone strike." },
  { country: "Kuwait", port: "Shuwaikh / Shuaiba", status: "OPERATIONAL", note: "Security Level 2. National Guard downed 8 drones Mar 11. Drone hit residential building, 2 injured." },
  { country: "Iraq", port: "Umm Qasr / Khor Al Zubair", status: "RESTRICTED", note: "NEW: 2 oil tankers attacked by Iranian drone boat off Port of Basra Mar 11, set ablaze, 1 crew killed." },
  { country: "Jordan", port: "Aqaba", status: "OPERATIONAL", note: "All operations normal. ISPS Level 1. Jordan stable." },
  { country: "Egypt", port: "Suez Canal / Port Said", status: "OPERATIONAL", note: "Canal operational at ISPS Level 1. Carrier self-diversion means minimal traffic." },
];

const airspaceData = [
  { country: "Iran (OIIX)", status: "CLOSED", note: "Closed. Limited CAA exceptions. Mehrabad Airport bombed overnight Mar 11." },
  { country: "Iraq (ORBB)", status: "CLOSED", note: "Total closure. Extended to Mar 13+. Islamic Resistance in Iraq claimed Erbil explosions." },
  { country: "Bahrain (OBBB)", status: "CLOSED", note: "Total closure. Ongoing Iranian strikes on Manama and Sitra areas." },
  { country: "Kuwait (OKAC)", status: "CLOSED", note: "Total closure. Airport T1 damaged. 8 drones downed Mar 11. Drone hit residential building." },
  { country: "Syria (OSTT)", status: "CLOSED", note: "Total closure. Israel launched large-scale strikes on Beirut suburbs." },
  { country: "Israel (LLLL)", status: "LIMITED", note: "PPR only. Iran's 'most intense operation' of war — advanced ballistic missiles at Tel Aviv & Haifa." },
  { country: "UAE (OMAE)", status: "LIMITED", note: "ESCAT active. DXB: 2 drones hit near airport Mar 11, 4 injured, but flights continued. Emirates serving 84 destinations." },
  { country: "Qatar (OTDF)", status: "LIMITED", note: "ESCAT active. Missile attack intercepted Mar 11. Limited flights continuing." },
  { country: "Saudi Arabia (OEJD)", status: "PARTIAL", note: "Intercepted 6 ballistic missiles at Prince Sultan Air Base + eastern drones Mar 11." },
  { country: "Oman (OOMM)", status: "OPERATIONAL", note: "Airspace open. Key remaining open corridor. But Salalah port now suspended." },
  { country: "Jordan (OJAC)", status: "PARTIAL", note: "Open with night closure 18:00-09:00. Extra fuel required." },
];

const roadData = [
  { route: "UAE Internal", status: "OPERATIONAL", note: "Domestic road freight uninterrupted. Enhanced security. Major firms evacuating offices (Citi, PwC)." },
  { route: "UAE–Oman (Fujairah → Jebel Ali)", status: "OPERATIONAL", note: "CRITICAL CORRIDOR. Temp customs facilitation. Al Rawdah crossing available." },
  { route: "Saudi Arabia–UAE", status: "OPERATIONAL", note: "Border crossings functioning. Security delays." },
  { route: "Saudi Arabia–Jordan", status: "OPERATIONAL", note: "Jordan stable. Aqaba operational." },
  { route: "Kuwait–Saudi Arabia", status: "OPERATIONAL", note: "Land border for citizen repatriation. Drone threats increasing on Kuwait soil." },
  { route: "Iraq–Kuwait / Turkey", status: "LIMITED", note: "Basra tankers attacked Mar 11. Security elevated. Islamic Resistance active in Erbil." },
  { route: "Oman Internal (Sohar–Salalah)", status: "RESTRICTED", note: "NEW: Salalah port suspended by Maersk. Drone strikes on Salalah fuel tanks. Sohar still operational." },
];

const carrierData = [
  { name: "Maersk", action: "Hormuz & Red Sea suspended. NEW: Halted operations at Port of Salalah, Oman until further notice — eliminates key alternative outside Hormuz." },
  { name: "MSC", action: "ALL bookings worldwide to/from ME suspended. 15 vessels (109K TEU) trapped. No change." },
  { name: "CMA CGM", action: "Vessels sheltering. ECS: $2K-$4K. 14 vessels (70K TEU) trapped. No change." },
  { name: "Hapag-Lloyd", action: "All Hormuz crossings suspended. WRS $1,500/TEU. No change." },
  { name: "ONE", action: "Container vessel ONE Majesty (Japan-flagged) sustained stern damage while anchored 52nm from Hormuz Mar 11." },
];

const kpis = [
  { label: "Strait of Hormuz", value: "CLOSED", sub: "Day 11 · 14+ vessels attacked since Feb 28 · 3 ships hit Mar 11 · Mine threat active", color: "#DC2626", accent: "#FEF2F2" },
  { label: "Red Sea / Bab el-Mandeb", value: "HIGH THREAT", sub: "Houthis poised to resume · All carriers on Cape routing · No confirmed strikes yet", color: "#D97706", accent: "#FFFBEB" },
  { label: "Brent Crude", value: "$91.98/bbl", sub: "Closed ↑4.76% Mar 11 · IEA 400M bbl emergency release · Still ~20% above pre-war", color: "#D97706", accent: "#FFFBEB" },
  { label: "Airspace Closures", value: "6 NATIONS", sub: "Iran · Iraq · Bahrain · Kuwait · Syria · Israel(PPR) · UAE/Qatar limited", color: "#DC2626", accent: "#FEF2F2" },
  { label: "Flights: DXB Update", value: "84 ROUTES", sub: "Emirates progressively restoring · 2 drones near DXB Mar 11 · 4 injured · Flights continued", color: "#D97706", accent: "#FFFBEB" },
  { label: "Vessels Attacked", value: "14+", sub: "Since Feb 28 · 3 ships + 2 tankers hit Mar 11 · Mayuree Naree ablaze · 3 crew missing", color: "#DC2626", accent: "#FEF2F2" },
  { label: "IEA Emergency Release", value: "400M bbl", sub: "Largest ever · US: 172M from SPR · Germany, Austria, Japan also releasing", color: "#D97706", accent: "#FFFBEB" },
  { label: "Road Freight (GCC)", value: "OPERATIONAL", sub: "Most resilient mode · But Salalah port now suspended · Oman corridor degraded", color: "#16A34A", accent: "#F0FDF4" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const handleRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); };

  const tabs = [
    { id: "overview", icon: "◉", label: "Overview" },
    { id: "maritime", icon: "⚓", label: "Maritime & Ports" },
    { id: "air", icon: "✈", label: "Air Freight" },
    { id: "road", icon: "🛣", label: "Road Transport" },
    { id: "carriers", icon: "📦", label: "Carriers" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#1E293B", fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.25} 50%{transform:scale(2.2);opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card { background:#FFF; border:1px solid #E2E8F0; border-radius:10px; box-shadow:0 1px 3px rgba(15,23,42,0.04); transition:box-shadow 0.2s,border-color 0.2s; }
        .card:hover { box-shadow:0 4px 12px rgba(15,23,42,0.06); border-color:#CBD5E1; }
        .tab-btn { padding:8px 18px; border:1px solid #E2E8F0; border-radius:8px; background:#FFF; color:#64748B; cursor:pointer; font-family:inherit; font-size:12.5px; font-weight:600; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .tab-btn:hover { color:#334155; background:#F1F5F9; border-color:#CBD5E1; }
        .tab-btn.active { background:#0F172A; color:#FFF; border-color:#0F172A; box-shadow:0 2px 8px rgba(15,23,42,0.2); }
        .refresh-btn { padding:8px 20px; border:1px solid #E2E8F0; border-radius:8px; background:#FFF; color:#0F172A; cursor:pointer; font-family:inherit; font-size:12.5px; font-weight:600; transition:all 0.2s; display:flex; align-items:center; gap:7px; }
        .refresh-btn:hover { background:#F1F5F9; border-color:#94A3B8; }
        .tbl-header { display:grid; padding:10px 16px; background:#F8FAFC; border-bottom:2px solid #E2E8F0; font-size:10px; font-weight:700; letter-spacing:0.08em; color:#64748B; text-transform:uppercase; position:sticky; top:0; z-index:2; }
        .tbl-row { display:grid; padding:12px 16px; border-bottom:1px solid #F1F5F9; align-items:center; transition:background 0.15s; }
        .tbl-row:hover { background:#F8FAFC; }
        .tbl-row:last-child { border-bottom:none; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:#F8FAFC; } ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0", padding: "14px 24px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(15,23,42,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#DC2626", textTransform: "uppercase", display: "flex", alignItems: "center" }}>
                <PulseDot color="#DC2626" /> ACTIVE CONFLICT — DAY {DAY_NUMBER}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", letterSpacing: "0.06em" }}>CRITICAL — ESCALATING</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#0F172A" }}>Middle East Logistics Status Report</h1>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>
              {REPORT_DATE} · Operation Epic Fury · Iran's "Most Intense Operation" of War · Salalah Port Suspended
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#0F172A", fontSize: 15, fontWeight: 600 }}>{time.toLocaleTimeString("en-US", { hour12: false })} <span style={{ fontSize: 10, color: "#94A3B8" }}>UTC</span></div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>Updated: {REPORT_DATE}</div>
            </div>
            <button className="refresh-btn" onClick={handleRefresh}>
              <span style={{ display: "inline-block", fontSize: 15, transition: "transform 0.6s", transform: refreshing ? "rotate(360deg)" : "none" }}>↻</span>
              {refreshing ? "Refreshing…" : "Refresh Data"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {tabs.map(t => (<button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}><span style={{ fontSize: 13 }}>{t.icon}</span> {t.label}</button>))}
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ===== WHAT'S NEW BANNER ===== */}
        {activeTab === "overview" && (
          <div style={{ animation: "slideUp 0.35s ease" }}>
            <div style={{ padding: "12px 16px", marginBottom: 16, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, borderLeft: "4px solid #2563EB" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#1E40AF", textTransform: "uppercase", marginBottom: 6 }}>⚡ Key Changes Since March 11</div>
              <div style={{ fontSize: 12.5, color: "#1E3A5F", lineHeight: 1.65 }}>
                <strong>ESCALATION:</strong> Iran launched its "most intense operation" of the war — advanced ballistic missiles at Tel Aviv/Haifa. 3 more ships attacked in Hormuz (total 14+). 2 oil tankers attacked off Basra by drone boat. Maersk <strong>halted Salalah port operations</strong> (Oman) — eliminating a key alternative outside Hormuz. Iran threatens to target banks & financial institutions across ME. IEA announced <strong>largest-ever emergency oil release</strong> (400M bbl). US SPR contributing 172M bbl. Brent closed $91.98 (+4.76%). Citi evacuated Dubai office, PwC closed ME offices. UN Security Council passed resolution (135 co-sponsors) demanding Iran stop attacks. CENTCOM warns civilian ports used militarily lose protected status. Iran warns all regional ports could become targets.
              </div>
            </div>

            {/* KPI CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} className="card" style={{ padding: "16px 18px", position: "relative", overflow: "hidden", background: k.accent }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: k.color }} />
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: k.color, marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.1 }}>{k.value}</div>
                  <div style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.4 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* SITUATION SUMMARY */}
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, background: "#0F172A", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>i</span>
                Situation Summary — Day 13
              </h3>
              <div style={{ display: "grid", gap: 10, fontSize: 13, lineHeight: 1.65, color: "#334155" }}>
                {[
                  {
                    border: "#DC2626", bg: "#FEF2F2", label: "MARITIME", labelColor: "#991B1B",
                    text: "Hormuz CLOSED Day 11. Major escalation: 3 ships attacked Mar 11 (Mayuree Naree ablaze, 3 crew missing; ONE Majesty stern damage; Star Gwyneth hull damage NW of Dubai). 2 oil tankers attacked off Basra by Iranian drone boat, 1 crew killed. Total 14+ vessels hit since Feb 28. IRGC demands approval for ANY Hormuz transit. US destroyed 16 minelayers. Iran mine threat active. CRITICAL: Maersk suspended Salalah port (Oman) — eliminates key alternative outside Hormuz. Iran restarted crude exports via Jask terminal (Gulf of Oman) to China. 7 'dark' ships transited since Mar 8 (5 Iran-linked). Shadow fleet activity intensifying."
                  },
                  {
                    border: "#D97706", bg: "#FFFBEB", label: "AIR FREIGHT", labelColor: "#92400E",
                    text: "Iran, Iraq, Bahrain, Kuwait, Syria fully closed. Israel PPR only. UAE/Qatar limited under ESCAT. DXB: 2 drones hit near airport Mar 11 — 4 people injured but flights continued. Emirates now serving 84 destinations, progressively restoring. Iran launched 'most intense operation' of war with advanced ballistic missiles at Tel Aviv/Haifa. Saudi intercepted 6 ballistic missiles at Prince Sultan Air Base. Kuwait National Guard downed 8 drones."
                  },
                  {
                    border: "#16A34A", bg: "#F0FDF4", label: "ROAD FREIGHT", labelColor: "#166534",
                    text: "Still the most resilient mode but Oman corridor degrading. Fujairah/Khor Fakkan → Jebel Ali remains critical. However, Salalah port suspension and drone strikes on Duqm/Salalah fuel tanks reduce Oman's viability as transshipment alternative. Corporate evacuations (Citi, PwC) signal business continuity pressure."
                  },
                  {
                    border: "#7C3AED", bg: "#F5F3FF", label: "ENERGY & MARKETS", labelColor: "#5B21B6",
                    text: "Brent closed $91.98/bbl (+4.76% Mar 11). Still ~20% above pre-war. IEA announced largest-ever emergency release: 400M bbl from member reserves (US: 172M from SPR; Germany, Austria, Japan also releasing). Failed to drive prices down — analysts warn >$100 if war extends past this week. Iran threatens banks/financial institutions as new target category. UN Security Council resolution (135 co-sponsors) demands Iran stop attacks on neighbours."
                  },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: s.bg, borderRadius: 8, borderLeft: `4px solid ${s.border}` }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: s.labelColor, textTransform: "uppercase", marginRight: 8 }}>{s.label}:</span>
                    <span style={{ color: "#475569" }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SURCHARGES */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Emergency Surcharges & Market Actions</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
                {[
                  { carrier: "CMA CGM", charge: "$2K–$4K/box", type: "Emergency Conflict Surcharge" },
                  { carrier: "Hapag-Lloyd", charge: "$1,500/TEU", type: "War Risk Surcharge" },
                  { carrier: "Maersk", charge: "EFI + Salalah halt", type: "Emergency Freight + Port Suspension" },
                  { carrier: "IEA Members", charge: "400M bbl release", type: "Largest-ever emergency reserve" },
                  { carrier: "US DOE", charge: "172M bbl SPR", type: "Strategic Petroleum Reserve tap" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A" }}>
                    <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 12.5, marginBottom: 3 }}>{s.carrier}</div>
                    <div style={{ color: "#B45309", fontWeight: 700, fontSize: 17, fontFamily: "'IBM Plex Mono', monospace" }}>{s.charge}</div>
                    <div style={{ color: "#92400E", fontSize: 10.5, marginTop: 2 }}>{s.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MARITIME */}
        {activeTab === "maritime" && (
          <div style={{ animation: "slideUp 0.35s ease" }}>
            <div style={{ padding: "12px 16px", marginBottom: 16, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, borderLeft: "4px solid #DC2626" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>⚠ ESCALATION ALERT — March 11-12</div>
              <div style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6 }}>
                3 ships attacked near Hormuz Mar 11 (Mayuree Naree ablaze/3 missing, ONE Majesty, Star Gwyneth). 2 oil tankers attacked off Basra by drone boat. Maersk halted Salalah port. IRGC demands transit approval for all ships. Iran warns all regional ports are legitimate targets if Iranian ports are threatened. CENTCOM warns civilian ports used militarily lose protected status. Total vessels attacked: 14+ since Feb 28.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Hormuz Pre-Conflict", val: "153", unit: "transits/day", color: "#94A3B8", bg: "#F8FAFC" },
                { label: "Hormuz Current", val: "~0", unit: "(7 dark ships since Mar 8)", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Vessels Attacked", val: "14+", unit: "since Feb 28", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Minelayers Destroyed", val: "16", unit: "by US forces Mar 10", color: "#D97706", bg: "#FFFBEB" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 16, textAlign: "center", background: s.bg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#64748B", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{s.unit}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="tbl-header" style={{ gridTemplateColumns: "90px 170px 115px 1fr" }}><span>Country</span><span>Port / Terminal</span><span>Status</span><span>Notes</span></div>
              <div style={{ maxHeight: 560, overflow: "auto" }}>
                {maritimePorts.map((p, i) => (
                  <div key={i} className="tbl-row" style={{ gridTemplateColumns: "90px 170px 115px 1fr", fontSize: 12.5, background: p.note.includes("NEW:") ? "#FFFBEB" : undefined }}>
                    <span style={{ fontWeight: 600, color: "#64748B" }}>{p.country}</span>
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>{p.port}</span>
                    <span><StatusBadge status={p.status} /></span>
                    <span style={{ color: "#64748B", lineHeight: 1.5 }}>{p.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AIR */}
        {activeTab === "air" && (
          <div style={{ animation: "slideUp 0.35s ease" }}>
            <div style={{ padding: "12px 16px", marginBottom: 16, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, borderLeft: "4px solid #D97706" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>DXB UPDATE — March 11-12</div>
              <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6 }}>
                2 Iranian drones hit near Dubai International Airport on Mar 11 — 4 people injured (3 minor, 1 moderate). Air traffic continued operating. Emirates now serving 84 destinations, progressively restoring full schedule. However, Iran's joint military command announced banks and financial institutions are now targets — threatening Dubai's financial centre.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Brent Close Mar 11", val: "$91.98", delta: "↑ 4.76%", bg: "#FFFBEB" },
                { label: "IEA Reserve Release", val: "400M bbl", delta: "Largest ever", bg: "#EFF6FF" },
                { label: "US SPR Release", val: "172M bbl", delta: "Starting next week", bg: "#EFF6FF" },
                { label: "Emirates Routes", val: "84", delta: "Progressively restoring", bg: "#F0FDF4" },
                { label: "DXB Drone Incidents", val: "2", delta: "4 injured · Flights OK", bg: "#FFFBEB" },
              ].map((m, i) => (
                <div key={i} className="card" style={{ padding: 14, textAlign: "center", background: m.bg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#0F172A" }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: "#D97706", fontWeight: 600, marginTop: 2 }}>{m.delta}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="tbl-header" style={{ gridTemplateColumns: "170px 115px 1fr" }}><span>Country / FIR</span><span>Airspace</span><span>Details</span></div>
              <div style={{ maxHeight: 440, overflow: "auto" }}>
                {airspaceData.map((a, i) => (
                  <div key={i} className="tbl-row" style={{ gridTemplateColumns: "170px 115px 1fr", fontSize: 12.5 }}>
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>{a.country}</span>
                    <span><StatusBadge status={a.status} /></span>
                    <span style={{ color: "#64748B", lineHeight: 1.5 }}>{a.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROAD */}
        {activeTab === "road" && (
          <div style={{ animation: "slideUp 0.35s ease" }}>
            <div style={{ padding: "14px 18px", marginBottom: 20, background: "#FFFBEB", borderLeft: "4px solid #D97706", border: "1px solid #FDE68A", borderRadius: 10 }}>
              <div style={{ fontSize: 13.5, color: "#92400E", fontWeight: 600, marginBottom: 4 }}>Road freight remains the most resilient mode — but Oman corridor is degrading.</div>
              <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.65 }}>
                Maersk's suspension of Salalah port and drone strikes on Duqm/Salalah fuel tanks reduce Oman's viability as a bypass hub. Fujairah/Khor Fakkan → Jebel Ali remains the critical workaround. Major corporations (Citi, PwC) evacuating Gulf offices signals growing business continuity risk. Iran's new threat to target banks and financial institutions adds pressure.
              </div>
            </div>
            <div className="card">
              <div className="tbl-header" style={{ gridTemplateColumns: "230px 115px 1fr" }}><span>Route / Corridor</span><span>Status</span><span>Details</span></div>
              {roadData.map((r, i) => (
                <div key={i} className="tbl-row" style={{ gridTemplateColumns: "230px 115px 1fr", fontSize: 12.5, background: r.note.includes("NEW:") ? "#FFFBEB" : undefined }}>
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>{r.route}</span>
                  <span><StatusBadge status={r.status} /></span>
                  <span style={{ color: "#64748B", lineHeight: 1.5 }}>{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARRIERS */}
        {activeTab === "carriers" && (
          <div style={{ animation: "slideUp 0.35s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Vessels Trapped", val: "~140", sub: "in Persian Gulf", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Vessels Attacked", val: "14+", sub: "since Feb 28", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Fleet Impacted", val: "10.7%", sub: "of global capacity", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Transit Extension", val: "+10–15d", sub: "Cape of Good Hope", color: "#D97706", bg: "#FFFBEB" },
                { label: "Salalah Port", val: "HALTED", sub: "Maersk suspended ops", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Shanghai→Jebel Ali", val: ">$4K/FEU", sub: "was $1,800 pre-conflict", color: "#DC2626", bg: "#FEF2F2" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 14, textAlign: "center", background: s.bg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="tbl-header" style={{ gridTemplateColumns: "120px 1fr" }}><span>Carrier</span><span>Actions & Status</span></div>
              {carrierData.map((c, i) => (
                <div key={i} className="tbl-row" style={{ gridTemplateColumns: "120px 1fr", fontSize: 12.5 }}>
                  <span style={{ color: "#0F172A", fontWeight: 700 }}>{c.name}</span>
                  <span style={{ color: "#475569", lineHeight: 1.65 }}>{c.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: 32, padding: "14px 0", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 10.5, color: "#94A3B8" }}>
          <span>Sources: CNN · NBC · NPR · Al Jazeera · CNBC · Windward AI · UKMTO · EIA · IEA · EASA · Flightradar24 · Newsweek · Fast Company · Reuters · AP</span>
          <span>Confidential · Supply Chain Risk Advisory · Updated {REPORT_DATE}</span>
        </div>
      </div>
    </div>
  );
}
