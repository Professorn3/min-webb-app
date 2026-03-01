const express = require("express");
const app = express();

// Kör appen internt på 3000 (Nginx tar 80)
const PORT = process.env.PORT || 3000;

// Liten helper för att safely visa text i HTML (om du vill fylla på senare)
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

app.get("/", (req, res) => {
  const now = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

  // Justera detaljerna nedan så de matchar exakt din setup/rapport
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
      processManager: "PM2 (autostart via systemd)",
    },
    security: [
      "UFW-brandvägg: endast nödvändiga portar öppna (22/80).",
      "Fail2ban: skyddar SSH mot brute force.",
      "Separat användare: deploy (principen om minsta privilegium).",
      "SSH-härdning: PermitRootLogin no (root-login avstängd via SSH).",
      "Deploy-script körs ej som root (skydd i scriptet).",
    ],
    deploy: [
      "Kod hämtas från GitHub (publikt repo).",
      "deploy.sh: klonar/uppdaterar repo → npm install → start via PM2.",
      "Nginx proxy_pass → 127.0.0.1:3000",
    ],
  };

  const team = [
    {
      name: "Akam",
      role: "Sysadmin / DevOps",
      bio: "Satte upp servern, brandvägg, reverse proxy och automatiserad deploy.",
    },
    {
      name: "Reverse Proxy (Nginx)",
      role: "Traffic Manager",
      bio: "Tar emot HTTP på port 80 och skickar vidare till appen på 3000.",
    },
    {
      name: "PM2",
      role: "Process Manager",
      bio: "Håller Node-appen igång och startar den automatiskt efter reboot.",
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
      --bg:#0b1020;
      --card:#121a33;
      --muted:#93a4c7;
      --text:#e8eeff;
      --accent:#7c5cff;
      --accent2:#2be7ff;
      --border:rgba(255,255,255,.08);
      --shadow: 0 20px 50px rgba(0,0,0,.35);
      --radius: 18px;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    }
    *{box-sizing:border-box}
    body{
      margin:0; font-family:var(--sans); color:var(--text);
      background:
        radial-gradient(1200px 800px at 20% 10%, rgba(124,92,255,.35), transparent 60%),
        radial-gradient(900px 700px at 80% 30%, rgba(43,231,255,.22), transparent 55%),
        radial-gradient(1000px 800px at 50% 90%, rgba(124,92,255,.18), transparent 55%),
        var(--bg);
      min-height:100vh;
    }
    a{color:inherit}
    .wrap{max-width:1080px; margin:0 auto; padding:34px 18px 60px}
    .badge{
      display:inline-flex; gap:10px; align-items:center;
      padding:10px 14px; border:1px solid var(--border);
      border-radius:999px; background:rgba(255,255,255,.04);
      backdrop-filter: blur(8px);
      box-shadow: 0 10px 30px rgba(0,0,0,.22);
      font-size:14px; color:var(--muted);
    }
    .dot{
      width:10px; height:10px; border-radius:50%;
      background: radial-gradient(circle at 30% 30%, #fff, var(--accent));
      box-shadow: 0 0 0 4px rgba(124,92,255,.15);
    }
    header{margin-top:18px}
    h1{
      margin:14px 0 10px;
      font-size: clamp(32px, 4.2vw, 56px);
      letter-spacing:-.02em;
      line-height:1.05;
    }
    .sub{
      margin:0;
      font-size: clamp(16px, 1.6vw, 20px);
      color:var(--muted);
      max-width: 70ch;
    }
    .grid{
      margin-top:26px;
      display:grid;
      grid-template-columns: 1.25fr .75fr;
      gap:16px;
    }
    @media (max-width: 900px){
      .grid{grid-template-columns:1fr}
    }
    .card{
      background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow:hidden;
    }
    .card .inner{padding:18px}
    .kpis{display:grid; grid-template-columns: repeat(3, 1fr); gap:12px}
    @media (max-width: 600px){ .kpis{grid-template-columns:1fr} }
    .kpi{
      padding:14px; border:1px solid var(--border); border-radius:14px;
      background: rgba(0,0,0,.18);
    }
    .kpi .label{font-size:12px; color:var(--muted); margin-bottom:6px}
    .kpi .value{font-family:var(--mono); font-size:13px}
    .sectionTitle{
      margin:0 0 12px;
      font-size:18px; letter-spacing:-.01em;
      display:flex; align-items:center; gap:10px;
    }
    .pill{
      font-family:var(--mono);
      font-size:12px; padding:6px 10px;
      border-radius:999px; border:1px solid var(--border);
      background: rgba(255,255,255,.04);
      color: var(--muted);
    }
    .list{margin:0; padding-left:18px; color:var(--muted); line-height:1.7}
    .team{
      display:grid; grid-template-columns:1fr; gap:12px;
    }
    .person{
      display:flex; gap:12px; align-items:flex-start;
      padding:14px; border:1px solid var(--border);
      border-radius:14px; background: rgba(0,0,0,.18);
    }
    .avatar{
      width:42px; height:42px; border-radius:14px;
      background: linear-gradient(135deg, rgba(124,92,255,.9), rgba(43,231,255,.65));
      box-shadow: 0 0 0 4px rgba(255,255,255,.06);
      flex:0 0 auto;
    }
    .person h3{margin:0; font-size:15px}
    .person .role{margin:2px 0 6px; font-size:12px; color:var(--muted)}
    .person .bio{margin:0; font-size:13px; color:var(--muted); line-height:1.55}
    footer{
      margin-top:18px; color:var(--muted); font-size:12px;
      display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;
    }
    .code{
      font-family: var(--mono);
      font-size: 12px;
      color: #cfe0ff;
      background: rgba(0,0,0,.25);
      border:1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      overflow:auto;
      line-height:1.6;
    }
    .hl{color: var(--text)}
    .spark{
      display:inline-block; width:12px; height:12px; margin-left:6px;
      background: radial-gradient(circle at 30% 30%, #fff, var(--accent2));
      border-radius: 4px;
      transform: rotate(20deg);
    }

    /* --- Garage door intro --- */
    .wrap {
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.6s ease;
    }
    .wrap.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .door {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: linear-gradient(180deg, rgba(10,14,28,1), rgba(7,10,20,1));
      overflow: hidden;
      display: grid;
      place-items: center;
    }

    .door__panel {
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          180deg,
          rgba(255,255,255,.10) 0px,
          rgba(255,255,255,.10) 2px,
          rgba(0,0,0,.18) 18px,
          rgba(0,0,0,.18) 24px
        ),
        radial-gradient(900px 600px at 50% 20%, rgba(124,92,255,.25), transparent 60%),
        radial-gradient(900px 600px at 50% 80%, rgba(43,231,255,.18), transparent 60%);
      transform-origin: top;
      animation: doorOpen 1.1s cubic-bezier(.2,.9,.2,1) forwards;
    }

    .door__label {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 16px 18px;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      backdrop-filter: blur(10px);
      box-shadow: 0 18px 50px rgba(0,0,0,.35);
      color: rgba(232,238,255,.92);
      font-size: 14px;
      letter-spacing: .02em;
    }
    .door__label b { color: #e8eeff; }

    @keyframes doorOpen {
      0%   { transform: translateY(0) scaleY(1); }
      100% { transform: translateY(-100%) scaleY(1); }
    }
  </style>
</head>
<body>
  <!-- Garageport overlay -->
  <div class="door" aria-hidden="true">
    <div class="door__panel"></div>
    <div class="door__label">Öppnar… <b>Hello World</b> via <b>Nginx</b> 🚪</div>
  </div>

  <div class="wrap">
    <div class="badge"><span class="dot"></span> Live • ${esc(now)} • Reverse proxy: <span class="hl">Nginx</span> <span class="spark"></span></div>

    <header>
      <h1>Välkommen till min Hello World 👋</h1>
      <p class="sub">
        Den här sidan körs på en Linux-server och exponeras via <b>reverse proxy (Nginx)</b>.
        Koden hämtas från GitHub och deployas automatiskt med ett script och <b>PM2</b>.
      </p>
    </header>

    <div class="grid">
      <section class="card">
        <div class="inner">
          <h2 class="sectionTitle">Miljö & Setup <span class="pill">overview</span></h2>

          <div class="kpis">
            <div class="kpi">
              <div class="label">OS / Server</div>
              <div class="value">${esc(details.server.os)}</div>
            </div>
            <div class="kpi">
              <div class="label">Publik trafik</div>
              <div class="value">HTTP :80 → Nginx → 127.0.0.1:${esc(details.app.internalPort)}</div>
            </div>
            <div class="kpi">
              <div class="label">Process</div>
              <div class="value">${esc(details.app.processManager)}</div>
            </div>
          </div>

          <div style="height:14px"></div>

          <h2 class="sectionTitle">Deploy-flöde <span class="pill">GitHub → Server</span></h2>
          <ul class="list">
            ${details.deploy.map((x) => `<li>${esc(x)}</li>`).join("")}
          </ul>

          <div style="height:14px"></div>

          <h2 class="sectionTitle">Säkerhet <span class="pill">hardening</span></h2>
          <ul class="list">
            ${details.security.map((x) => `<li>${esc(x)}</li>`).join("")}
          </ul>

          <div style="height:14px"></div>

          <div class="code">
<span class="hl">Nginx (idé):</span>
server {
  listen 80;
  server_name _;
  location / {
    proxy_pass http://127.0.0.1:3000;
  }
}

<span class="hl">deploy.sh (idé):</span>
- klona/uppdatera repo
- npm install
- pm2 start app.js --name min-webb-app
- pm2 save
          </div>
        </div>
      </section>

      <aside class="card">
        <div class="inner">
          <h2 class="sectionTitle">Team <span class="pill">who runs this?</span></h2>

          <div class="team">
            ${team
              .map(
                (p) => `
              <div class="person">
                <div class="avatar" aria-hidden="true"></div>
                <div>
                  <h3>${esc(p.name)}</h3>
                  <div class="role">${esc(p.role)}</div>
                  <p class="bio">${esc(p.bio)}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <div style="height:14px"></div>

          <h2 class="sectionTitle">Serverinfo <span class="pill">debug</span></h2>
          <div class="code">
x-forwarded-for: ${esc(req.headers["x-forwarded-for"] || "—")}
remote-address:  ${esc(req.socket.remoteAddress || "—")}
user-agent:      ${esc(req.headers["user-agent"] || "—")}
          </div>

          <footer>
            <span>Repo: professorn3/min-webb-app</span>
            <span>Port: 3000 (intern)</span>
          </footer>
        </div>
      </aside>
    </div>
  </div>

  <script>
    window.addEventListener("load", () => {
      const door = document.querySelector(".door");
      const wrap = document.querySelector(".wrap");
      if (!wrap) return;

      // Om du vill: visa animation bara en gång per session
      // (avkommentera detta block)
      /*
      if (sessionStorage.getItem("introSeen") === "1") {
        if (door) door.remove();
        wrap.classList.add("visible");
        return;
      }
      sessionStorage.setItem("introSeen", "1");
      */

      if (!door) {
        wrap.classList.add("visible");
        return;
      }

      const totalMs = 1100; // matchar doorOpen 1.1s
      setTimeout(() => {
        door.style.transition = "opacity 0.35s ease";
        door.style.opacity = "0";

        setTimeout(() => {
          door.remove();
          wrap.classList.add("visible");
        }, 350);
      }, totalMs);
    });
  </script>
</body>
</html>`);
});

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Webbservern är igång på port ${PORT}`);
});