### http://167.86.126.224/


Uppgift 1

Serverinstallation och säkring
Ubuntu 24.04 LTS installerades på en VPS hos Contabo. För att förbättra säkerheten inaktiverades root-inloggning via SSH genom inställningen PermitRootLogin no i /etc/ssh/sshd_config. I stället skapades en separat användare, deploy, enligt principen om minsta privilegium (PoLP), vilket minskar risken för systemkompromettering. För att skydda mot brute-force-attacker installerades även Fail2ban, som automatiskt blockerar IP-adresser efter upprepade misslyckade inloggningsförsök.

Brandvägg (UFW)
Serverns nätverkstrafik begränsades med hjälp av Uncomplicated Firewall (UFW). Endast nödvändiga portar öppnades: port 22 för SSH och port 80 för HTTP. All övrig trafik blockeras som standard, vilket minskar attackytan och säkerställer att endast relevanta tjänster är åtkomliga från internet.

Nginx – Reverse Proxy
Webbapplikationen körs internt på port 3000. Nginx används som reverse proxy och tar emot extern trafik på port 80. Den vidarebefordrar sedan förfrågningar till applikationen via loopback-adressen 127.0.0.1:3000. På så sätt exponeras inte den interna applikationsporten direkt mot internet, vilket förbättrar säkerheten och ger bättre kontroll över inkommande trafik.

Deploy-skript (deploy.sh)
Ett Bash-skript automatiserar deploymentprocessen. Skriptet hämtar den senaste koden från GitHub, installerar nödvändiga beroenden och startar eller startar om applikationen via PM2. PM2 säkerställer dessutom att applikationen startar automatiskt om servern startas om, vilket bidrar till högre tillgänglighet.

Felsökning
Under projektet uppstod en konflikt där en Docker-container (Webtop/Selkies) redan använde port 3000. Den aktiva processen identifierades med kommandot sudo lsof -i :3000. Efter att containern stoppats frigjordes porten och applikationen kunde startas korrekt.

Uppgift 2

Linux – Filsystem
Linux använder ett hierarkiskt filsystem som utgår från roten /. Viktiga kataloger inkluderar /etc för systemkonfiguration, /home för användardata, /var/log för loggfiler samt /bin för körbara systemprogram. Strukturen gör systemet organiserat och underlättar administration.

Linux – Behörigheter och sudo
Behörigheter i Linux definieras genom tre rättigheter: read (r), write (w) och execute (x), för tre kategorier: ägare, grupp och övriga användare. Dessa ändras med kommandot chmod. Med kommandot sudo kan en användare temporärt köra kommandon med root-privilegier utan att ha permanent administratörsbehörighet.

Linux – Symboliska och hårda länkar
En symbolisk länk (symlink) är en referens till en annan fils sökväg och blir ogiltig om originalfilen tas bort. En hård länk pekar direkt på filens inode och därmed på själva datainnehållet, vilket gör att filen finns kvar så länge minst en länk existerar.

Linux – Montering (Mounting)
Montering innebär att ett externt filsystem, exempelvis en hårddisk eller USB-enhet, kopplas in i Linux katalogstruktur via en monteringspunkt. Till skillnad från Windows använder Linux inte enhetsbokstäver, utan enheter visas som kataloger i filsystemträdet.

Windows Server – Filsystem
Windows Server använder främst filsystemet NTFS. NTFS stöder stora lagringsvolymer, metadata och transaktionsloggning. Centrala kataloger är C:\Windows för operativsystemet, C:\Users för användarprofiler, C:\Program Files för installerade program och C:\Windows\System32 för viktiga systembibliotek.

Windows Server – Behörigheter
Behörigheter hanteras via Access Control Lists (ACL). Varje fil eller mapp har en lista som definierar vilka användare eller grupper som har vilka rättigheter. Behörigheter kan ärvas från överordnade mappar eller definieras individuellt och administreras ofta centralt via Active Directory i en domänmiljö.

Windows Server – Resursövervakning
Systemprestanda kan analyseras med flera verktyg. Task Manager visar resursanvändning i realtid per process, Resource Monitor ger mer detaljerad analys av nätverk och minne, Event Viewer används för att granska system- och säkerhetsloggar och Performance Monitor möjliggör långsiktig övervakning av systemets prestanda.

Nätverk – IP-adress
En IP-adress är en logisk identifierare för ett nätverksgränssnitt och används för att dirigera datapaket mellan nätverk enligt OSI model lager 3. Till skillnad från MAC-adresser kan IP-adresser ändras genom nätverkskonfiguration.

Nätverk – MAC-adress
En MAC-adress är en unik fysisk identifierare som tilldelas ett nätverkskort av tillverkaren. Den används för kommunikation inom lokala nätverk på OSI-modellens lager 2 och används inte för routing mellan olika nätverk.

Nätverk – Subnätmask
En subnätmask delar upp en IP-adress i en nätverksdel och en värddel. Den avgör vilka adresser som tillhör samma lokala nätverk. Till exempel innebär masken 255.255.255.0 att de tre första oktetterna representerar nätverket och den sista identifierar en specifik enhet.

Nätverk – DNS
Domain Name System översätter domännamn till IP-adresser genom ett hierarkiskt system av namnservrar. Detta gör att användare kan använda lättlästa domännamn i stället för att behöva komma ihåg numeriska IP-adresser.

Nätverk – Router vs Switch
En switch kopplar samman enheter inom ett lokalt nätverk och skickar trafik baserat på MAC-adresser. En router kopplar ihop olika nätverk och dirigerar trafik baserat på IP-adresser, vilket gör den central för kommunikation mellan ett lokalt nätverk och internet.

Virtualisering
Virtualisering innebär att fysisk hårdvara abstraheras genom en hypervisor, exempelvis Proxmox VE eller VMware ESXi, så att flera virtuella maskiner kan köras på samma fysiska server. Detta förbättrar resursutnyttjande, minskar hårdvarukostnader och förenklar skalning av system.

Skripting
Skript i Bash eller PowerShell används för att automatisera administrativa uppgifter, systemkonfiguration och deploymentprocesser. Automatisering minskar risken för mänskliga fel och säkerställer att servrar konfigureras konsekvent. I detta projekt användes skriptet deploy.sh för att automatisera hela deploymentflödet.

Säkerhet vid serveruppsättning
En säker servermiljö bygger på flera skyddslager enligt principen Defense in Depth. Detta inkluderar brandvägg med endast nödvändiga portar öppna, inaktiverad root-inloggning via SSH, skydd mot brute-force-attacker med Fail2ban, regelbundna säkerhetsuppdateringar, användning av reverse proxy för att dölja interna portar samt tillämpning av Principle of Least Privilege. Tillsammans minskar dessa åtgärder risken för intrång och begränsar konsekvenserna om ett skyddslager skulle fallera.

<img width="3350" height="1790" alt="image" src="https://github.com/user-attachments/assets/5b2ac652-23f8-4900-90a4-f3016df3eac1" />

