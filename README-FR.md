
# 🎼 sf2-to-mp3

> Conversion automatique de fichiers SoundFont (.sf2) et MIDI (.mid) en MP3, avec ou sans traitement audio (`lame` ou `ffmpeg`).

## 🧰 Objectif

Ce script Node.js permet de :
- Synthétiser des fichiers MIDI en audio (.wav) à l’aide de banques de sons `.sf2`
- Générer des fichiers `.mp3` à partir des `.wav`
- Appliquer une normalisation audio avec volume et limiteur via `ffmpeg` (optionnel)

## Prérequis

- Logiciels à télécharger et placer dans un dossier `softwares` au même niveau que le script :
  - [FluidSynth](https://www.fluidsynth.org/) (version récente, ex. 2.x)
  - [LAME MP3 Encoder](http://lame.sourceforge.net/)
  - [FFmpeg](https://ffmpeg.org/download.html) (optionnel, pour normalisation audio)

## Configuration

Placez les exécutables FluidSynth, LAME et FFmpeg dans un dossier `softwares`.
Modifiez les chemins dans `config.json` si besoin.

## Exemple de `config.json`

```json
{
  "FLUIDSYNTH": "softwares/fluidsynth/bin/fluidsynth.exe",
  "LAME": "softwares/lame/lame.exe",
  "FFMPEG": "softwares/ffmpeg/bin/ffmpeg.exe",
  "MIDI_DIR": "midis"
}
```

## 📁 Structure attendue
```
├── sf2-to-mp3.js 
|── config.json
├── midis/  
│   ├── note_0.mid  
│   ├── note_1.mid  
│   └── ...  
├── chemin/vers/dossier_sf2/  
│   ├── piano.sf2  
│   └── guitar.sf2  
└── softwares/  
    ├── fluidsynth-2.4.6-win10-x64/  
    │   └── bin/  
    │       └── fluidsynth.exe  
    ├── lame3.100.1-x64/  
    │   └── lame.exe  
    └── ffmpeg/  
        └── bin/  
            └── ffmpeg.exe  
```
## ⚙️ Utilisation

node sf2-to-mp3.js <chemin/vers/dossier_sf2> [option]

### Options disponibles

| Argument  | Effet                                                             |
| --------- | ----------------------------------------------------------------- |
| -ffmpeg   | Utilise ffmpeg pour traitement audio (volume + limiteur)         |
| -all      | Génére les deux versions : avec et sans ffmpeg                   |
| *(aucun)* | Par défaut : conversion simple avec lame (pas de traitement audio)|

## 📦 Sortie

- Les fichiers MP3 sont générés dans un dossier portant le nom du fichier `.sf2` :  
  - `nomDuSf2/` pour la version sans traitement  
  - `nomDuSf2-ffmpeg/` pour la version traitée  
- Chaque note MIDI est exportée en fichier : `0.mp3`, `1.mp3`, ..., `127.mp3`  
- Les fichiers `.wav` intermédiaires sont automatiquement supprimés  

## 🧪 Paramètres techniques

### Fluidsynth (synthèse audio)

fluidsynth -ni -g 3 -F "output.wav" "soundfont.sf2" "note.mid"

- `-ni` : mode non interactif  
- `-g 3` : gain appliqué (3.0)  
- `-F` : sortie `.wav` au lieu du flux audio direct  

### lame (conversion MP3 simple)

lame -V2 input.wav output.mp3

- `-V2` : encode en VBR haute qualité  

### ffmpeg (traitement avancé)

ffmpeg -i input.wav -filter:a "volume=1.5,alimiter=limit=0.99" output.mp3

- `volume=1.5` : amplifie le volume du fichier  
- `alimiter=limit=0.99` : évite les dépassements (pic audio max = -0.01 dBFS)  

## 💬 Exemple d'appel

`node sf2-to-mp3.js soundfonts -ffmpeg`

Cela traitera tous les fichiers `.sf2` dans `soundfonts/` avec normalisation via ffmpeg.
