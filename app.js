const express = require("express");
const app = express();

// Kör appen internt på 3000 (Nginx tar 80)
const PORT = process.env.PORT || 3000;

// Helper för att safely visa text i HTML
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

app.get("/", (req, res) => {
  const now = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

  const details = {
    server: {
      os: "Ubuntu 24.04 (VPS)",
      publicIp: req.headers["x-forwarded-for"]
        ? String(req.headers["x-forwarded-for"]).split(",")[0].trim()
        : req.socket.remoteAddress,
    },
    app: {
      stack: "Node.js + Express",
      internalPort: "3000",
      publicPort: "80 (via Nginx reverse proxy)",
      processManager: "PM2 / Node Process",
    },
    security: [
      "UFW-brandvägg: endast nödvändiga portar öppna (22/80).",
      "Reverse Proxy: Döljer intern app-struktur.",
      "Separat användare: deploy (principen om minsta privilegium).",
      "SSH-härdning: Inloggning via SSH-nycklar rekommenderas.",
    ],
    deploy: [
      "Kod hämtas från GitHub.",
      "deploy.sh: Automatiserar uppdatering och omstart.",
      "Nginx proxy_pass → 127.0.0.1:3000",
    ],
  };

  const team = [
    {
      name: "Akam",
      role: "Sysadmin / DevOps",
      bio: "Ansvarig för server-setup, brandvägg och reverse proxy.",
    },
    {
      name: "Nginx",
      role: "Reverse Proxy",
      bio: "Hanterar inkommande trafik på port 80.",
    },
    {
      name: "Node.js",
      role: "Runtime",
      bio: "Kör applikationslogiken på port 3000.",
    },
  ];

  res
    .status(200)
    .type("html")
    .send(`<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Welcome — Hello World via Reverse Proxy</title>
  <style>
    :root{
      --bg:#0b1020; --card:#121a33; --muted:#93a4c7; --text:#e8eeff;
      --accent:#7c5cff; --accent2:#2be7ff; --border:rgba(255,255,255,.08);
      --shadow: 0 20px 50px rgba(0,0,0,.35); --radius: 18px;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --sans: ui-sans-serif, system-ui, sans-serif;
    }
    *{box-sizing:border-box}
    body{
      margin:0; font-family:var(--sans); color:var(--text);
      background:
        radial-gradient(1200px 800px at 20% 10%, rgba(124,92,255,.35), transparent 60%),
        radial-gradient(900px 700px at 80% 30%, rgba(43,231,255,.22), transparent 55%),
        var(--bg);
      min-height:100vh;
    }
    .wrap{max-width:1080px; margin:0 auto; padding:34px 18px 60px; opacity:0; transform:translateY(10px); transition:all 0.6s ease}
    .wrap.visible{opacity:1; transform:translateY(0)}
    .badge{display:inline-flex; gap:10px; align-items:center; padding:10px 14px; border:1px solid var(--border); border-radius:999px; background:rgba(255,255,255,.04); backdrop-filter:blur(8px); font-size:14px; color:var(--muted)}
    .dot{width:10px; height:10px; border-radius:50%; background:radial-gradient(circle at 30% 30%, #fff, var(--accent)); box-shadow:0 0 0 4px rgba(124,92,255,.15)}
    header{margin-top:18px}
    h1{margin:14px 0 10px; font-size:clamp(32px, 4.2vw, 56px); letter-spacing:-.02em; line-height:1.05}
    .sub{margin:0; font-size:clamp(16px, 1.6vw, 20px); color:var(--muted); max-width:70ch}
    .grid{margin-top:26px; display:grid; grid-template-columns:1.25fr .75fr; gap:16px}
    @media (max-width:900px){.grid{grid-template-columns:1fr}}
    .card{background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03)); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden}
    .card .inner{padding:18px}
    .kpis{display:grid; grid-template-columns:repeat(3, 1fr); gap:12px}
    @media (max-width:600px){.kpis{grid-template-columns:1fr}}
    .kpi{padding:14px; border:1px solid var(--border); border-radius:14px; background:rgba(0,0,0,.18)}
    .kpi .label{font-size:12px; color:var(--muted); margin-bottom:6px}
    .kpi .value{font-family:var(--mono); font-size:13px}
    .sectionTitle{margin:0 0 12px; font-size:18px; display:flex; align-items:center; gap:10px}
    .pill{font-family:var(--mono); font-size:12px; padding:4px 8px; border-radius:999px; border:1px solid var(--border); background:rgba(255,255,255,.04); color:var(--muted)}
    .list{margin:0; padding-left:18px; color:var(--muted); line-height:1.7}
    .person{display:flex; gap:12px; align-items:flex-start; padding:14px; border:1px solid var(--border); border-radius:14px; background:rgba(0,0,0,.18); margin-bottom:12px}
    .avatar{width:42px; height:42px; border-radius:14px; background:linear-gradient(135deg, var(--accent), var(--accent2)); flex:0 0 auto}
    .code{font-family:var(--mono); font-size:12px; color:#cfe0ff; background:rgba(0,0,0,.25); border:1px solid var(--border); border-radius:14px; padding:12px; overflow:auto}
    .hl{color:var(--text)}

    /* Garage door intro */
    .door{position:fixed; inset:0; z-index:9999; background:#0a0e1c; display:grid; place-items:center}
    .door__panel{position:absolute; inset:0; background:repeating-linear-gradient(180deg, rgba(255,255,255,.05) 0px, rgba(255,255,255,.05) 2px, transparent 18px, transparent 24px); animation:doorOpen 1.1s cubic-bezier(.2,.9,.2,1) forwards}
    @keyframes doorOpen{0%{transform:translateY(0)} 100%{transform:translateY(-100%)}}
  </style>
</head>
<body>
  <div class="door" id="door">
    <div class="door__panel"></div>
    <div style="position:relative; z-index:2; color:white; font-size:14px; border:1px solid rgba(255,255,255,0.1); padding:10px 20px; border-radius:30px; background:rgba(0,0,0,0.5)">Ansluter till servern...</div>
  </div>

  <div class="wrap" id="mainWrap">
    <div class="badge"><span class="dot"></span> Live • <span id="clock">${esc(now)}</span></div>

    <header>
      <h1>Hello World via Nginx 👋</h1>
      <p class="sub">Applikationen körs internt på port 3000 och nås externt via en reverse proxy på port 80.</p>
    </header>

    <div class="grid">
      <section class="card">
        <div class="inner">
          <h2 class="sectionTitle">Serverstatus <span class="pill">Active</span></h2>
          <div class="kpis">
            <div class="kpi"><div class="label">Operativsystem</div><div class="value">${esc(details.server.os)}</div></div>
            <div class="kpi"><div class="label">Intern Port</div><div class="value">${esc(details.app.internalPort)}</div></div>
            <div class="kpi"><div class="label">Proxy</div><div class="value">Nginx</div></div>
          </div>
          <h2 class="sectionTitle" style="margin-top:20px">Säkerhet & Deploy</h2>
          <ul class="list">
            ${details.security.map(s => `<li>${esc(s)}</li>`).join("")}
          </ul>
        </div>
      </section>

      <aside class="card">
        <div class="inner">
          <h2 class="sectionTitle">Team</h2>
          ${team.map(p => `
            <div class="person">
              <div class="avatar"></div>
              <div>
                <h3 style="margin:0">${esc(p.name)}</h3>
                <div style="font-size:12px; color:var(--muted)">${esc(p.role)}</div>
              </div>
            </div>
          `).join("")}
          <div class="code">
            IP: ${esc(details.server.publicIp)}<br>
            Status: 200 OK
          </div>
        </div>
      </aside>
    </div>
  </div>

  <script>
    // Klock-logik (Client-side)
    function updateClock() {
      const el = document.getElementById("clock");
      if (el) {
        el.textContent = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });
      }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Intro-animation
    window.addEventListener("load", () => {
      setTimeout(() => {
        document.getElementById("door").style.display = "none";
        document.getElementById("mainWrap").classList.add("visible");
      }, 1100);
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Webbservern är igång på port ${PORT}`);
});