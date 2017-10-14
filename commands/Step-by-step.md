## Setup der Testumgebung
### SSL Zertifikat
Ihr benötigt für die Durchführung nach diesem Guide ein gültiges SSL Zertifikat. Ich habe für eine meiner Domains ein Let's Encrypt Zertifikat ausstellen lassen, das wir im Workshop verwendet haben. Im weiteren Verlauf dieses Guides beziehe ich mich mit $SSLHOST auf den Domainnamen, für den Ihr ein Zertifikat ausgestellt habt. Z.b. $SSLHOST = devspace.isfun.com

### Starten der Server-Box
``` bash
vagrant up 
vagrant ssh
```

### Mailcatcher und DNS
``` bash
docker network create --subnet 172.18.0.0/16 gitlab-net

docker run -d -p 1080:1080 \
    --name mailcatcher \
    --network gitlab-net \
    --restart always \
    schickling/mailcatcher

docker run -d --name gitlab-dns \
    --ip 172.18.0.7 --subnet 172.18.0.0/16 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network gitlab-net \
    blackikeeagle/developer-dns
```

### Gitlab
#### Setup
``` bash
docker run -d \
    -p 443:443 -p 5001:5001 \
    --name gitlab \
    --network gitlab-net \
    --restart always \
    -e VIRTUAL_HOST=$SSLHOST \
    -v /vagrant/gitlab-config:/etc/gitlab \
    -v ~/gitlab-data/logs:/var/log/gitlab \
    -v ~/gitlab-data/data:/var/opt/gitlab \
    -v ~/gitlab-data/ssl:/etc/gitlab/ssl \
    gitlab/gitlab-ce:10.0.2-ce.0
``` 

Zertifikate für Gitlab nach ~/gitlab-data/ssl kopieren. Name der Dateien sollte $SSLHOST.crt und $SSLHOST.key sein. Dies ist der Default und wird von Gitlab automatisch erkannt, wenn man davon abweicht, muss man das in der Gitlab Config entsprechend hinterlegen.

#### Konfiguration
Datei /vagrant/gitlab-data/config/gitlab.rb öffnen und folgende Einstellungen machen:

external_url = "https://$SSLHOST"  
registry_external_url = "https://$SSLHOST:5001"

gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "mailcatcher"
gitlab_rails['smtp_port'] = 1025

Danach Gitlab Container neu starten.
``` bash
docker restart gitlab
```

Neustart dauert ca. 1 Minute. Danach via Browser überprüfen, dass Gitlab unter https://$SSLHOST erreichbar ist (daran denken, /etc/hosts Datei enstrpechend anzupassen und $SSLHOST entsprechend auf localhost oder Private IP der Vagrant Box umzubiegen)

#### User, Gruppe, Projekt anlegen, Code in Repo einchecken
- Einen eigenen User anlegen --> Mail imm Mailcatcher
- Gruppe *devspace* anlegen
- Projekt *TodoApi* in dieser Gruppe anlegen
- Entweder netcore Projekt aus diesem Repo /src/netcore oder NodeJS Projekt aus diesem Repo /src/nodejs in das eben erstellte Gitlab Repo einchecken.

#### Gitlab Docker Runner
Gitlab Runner Container starten.
``` bash
mkdir /vagrant/docker-runner-data
touch /vagrant/docker-runner-data/config.toml

docker run -d \
    --name docker-runner \
    --network gitlab-net \
    --restart always \
    --dns 172.18.0.7 \
    -v /vagrant/docker-runner-data/config.toml:/etc/gitlab-runner/config.toml \
    -v /var/run/docker.sock:/var/run/docker.sock \
    gitlab/gitlab-runner:v10.0.2
```

Gitlab Runner registrieren. Dazu Runner Token aus Gitlab UI (Admin-Bereich / Runners) kopieren.
``` bash
docker exec -it docker-runner \
    gitlab-runner register \
    --non-interactive --name docker \
    --url https://$SSLHOST \
    --registration-token TOKEN_GOES_HERE \
    --executor docker --tag-list docker \ 
    --docker-image alpine:latest --docker-dns 172.18.0.7 \ --docker-network-mode gitlab-net \ 
    --docker-volumes /var/run/docker.sock:/var/run/docker.sock
```

### Gitlab CI
Datei .gitlab-ci.yml und ein Dockerfile für die Projekte liegen bereits im Repo. 

## Rancher
### Server Setup
Rancher Server Container starten und Firewall Port 80 auf 8080 (Rancher) weiterleiten.

``` bash
docker run -d -v ~/rancher-data:/var/lib/mysql \            
    --restart=unless-stopped --network gitlab-net \
    -p 8080:8080 \
    rancher/server:v1.6.10

sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

### Agent Setup
Hierfür benötigt Ihr die zweite Vagrant Box 'agent'.
Patcht die /etc/hosts und hinterlegt 192.168.33.10 (private IP im Vagrant Netzwerk der ersten Server Vagrant Box) für $SSLHOST. 
In der Rancher UI fügt Ihr einen 'Custom Host" hinzu. Dort könnt Ihr die Commandline mit dem docker run Befehl für den rancher/agent Container rauskopieren. Führt diesen Befehl auf der 'agent' Vagrantbox aus. Der Host erscheint nun in der Rancher UI.
Die .gitlab-ci.yml des Projekts enthält bereits eine Deploy-Stage. Das Image cdrx/rancher-gitlab-deploy benötigt drei Environment Variablen:
- RANCHER_URL
- RANCHER_ACCESS_KEY
- RACHER_SECRET_KEY 

In der Rancher UI erzeugt Ihr euch unter "API" einen Zugang zur Rancher API, dort erhaltet Ihr die Werte für RANCHER_ACCESS_KEY und RACHER_SECRET_KEY. Hinterlegt diese Informationen als Gitlab Secrets im Projekt (in den Projekteinstellungen / CI/CD / Secrets).

Nun sollte nach erfolgreichem Durchlaufen der Pipeline das gebaute Docker-Image als neue Version in Euer Rancher-Environment deployed werden.
