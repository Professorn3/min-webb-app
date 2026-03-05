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

Uppgift 2: Teorifrågor
Linux

    Filsystem: En trädstruktur som utgår från roten /.

    Viktiga mappar: /etc (konfiguration), /home (användardata), /var/log (loggfiler).

    Behörighet: Hanteras via rwx (read, write, execute) för ägare, grupp och övriga via kommandot chmod.

Windows Server

    Filsystem: Använder främst NTFS för säkerhet och stora volymer.

    Viktiga mappar: C:\Windows, C:\Users, C:\Program Files.

    Behörighet: Detaljerad hantering via Access Control Lists (ACL) för användare och grupper.

Nätverk

    IP-adress: En logisk adress (t.ex. 167.86.126.224) för att identifiera enheter på nätverk.

    MAC-adress: En unik fysisk adress bunden till nätverkskortet.

    DNS: Översätter domännamn till IP-adresser, fungerar som internetets telefonbok.

Virtualisering

    Syfte: Att köra flera isolerade virtuella maskiner på en fysisk server för att spara resurser och isolera tjänster.

    Funktion: En hypervisor delar upp hårdvarans resurser mellan de olika miljöerna.

Skripting

    Används för att automatisera administration och säkerhetsarbete. Det minskar risken för mänskliga fel och säkerställer att konfigurationer är konsekventa.

Säkerhet

    Vid serveruppsättning krävs en kombination av brandväggar, minsta behörighet, regelbundna uppdateringar och krypterad kommunikation för att säkerställa hög säkerhet.
