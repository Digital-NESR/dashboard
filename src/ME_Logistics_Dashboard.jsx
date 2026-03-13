import { useState, useEffect, useCallback, useRef } from "react";

// ============ INITIAL DATA (March 13, 2026 — Day 14) ============
const INIT = {
  reportDate: "March 13, 2026",
  dayNumber: 14,
  lastRefresh: new Date().toISOString(),
  kpis: [
    { label: "Strait of Hormuz", value: "CLOSED", sub: "Day 12 · 16+ vessels attacked · New Supreme Leader vows it stays closed · US escorts may start end of March", color: "#DC2626", accent: "#FEF2F2" },
    { label: "Iraq Oil Ports", value: "HALTED", sub: "2 tankers attacked by drone boats near Basra · 1 killed · All oil port ops suspended", color: "#DC2626", accent: "#FEF2F2" },
    { label: "Brent Crude", value: ">$100/bbl", sub: "IEA: 'Largest supply disruption in history' · 8M bbl/day loss · Iran warns $200/bbl", color: "#DC2626", accent: "#FEF2F2" },
    { label: "Salalah Port (Oman)", value: "SUSPENDED", sub: "Drone strikes on fuel tanks · Staff evacuated · Maersk halted ops · Key alternative lost", color: "#DC2626", accent: "#FEF2F2" },
    { label: "Airspace Closures", value: "6 NATIONS", sub: "Iran · Iraq · Bahrain · Kuwait · Syria · Israel(PPR) · Kuwait airport hit AGAIN Mar 13", color: "#DC2626", accent: "#FEF2F2" },
    { label: "IEA Emergency Release", value: "400M bbl", sub: "Largest ever · US SPR 172M · Failing to cap prices · Only buys weeks", color: "#D97706", accent: "#FFFBEB" },
    { label: "Qatar Airways", value: "15 ROUTES", sub: "Limited flights Mar 13: LHR, JFK, FRA, BOM, DEL + 10 more · Scheduled ops still suspended", color: "#D97706", accent: "#FFFBEB" },
    { label: "Road Freight (GCC)", value: "DEGRADING", sub: "Fujairah critical corridor · Kuwait 6 power lines lost · Oman corridor severely compromised", color: "#D97706", accent: "#FFFBEB" },
  ],
  situationBlocks: [
    { border: "#DC2626", bg: "#FEF2F2", label: "OCEAN FREIGHT", labelColor: "#991B1B", text: "Hormuz CLOSED Day 12. New Supreme Leader Khamenei vows it stays closed. 16+ vessels attacked (NYT investigation: 8 seafarers killed, 1 missing). 6 ships hit in 48 hours. Iraqi drone boats attacked 2 tankers (Safesea Vishnu, Zefyros) near Basra — 1 Indian crew killed, fires burning, up to 400K bbl on fire. Iraq ALL oil ports halted. Salalah port SUSPENDED — fuel tanks hit, staff evacuated. Oman evacuating vessels from Mina Al Fahal (~1M bbl/day). Container ship struck 35nm north of Jebel Ali. Hapag-Lloyd vessel caught fire from shrapnel. Iran restarting exports via Jask terminal. Shadow fleet active." },
    { border: "#D97706", bg: "#FFFBEB", label: "AIR FREIGHT", labelColor: "#92400E", text: "Iran, Iraq, Bahrain, Kuwait, Syria CLOSED. UAE/Qatar LIMITED under ESCAT. Kuwait airport hit by drones AGAIN Mar 13 (2nd time in 6 days). 6 electricity lines knocked out by drone debris. Drone hit building near Dubai Creek Harbour. Qatar Airways operating limited flights Mar 13 to 15 destinations (LHR, JFK, FRA, BOM, DEL, ISB, etc). Emirates serving 84 destinations. Bahrain airport fuel tanks targeted. Air India imposed fuel surcharge. South Korea fuel price cap (first since 1997)." },
    { border: "#16A34A", bg: "#F0FDF4", label: "ROAD TRANSPORT", labelColor: "#166534", text: "Most resilient mode but DEGRADING. Fujairah/Khor Fakkan → Jebel Ali now the LAST MAJOR functioning alternative corridor. Kuwait infrastructure under drone pressure (6 power lines lost). Oman corridor severely compromised (Salalah suspended, Mina Al Fahal evacuation). Corporate evacuations (Citi, PwC) continuing. Iraq commercial ports still working but oil ports halted." },
    { border: "#7C3AED", bg: "#F5F3FF", label: "ENERGY & DIPLOMACY", labelColor: "#5B21B6", text: "IEA: 'Largest supply disruption in history' — 8M bbl/day loss. Brent >$100/bbl. Omani crude ~$132/bbl. Iran warns $200/bbl. IEA 400M bbl release underway but failing to cap prices. Trump authorized buying Russian stranded oil. Iran's Pezeshkian sets 3 peace conditions: rights recognition, reparations, guarantees. UNHCR: 3.2M displaced in Iran. 820K+ in Lebanon. US escorts may start end of March." },
  ],
  ports: [
    { country: "UAE", port: "Jebel Ali (T1–T4)", status: "OPERATIONAL", note: "Enhanced security. Container ship struck 35nm north Mar 12. Drone near Creek Harbour. Citi/PwC evacuated." },
    { country: "UAE", port: "Fujairah / Khor Fakkan", status: "OPERATIONAL", note: "KEY ALTERNATIVE HUB. GPS spoofing offshore. Temp customs facilitation for road transfer." },
    { country: "UAE", port: "Sharjah / Hamriyah", status: "OPERATIONAL", note: "Running smoothly (GAC, Inchcape)." },
    { country: "Oman", port: "Sohar", status: "OPERATIONAL", note: "Outside Hormuz. Operational. Growing threat environment." },
    { country: "Oman", port: "Salalah", status: "SUSPENDED", note: "Drones struck fuel tanks. Staff evacuated. Maersk + Inchcape confirm suspended." },
    { country: "Oman", port: "Duqm", status: "OPERATIONAL", note: "Working normally (Inchcape). Previously struck but recovered." },
    { country: "Oman", port: "Mina Al Fahal", status: "RESTRICTED", note: "~1M bbl/day exports. Precautionary vessel evacuation. Omani crude ~$132/bbl." },
    { country: "Saudi", port: "Eastern Province", status: "RESTRICTED", note: "Domestic calls only. 12 drones intercepted Mar 13 incl. Shaybah (1M bbl/day)." },
    { country: "Saudi", port: "Jeddah / Yanbu", status: "OPERATIONAL", note: "Red Sea coast. Accepting diverted bookings." },
    { country: "Qatar", port: "Hamad Port", status: "RESTRICTED", note: "Missile attacks intercepted. Ukrainian anti-drone teams. 4 arrested for IRGC spying." },
    { country: "Bahrain", port: "KBSP", status: "SUSPENDED", note: "Not operating. Fuel tanks targeted Mar 13. Desalination plant damaged." },
    { country: "Kuwait", port: "Shuwaikh/Shuaiba", status: "OPERATIONAL", note: "Security Level 2. 6 electricity lines lost to drone debris. Airport hit again." },
    { country: "Iraq", port: "Basra Oil Terminal", status: "HALTED", note: "ALL oil port ops halted. Safesea Vishnu & Zefyros attacked. 1 killed. Commercial ports working." },
    { country: "Jordan", port: "Aqaba", status: "OPERATIONAL", note: "All ops normal. ISPS Level 1. Jordan stable." },
    { country: "Egypt", port: "Suez Canal", status: "OPERATIONAL", note: "ISPS Level 1. Minimal traffic — carrier self-diversion." },
  ],
  airspace: [
    { country: "Iran (OIIX)", status: "CLOSED", note: "Internet blackout Day 14 (290+ hrs). Drone strikes on IRGC checkpoints in Tehran." },
    { country: "Iraq (ORBB)", status: "CLOSED", note: "Total closure. Iran-backed militia explosions in Erbil." },
    { country: "Bahrain (OBBB)", status: "CLOSED", note: "Fuel tanks targeted. Water desalination plant damaged." },
    { country: "Kuwait (OKAC)", status: "CLOSED", note: "Airport hit AGAIN Mar 13. 6 power lines lost. 2 injured." },
    { country: "Syria (OSTT)", status: "CLOSED", note: "Israel expanding Lebanon operations. 820K+ displaced." },
    { country: "Israel (LLLL)", status: "LIMITED", note: "PPR. Iran-Hezbollah joint op hit 50+ targets." },
    { country: "UAE (OMAE)", status: "LIMITED", note: "ESCAT. Drone near Creek Harbour. DXB operating. Emirates 84 destinations." },
    { country: "Qatar (OTDF)", status: "LIMITED", note: "ESCAT. QA 15 destinations Mar 13. 29 flights authorized." },
    { country: "Saudi (OEJD)", status: "PARTIAL", note: "12 drones intercepted. Shaybah targeted. Dammam intl flights delayed." },
    { country: "Oman (OOMM)", status: "OPERATIONAL", note: "Open. Key corridor. But Salalah/Mina Al Fahal under pressure." },
    { country: "Jordan (OJAC)", status: "PARTIAL", note: "Open with night closure 18:00-09:00." },
  ],
  roads: [
    { route: "UAE Internal", status: "OPERATIONAL", note: "Uninterrupted. Drone near Creek Harbour. Corporate evacuations." },
    { route: "UAE–Oman (Fujairah→Jebel Ali)", status: "OPERATIONAL", note: "CRITICAL — now the LAST MAJOR functioning alternative corridor." },
    { route: "Saudi Arabia–UAE", status: "OPERATIONAL", note: "Borders functioning. Kuwait Airways routing via Jeddah." },
    { route: "Saudi–Jordan", status: "OPERATIONAL", note: "Jordan stable. Aqaba operational." },
    { route: "Kuwait Internal", status: "RESTRICTED", note: "6 power lines lost. Airport hit again. Growing infra risk." },
    { route: "Iraq South", status: "LIMITED", note: "Oil ports HALTED. Commercial ports working. Militia active." },
    { route: "Oman (Sohar–Salalah)", status: "RESTRICTED", note: "SEVERELY DEGRADED. Salalah suspended. Mina Al Fahal evacuation." },
  ],
  carriers: [
    { name: "Maersk", action: "Hormuz & Red Sea suspended. Salalah port halted. EFI active." },
    { name: "MSC", action: "ALL ME bookings suspended. 15 vessels (109K TEU) trapped." },
    { name: "CMA CGM", action: "Sheltering. ECS $2K-$4K. 14 vessels (70K TEU) trapped." },
    { name: "Hapag-Lloyd", action: "WRS $1,500/TEU. Vessel caught fire from shrapnel overnight Mar 12." },
    { name: "ONE", action: "ONE Majesty stern damage. Bookings suspended." },
  ],
};

