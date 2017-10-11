# Workshop "Build, pack, deploy" beim Developer OpenSpace 2017
## Vorbereitung

### Übersicht
Wir benötigen eine gemeinsame Ausgangsbasis für unseren Workshop. Dazu verwenden wir vorbereitete Vagrant Boxes (Ubuntu 16.04, Docker v17.06-ce), die alles enthalten, was wir beim Workshop benötigen. Vor allem sind alle notwendigen Docker Images bereits enthalten, wir würden sonst viel Zeit damit verlieren, auf die Downloads dieser Images zu warten.

### Installation VirtualBox und Vagrant
Wir werden Vagrant mit dem VirtualBox Provider verwenden. Dazu bitte die folgende Software auf Eurem Rechner installieren:

- VirtualBox 5.1.28 https://www.virtualbox.org/wiki/Downloads
- Vagrant 2.0 https://www.vagrantup.com/downloads.html

Solltet Ihr auf Eurem Windows System Hyper-V aktiviert haben, so deaktiviert dieses Feature bitte für den Workshop. VirtualBox funktioniert nicht, wenn Hyper-V aktiviert ist.

### Setup der Vagrant Boxes
_(Beschreibung hier für Windows, gilt analog für andere Betriebssysteme.)_

__Die Images haben bereits ein paar GB, es ist also sinnvoll, ca 15 GB (besser mehr) freien Speicherplatz zur Verfügung zu haben__

#### Box 1
- Verzeichnis erstellen __c:\boxes\server__
- Vagrantfile (preparation/__server__/Vagrantfile) in dieses Verzeichnis kopieren.
- Git Bash oder Powershell öffnen und in dieses Verzeichnis wechseln
- Kommando ausführen: _vagrant up_
- Daraufhin wird das Image aus der Vagrantcloud geladen, das kann einen Moment dauern.
- Kommando ausführen: _vagrant ssh_
- Falls nötig: Passwort ist _vagrant_
- Ihr seid nun per ssh mit der vagrant box verbunden. Mit _exit_ könnt Ihr sie wieder verlassen. 
- Kommando ausführen: _vagrant halt_
- Damit wird die Vagrant VM wieder heruntergefahren --> __Box 1 fertig.__

#### Box 2
- Verzeichnis erstellen __c:\boxes\agent__
- Vagrantfile (preparation/__agent__/Vagrantfile) in dieses Verzeichnis kopieren.
- Git Bash oder Powershell öffnen und in dieses Verzeichnis wechseln
- Kommando ausführen: _vagrant up_
- Image ist schon verfügbar, wartem bis Box gestartet wurde.
- Kommando ausführen: _vagrant ssh_
- Falls nötig: Passwort ist _vagrant_
- Ihr seid nun per ssh mit der vagrant box verbunden. Mit _exit_ könnt Ihr sie wieder verlassen. 
- Kommando ausführen: _vagrant halt_
- Damit wird die Vagrant VM wieder heruntergefahren --> __Box 2 fertig.__


