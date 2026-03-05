### http://167.86.126.224/

Here's the full thing with all code blocks included:
Individuell Inlämningsuppgift – OS Windows & Linux (20 yhp)

Namn: Akam | Datum: 5 mars 2026 | Server-IP: 167.86.126.224
Uppgift 1: Sätt upp webbserver
Serverinstallation och säkring

Jag installerade Ubuntu 24.04 LTS på en VPS hos Contabo. Root-inloggning via SSH inaktiverades (PermitRootLogin no i /etc/ssh/sshd_config), en dedikerad användare deploy skapades enligt principen om minsta privilegium (PoLP), och Fail2ban installerades för att blockera IP-adresser vid upprepade misslyckade inloggningsförsök.
Brandvägg (UFW)

Enbart nödvändiga portar är öppna – port 22 för SSH och port 80 för HTTP. Allt annat är blockerat.
bash

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw enable

Nginx – Reverse Proxy

Applikationen körs internt på port 3000. Nginx tar emot publik trafik på port 80 och vidarebefordrar den till applikationen via loopback, vilket döljer den interna porten från internet.
nginx

server {
    listen 80;
    server_name 167.86.126.224;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}

Deploy-skript (deploy.sh)

Skriptet automatiserar hela deploymentflödet: hämtar senaste koden från GitHub, installerar beroenden och startar om appen via PM2. PM2 säkerställer att appen startar automatiskt vid omstart av servern.
bash

#!/bin/bash
cd /home/deploy/min-webb-app
git pull origin main
npm install
pm2 restart all || pm2 start app.js --name "min-app"

Felsökning

Under projektet ockuperade en Docker-container (Webtop/Selkies) port 3000. Processen identifierades med sudo lsof -i :3000, containern stoppades och applikationen kunde därefter starta korrekt.
Uppgift 2: Teorifrågor
Linux – Filsystem

Linux använder en hierarkisk trädstruktur utgående från / (root). Viktiga kataloger: /etc (systemkonfiguration), /home (användardata), /var/log (loggar), /bin (körbara filer).
Linux – Behörigheter och sudo

Behörigheter definieras av read (r), write (w) och execute (x) för tre kategorier: ägare, grupp och övriga. Ändras med chmod. Kommandot sudo tillåter temporär eskalering till root-privilegier utan att användaren permanent ges full systemkontroll.
bash

chmod 755 fil.sh          # ägare: rwx, grupp/övriga: r-x
sudo systemctl restart nginx   # kör kommando som root

Linux – Symboliska och hårda länkar

En symbolisk länk (symlink) pekar på en annan fils sökväg och slutar fungera om originalfilen tas bort. En hård länk pekar direkt på filens datablock (inode), vilket innebär att datan överlever även om originalfilnamnet raderas.
bash

ln -s /etc/nginx/sites-available/min-app /etc/nginx/sites-enabled/  # symlink
ln fil.txt hardlink.txt                                               # hård länk

Linux – Montering (Mounting)

Montering innebär att ett externt filsystem, exempelvis en hårddisk eller USB-minne, integreras i katalogträdet vid en specifik monteringspunkt. I Linux dyker enheter upp som kataloger, till skillnad från Windows där de tilldelas enhetsbokstäver.
bash

mount /dev/sdb1 /mnt/usb   # montera enhet
umount /mnt/usb            # avmontera

Windows Server – Filsystem

Windows Server använder primärt NTFS, som stöder stora volymer, metadata och transaktionsloggning. Viktiga kataloger: C:\Windows (OS), C:\Users (profiler), C:\Program Files (program), C:\Windows\System32 (systembibliotek).
Windows Server – Behörigheter

Behörigheter styrs via Access Control Lists (ACL) där varje fil och mapp har en lista som specificerar vilka användare eller grupper som har vilka rättigheter. Rättigheter kan ärvas från överliggande mappar eller sättas unikt per objekt, och hanteras centralt via Active Directory i domänmiljöer.
Windows Server – Resursövervakning

Task Manager ger realtidsöversikt av CPU, RAM och disk per process. Resource Monitor erbjuder djupare nätverks- och minnesanalys. Event Viewer används för granskning av säkerhets- och systemloggar, och Performance Monitor möjliggör historisk analys av systemprestanda.
powershell

Get-Process | Sort-Object CPU -Descending   # processer sorterade på CPU-användning
Get-EventLog -LogName Security -Newest 20  # senaste 20 säkerhetshändelser
```

### Nätverk – IP-adress

En IP-adress är en logisk identifierare för ett nätverksgränssnitt som används för att dirigera trafik till rätt destination (OSI-lager 3). Till skillnad från MAC-adressen är den konfigurerbar och kan ändras.

### Nätverk – MAC-adress

En MAC-adress är en unik fysisk hårdvaruidentifierare inbränd i nätverkskortet vid tillverkning. Den används för kommunikation inom lokala nätverk (OSI-lager 2) och kan inte självständigt dirigera trafik mellan olika nätverk.

### Nätverk – Subnätmask

En subnätmask delar upp en IP-adress i en nätverksdel och en värddel, och definierar vilka adresser som tillhör det lokala subnätet. Exempelvis innebär 255.255.255.0 att de tre första oktetterna identifierar nätverket och den sista identifierar värden.
```
IP:          167.86.126.224
Subnätmask:  255.255.255.0
Nätverk:     167.86.126.0
Värdar:      167.86.126.1 – 167.86.126.254

Nätverk – DNS

DNS (Domain Name System) översätter domännamn till IP-adresser via en global hierarki av namnservrar. Utan DNS skulle användare behöva memorera IP-adresser för varje tjänst.
bash

nslookup google.com    # visar vilken IP ett domännamn pekar på

Nätverk – Router vs Switch

En switch sammankopplar enheter inom ett LAN baserat på MAC-adresser (lager 2). En router dirigerar trafik mellan olika nätverk baserat på IP-adresser (lager 3) och är den enhet som förbinder det lokala nätverket med internet.
Virtualisering

Virtualisering abstraherar fysisk hårdvara via en hypervisor (t.ex. Proxmox eller VMware) för att köra flera isolerade virtuella maskiner på en fysisk värd. Syftet är att maximera resursutnyttjandet, sänka hårdvarukostnader och förenkla skalbarhet.
Skripting

Bash- och PowerShell-skript automatiserar repetitiva uppgifter inom systemadministration, säkerhetsarbete och konfigurationshantering. Det eliminerar mänskliga fel och säkerställer att servrar konfigureras konsekvent. I det här projektet hanterar deploy.sh hela deploymentprocessen automatiskt.
Säkerhet vid serveruppsättning

Hög säkerhet kräver flera samverkande lager: brandvägg med enbart nödvändiga portar öppna, inaktiverad root-login via SSH, brute force-skydd med Fail2ban, regelbundna säkerhetsuppdateringar, reverse proxy för att dölja interna portar och tillämpning av Principle of Least Privilege för alla användare och processer. Tillsammans skapar detta ett Defense in Depth-skydd där inget enskilt misslyckat skikt komprometterar hela systemet.
bash

sudo apt update && sudo apt upgrade -y   # håll systemet uppdaterat
sudo fail2ban-client status sshd         # kontrollera blockerade IP-adresser
