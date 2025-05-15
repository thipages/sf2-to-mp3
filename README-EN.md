
# 🎼 sf2-to-mp3

> Automatic conversion of SoundFont (.sf2) and MIDI (.mid) files to MP3, with optional audio processing (`lame` or `ffmpeg`).

## 🧰 Purpose

This Node.js script allows you to:  
- Synthesize MIDI files into audio (.wav) using `.sf2` soundfonts  
- Generate `.mp3` files from `.wav`  
- Apply audio normalization with volume boost and limiter using `ffmpeg` (optional)

## Requirements

- Software to download and place into a `softwares` folder alongside the script:
  - [FluidSynth](https://www.fluidsynth.org/) (recent version 2.x recommended)
  - [LAME MP3 Encoder](http://lame.sourceforge.net/)
  - [FFmpeg](https://ffmpeg.org/download.html) (optional, for audio normalization)

## Configuration

Place FluidSynth, LAME, and FFmpeg executables in a `softwares` folder.
Edit paths in `config.json` if needed.

## Sample `config.json`

```json
{
  "FLUIDSYNTH": "softwares/fluidsynth/bin/fluidsynth.exe",
  "LAME": "softwares/lame/lame.exe",
  "FFMPEG": "softwares/ffmpeg/bin/ffmpeg.exe",
  "MIDI_DIR": "midis"
}
```

## 📁 Expected structure

```
├── sf2-to-mp3.js  
|── config.json
├── midis/  
│   ├── note_0.mid  
│   ├── note_1.mid  
│   └── ...  
├── path/to/sf2_folder/  
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

## ⚙️ Usage

node sf2-to-mp3.js <path/to/sf2_folder> [option]

### Available options

| Argument  | Effect                                                        |
| --------- | -------------------------------------------------------------|
| -ffmpeg   | Use ffmpeg for audio processing (volume + limiter)           |
| -all      | Generate both versions: with and without ffmpeg              |
| *(none)*  | Default: simple conversion with lame (no audio processing)   |

## 📦 Output

- MP3 files are generated in a folder named after the `.sf2` file:  
  - `sf2Name/` for the no-processing version  
  - `sf2Name-ffmpeg/` for the processed version  
- Each MIDI note is exported as `0.mp3`, `1.mp3`, ..., `127.mp3`  
- Intermediate `.wav` files are automatically deleted  

## 🧪 Technical parameters

### Fluidsynth (audio synthesis)

fluidsynth -ni -g 3 -F "output.wav" "soundfont.sf2" "note.mid"

- `-ni`: non-interactive mode  
- `-g 3`: gain applied (3.0)  
- `-F`: output `.wav` file instead of streaming audio  

### lame (simple MP3 encoding)

lame -V2 input.wav output.mp3

- `-V2`: high-quality VBR encoding  

### ffmpeg (advanced processing)

ffmpeg -i input.wav -filter:a "volume=1.5,alimiter=limit=0.99" output.mp3

- `volume=1.5`: boost audio volume  
- `alimiter=limit=0.99`: prevents clipping (max peak at -0.01 dBFS)  

## 💬 Example command

`node sf2-to-mp3.js soundfonts -ffmpeg`

This will process all `.sf2` files in `soundfonts/` with normalization using ffmpeg.