// ============ STATUS BADGE ============
const ST = {
  CLOSED: { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", dot: "#EF4444" },
  SUSPENDED: { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", dot: "#EF4444" },
  HALTED: { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", dot: "#EF4444" },
  LIMITED: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  RESTRICTED: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  PARTIAL: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  DEGRADING: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", dot: "#F59E0B" },
  OPERATIONAL: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534", dot: "#22C55E" },
};
const Badge = ({ status }) => { const s = ST[status] || ST.CLOSED; return (<span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "'IBM Plex Mono', monospace", background: s.bg, border: `1px solid ${s.border}`, color: s.text }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, boxShadow: `0 0 4px ${s.dot}50` }} />{status}</span>); };

// ============ AUTO-REFRESH PROMPT ============
const REFRESH_PROMPT = `You are a logistics intelligence analyst. Search for the LATEST information about the Middle East conflict's impact on logistics as of today. Search for:
1. Strait of Hormuz shipping status and vessel attacks
2. Gulf port operations (Jebel Ali, Salalah, Basra, Kuwait, Bahrain, Fujairah)
3. Middle East airspace closures and airline updates
4. Oil prices (Brent crude) and energy market developments
5. Road freight and land transport disruptions in GCC
 
Return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{"reportDate":"<today's date>","dayNumber":<conflict day number>,"summary":"<2-3 sentence overall summary of key changes>","hormuzStatus":"<current status>","oilPrice":"<current Brent price>","newDevelopments":["<development 1>","<development 2>","<development 3>","<development 4>","<development 5>"],"portChanges":["<any port status changes>"],"airspaceChanges":["<any airspace changes>"],"vesselCount":"<total vessels attacked>","iaStatus":"<Iraq ports status>","salalahStatus":"<Salalah port status>"}`;

