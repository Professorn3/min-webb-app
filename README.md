Dokumentation
Server-IP: 167.86.126.224

Detta projekt omfattar uppsättningen av en säker webbmiljö på en Linux-server (Ubuntu 24.04) för att hosta en Node.js-applikation. Systemet använder Nginx som reverse proxy och automatiserad deployment via Bash-skript.
Uppgift 1: Praktiskt genomförande
Server & Säkerhet

Servern körs på en VPS hos Contabo. För att säkra systemet har root-inloggning inaktiverats i /etc/ssh/sshd_config (PermitRootLogin no). Fail2ban är installerat för att automatiskt blockera IP-adresser vid misslyckade inloggningsförsök. En begränsad användare vid namn deploy hanterar driften för att följa principen om minsta behörighet.
Brandvägg (UFW)

Brandväggen är aktiv och tillåter endast nödvändig trafik:

    sudo ufw allow 22/tcp (SSH)

    sudo ufw allow 80/tcp (HTTP)

    sudo ufw enable

Nginx Reverse Proxy

Nginx lyssnar på port 80 och skickar trafiken vidare till applikationen som körs lokalt på port 3000. Detta skyddar Node.js-processen från direkt exponering.
Konfigurationslogik: proxy_pass http://127.0.0.1:3000.
Deploy-skript (deploy.sh)

Ett automatiserat skript sköter hela flödet vid uppdatering:

    Navigerar till projektmappen.

    Hämtar senaste koden från GitHub (git pull).

    Installerar beroenden (npm install).

    Startar om applikationen via PM2 (pm2 restart all).

Linux: Arkitektur & Administration

Filsystem: Hierarkisk trädstruktur utgående från / (root). Viktiga kataloger: /etc (systemkonfiguration), /var/log (händelseloggning), /home (användardata) och /bin (binärfiler).
Rättighetsmodell: Granulär kontroll via read, write, execute (rwx) för användare, grupp och övriga. sudo används för temporär eskalering till root-privilegier för administrativa uppgifter.

Länkning: Symboliska länkar fungerar som sökvägspekare (genvägar), medan hårda länkar pekar direkt på filens fysiska datablock (inode).

Montering: Processen att logiskt integrera externa filsystem eller lagringsenheter i systemets befintliga katalogträd.

Windows Server: Ekosystem & Kontroll

Struktur: Utnyttjar NTFS-filsystemet för metadata och transaktionsstöd. Centrala mappar: C:\Windows (OS), C:\Users (profiler) och C:\Program Files (applikationer).

ACL (Access Control Lists): Möjliggör detaljerad behörighetsstyrning för specifika säkerhetsobjekt, ofta med arv från överliggande kataloger.

Övervakning: Resursutnyttjande analyseras via Task Manager (realtid) och Event Viewer (historisk loggdata).

Nätverksteknik: OSI-lager & Protokoll

Adressering: IP-adress (Lager 3) är en logisk identifierare för routing. MAC-adress (Lager 2) är en unik fysisk hårdvaruadress för lokal kommunikation.

Subnätmask: Definierar gränsen mellan nätverks- och värddel i en IP-adress för att avgränsa lokala subnät.

DNS: Distribuerat system som mappar domännamn (FQDN) till IP-adresser.

Switch vs Router: Switchen sammanlänkar enheter inom ett LAN via MAC-adresser; routern dirigerar trafik mellan skilda nätverk via IP-adresser.

Virtualisering, Skripting & Säkerhet

Virtualisering: Abstraktion av hårdvara via en hypervisor för att exekvera multipla isolerade gäst-OS på en fysisk värd.

Automation: Skripting (Bash/PowerShell) eliminerar manuella fel, säkerställer reproducerbarhet och effektiviserar konfigurationshantering.

Säkerhetsstrategi: Implementering av Defense in Depth genom brandväggar, minsta behörighets-principen (PoLP) och proaktiv patchhantering.

Säkerhet

Vid serveruppsättning krävs en kombination av brandväggar, minsta behörighet, regelbundna uppdateringar och krypterad kommunikation för att säkerställa hög säkerhet.