// ============ MAIN DASHBOARD ============
export default function Dashboard() {
  const [data, setData] = useState(INIT);
  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [aiUpdate, setAiUpdate] = useState(null);
  const [lastAiRefresh, setLastAiRefresh] = useState(null);
  const [refreshError, setRefreshError] = useState(null);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [nextRefresh, setNextRefresh] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const doAiRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: REFRESH_PROMPT }],
        }),
      });
      const d = await res.json();
      const textBlocks = d.content?.filter(i => i.type === "text").map(i => i.text).join("\n") || "";
      const clean = textBlocks.replace(/```json|```/g, "").trim();
      try {
        const parsed = JSON.parse(clean);
        setAiUpdate(parsed);
        setLastAiRefresh(new Date());
      } catch {
        setAiUpdate({ summary: textBlocks.slice(0, 500), raw: true });
        setLastAiRefresh(new Date());
      }
    } catch (e) {
      setRefreshError(`Refresh failed: ${e.message}`);
    }
    setRefreshing(false);
  }, []);

  // Auto-refresh every 2 hours
  useEffect(() => {
    if (!autoEnabled) { if (timerRef.current) clearInterval(timerRef.current); return; }
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    setNextRefresh(new Date(Date.now() + TWO_HOURS));
    timerRef.current = setInterval(() => {
      doAiRefresh();
      setNextRefresh(new Date(Date.now() + TWO_HOURS));
    }, TWO_HOURS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoEnabled, doAiRefresh]);

  const tabs = [
    { id: "overview", icon: "◉", label: "Overview" },
    { id: "maritime", icon: "⚓", label: "Ocean & Ports" },
    { id: "air", icon: "✈", label: "Air Freight" },
    { id: "road", icon: "🛣", label: "Road Transport" },
    { id: "carriers", icon: "📦", label: "Carriers" },
  ];

  const countdown = nextRefresh ? Math.max(0, Math.floor((nextRefresh - time) / 60000)) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#1E293B", fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap%27);
        @keyframes pulse{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(2.2);opacity:0}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        .card{background:#FFF;border:1px solid #E2E8F0;border-radius:10px;box-shadow:0 1px 3px rgba(15,23,42,.04);transition:box-shadow .2s,border-color .2s}
        .card:hover{box-shadow:0 4px 12px rgba(15,23,42,.06);border-color:#CBD5E1}
        .tab-btn{padding:8px 16px;border:1px solid #E2E8F0;border-radius:8px;background:#FFF;color:#64748B;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;transition:all .2s;display:flex;align-items:center;gap:5px}
        .tab-btn:hover{color:#334155;background:#F1F5F9;border-color:#CBD5E1}
        .tab-btn.active{background:#0F172A;color:#FFF;border-color:#0F172A;box-shadow:0 2px 8px rgba(15,23,42,.2)}
        .refresh-btn{padding:7px 16px;border:1px solid #E2E8F0;border-radius:8px;background:#FFF;color:#0F172A;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;transition:all .2s;display:flex;align-items:center;gap:6px}
        .refresh-btn:hover{background:#F1F5F9;border-color:#94A3B8}
        .tbl-header{display:grid;padding:10px 14px;background:#F8FAFC;border-bottom:2px solid #E2E8F0;font-size:10px;font-weight:700;letter-spacing:.08em;color:#64748B;text-transform:uppercase;position:sticky;top:0;z-index:2}
        .tbl-row{display:grid;padding:11px 14px;border-bottom:1px solid #F1F5F9;align-items:center;transition:background .15s}
        .tbl-row:hover{background:#F8FAFC}
        .tbl-row:last-child{border-bottom:none}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#F8FAFC}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0", padding: "12px 20px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(15,23,42,.03)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ position: "relative", display: "inline-block", width: 8, height: 8, marginRight: 2 }}>
                <span style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "#DC2626", opacity: .25, animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#DC2626" }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: "#DC2626", textTransform: "uppercase" }}>ACTIVE CONFLICT — DAY {data.dayNumber}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", letterSpacing: ".06em" }}>CRITICAL — ESCALATING</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-.02em", color: "#0F172A" }}>Middle East Logistics Status Report</h1>
            <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 1, fontFamily: "'IBM Plex Mono', monospace" }}>
              {data.reportDate} · Hormuz Closed · Iraq Ports Halted · Salalah Suspended · Oil &gt;$100
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#0F172A", fontSize: 14, fontWeight: 600 }}>{time.toLocaleTimeString("en-US", { hour12: false })} <span style={{ fontSize: 10, color: "#94A3B8" }}>UTC</span></div>
              {lastAiRefresh && <div style={{ fontSize: 10, color: "#16A34A" }}>AI refreshed: {lastAiRefresh.toLocaleTimeString()}</div>}
              {countdown !== null && autoEnabled && <div style={{ fontSize: 10, color: "#64748B" }}>Next auto-refresh: {countdown}m</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button className="refresh-btn" onClick={doAiRefresh} disabled={refreshing}>
                <span style={{ display: "inline-block", fontSize: 14, animation: refreshing ? "spin 1s linear infinite" : "none" }}>↻</span>
                {refreshing ? "AI Searching…" : "AI Refresh Now"}
              </button>
              <button onClick={() => setAutoEnabled(!autoEnabled)} style={{ padding: "3px 10px", border: "1px solid #E2E8F0", borderRadius: 6, background: autoEnabled ? "#F0FDF4" : "#FEF2F2", color: autoEnabled ? "#166534" : "#991B1B", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: "inherit" }}>
                {autoEnabled ? "⏱ Auto-refresh ON (2hr)" : "⏸ Auto-refresh OFF"}
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 12, flexWrap: "wrap" }}>
          {tabs.map(t => (<button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}><span style={{ fontSize: 12 }}>{t.icon}</span> {t.label}</button>))}
        </div>
      </div>

      <div style={{ padding: "16px 20px", maxWidth: 1400, margin: "0 auto" }}>
        {/* AI UPDATE BANNER */}
        {aiUpdate && (
          <div style={{ padding: "12px 16px", marginBottom: 14, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, borderLeft: "4px solid #2563EB", animation: "slideUp .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: "#1E40AF", textTransform: "uppercase" }}>🤖 AI Live Intelligence Update — {lastAiRefresh?.toLocaleTimeString()}</span>
              <button onClick={() => setAiUpdate(null)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <div style={{ fontSize: 12.5, color: "#1E3A5F", lineHeight: 1.65 }}>
              {aiUpdate.raw ? aiUpdate.summary : (<>
                <strong>{aiUpdate.summary || "Searching trusted sources..."}</strong>
                {aiUpdate.newDevelopments?.length > 0 && (
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                    {aiUpdate.newDevelopments.map((d, i) => <li key={i} style={{ marginBottom: 3 }}>{d}</li>)}
                  </ul>
                )}
                {aiUpdate.oilPrice && <div style={{ marginTop: 6 }}><strong>Oil:</strong> {aiUpdate.oilPrice} | <strong>Hormuz:</strong> {aiUpdate.hormuzStatus} | <strong>Vessels attacked:</strong> {aiUpdate.vesselCount}</div>}
              </>)}
            </div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 6 }}>Sources: CNN · NBC · NPR · Al Jazeera · CNBC · Bloomberg · Reuters · GAC · Inchcape · Windward AI · IEA · EASA · UKMTO</div>
          </div>
        )}
        {refreshError && <div style={{ padding: "8px 14px", marginBottom: 14, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, color: "#991B1B" }}>{refreshError}</div>}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 10, marginBottom: 20 }}>
              {data.kpis.map((k, i) => (
                <div key={i} className="card" style={{ padding: "14px 16px", position: "relative", overflow: "hidden", background: k.accent }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: k.color }} />
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".07em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 6, marginTop: 3 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: k.color, marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.1 }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 18, marginBottom: 18 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Situation Summary — Day {data.dayNumber}</h3>
              <div style={{ display: "grid", gap: 8, fontSize: 12.5, lineHeight: 1.6, color: "#334155" }}>
                {data.situationBlocks.map((s, i) => (
                  <div key={i} style={{ padding: "10px 14px", background: s.bg, borderRadius: 8, borderLeft: `4px solid ${s.border}` }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em", color: s.labelColor, textTransform: "uppercase", marginRight: 6 }}>{s.label}:</span>
                    <span style={{ color: "#475569" }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MARITIME TAB */}
        {activeTab === "maritime" && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Vessels Attacked", val: "16+", unit: "since Feb 28 (NYT)", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Seafarers Killed", val: "8", unit: "1 missing", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Hormuz Transit", val: "~0", unit: "only dark/shadow ships", color: "#DC2626", bg: "#FEF2F2" },
                { label: "IEA Supply Loss", val: "8M bbl/d", unit: "largest disruption ever", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Omani Crude", val: "$132/bbl", unit: "well above Brent", color: "#D97706", bg: "#FFFBEB" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 14, textAlign: "center", background: s.bg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".07em", color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{s.unit}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="tbl-header" style={{ gridTemplateColumns: "80px 155px 105px 1fr" }}><span>Country</span><span>Port</span><span>Status</span><span>Notes</span></div>
              <div style={{ maxHeight: 520, overflow: "auto" }}>
                {data.ports.map((p, i) => (
                  <div key={i} className="tbl-row" style={{ gridTemplateColumns: "80px 155px 105px 1fr", fontSize: 12, background: ["SUSPENDED", "HALTED"].includes(p.status) ? "#FEF2F2" : undefined }}>
                    <span style={{ fontWeight: 600, color: "#64748B" }}>{p.country}</span>
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>{p.port}</span>
                    <span><Badge status={p.status} /></span>
                    <span style={{ color: "#64748B", lineHeight: 1.5 }}>{p.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AIR TAB */}
        {activeTab === "air" && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="tbl-header" style={{ gridTemplateColumns: "160px 105px 1fr" }}><span>Country / FIR</span><span>Airspace</span><span>Details</span></div>
              <div style={{ maxHeight: 420, overflow: "auto" }}>
                {data.airspace.map((a, i) => (
                  <div key={i} className="tbl-row" style={{ gridTemplateColumns: "160px 105px 1fr", fontSize: 12 }}>
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>{a.country}</span>
                    <span><Badge status={a.status} /></span>
                    <span style={{ color: "#64748B", lineHeight: 1.5 }}>{a.note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, borderLeft: "4px solid #D97706", fontSize: 12.5, color: "#78350F", lineHeight: 1.6 }}>
              <strong>Qatar Airways Mar 13:</strong> 15 destinations — Cairo, Casablanca, Johannesburg, São Paulo, New York, Frankfurt, Madrid, London, Beijing, Mumbai, Delhi, Islamabad, Colombo, Jakarta, Manila. Scheduled ops still suspended. Bookings Feb 28–Mar 22 eligible for 2 free changes or refund.
            </div>
          </div>
        )}

        {/* ROAD TAB */}
        {activeTab === "road" && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <div style={{ padding: "12px 16px", marginBottom: 14, background: "#FFFBEB", borderLeft: "4px solid #D97706", border: "1px solid #FDE68A", borderRadius: 10, fontSize: 12.5, color: "#92400E", lineHeight: 1.6 }}>
              <strong>Road freight is degrading.</strong> Fujairah/Khor Fakkan → Jebel Ali is now the LAST MAJOR functioning alternative corridor. Kuwait infrastructure under pressure (6 power lines lost). Oman corridor severely compromised (Salalah suspended, Mina Al Fahal evacuation).
            </div>
            <div className="card">
              <div className="tbl-header" style={{ gridTemplateColumns: "210px 105px 1fr" }}><span>Route</span><span>Status</span><span>Details</span></div>
              {data.roads.map((r, i) => (
                <div key={i} className="tbl-row" style={{ gridTemplateColumns: "210px 105px 1fr", fontSize: 12 }}>
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>{r.route}</span>
                  <span><Badge status={r.status} /></span>
                  <span style={{ color: "#64748B", lineHeight: 1.5 }}>{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARRIERS TAB */}
        {activeTab === "carriers" && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Vessels Trapped", val: "~140", sub: "in Persian Gulf", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Fleet Impacted", val: "10.7%", sub: "of global capacity", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Transit Add", val: "+10–15d", sub: "Cape of Good Hope", color: "#D97706", bg: "#FFFBEB" },
                { label: "SH→Jebel Ali", val: ">$4K/FEU", sub: "was $1,800 pre-war", color: "#DC2626", bg: "#FEF2F2" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: 12, textAlign: "center", background: s.bg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".07em", color: "#64748B", textTransform: "uppercase", marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="tbl-header" style={{ gridTemplateColumns: "110px 1fr" }}><span>Carrier</span><span>Actions & Status</span></div>
              {data.carriers.map((c, i) => (
                <div key={i} className="tbl-row" style={{ gridTemplateColumns: "110px 1fr", fontSize: 12 }}>
                  <span style={{ color: "#0F172A", fontWeight: 700 }}>{c.name}</span>
                  <span style={{ color: "#475569", lineHeight: 1.6 }}>{c.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: 28, padding: "12px 0", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, fontSize: 10, color: "#94A3B8" }}>
          <span>Sources: CNN · NBC · NPR · Al Jazeera · CNBC · Bloomberg · Argus · The National · GAC · Inchcape · Windward AI · UKMTO · IEA · EIA · EASA · NYT · Qatar Airways · Kpler</span>
          <span>Auto-refresh: {autoEnabled ? "ON (2hr)" : "OFF"} · Updated {data.reportDate} · Ask Claude for manual refresh</span>
        </div>
      </div>
    </div>
  );
}