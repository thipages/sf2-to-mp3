#!/usr/bin/env node
// sf2-to-mp3.js
// Utilisation : node convert-sf2-to-mp3.js <dossier_sf2> [-ffmpeg | -all]
// Usage: node convert-sf2-to-mp3.js <sf2-folder> [-ffmpeg | -all]

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CONFIG_FILE = "config.json";

// Chargement config.json
// Load config.json
function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`Fichier ${CONFIG_FILE} non trouvé.`);
    console.error(`File ${CONFIG_FILE} not found.`);
    process.exit(1);
  }
  const raw = fs.readFileSync(CONFIG_FILE, "utf8");
  return JSON.parse(raw);
}

// Constantes
// Constants
const MIDI_DIR = path.resolve("midis");
if (!fs.existsSync(MIDI_DIR)) {
  console.error(`Dossier MIDI introuvable (codé en dur) : "${MIDI_DIR}"`);
  console.error(`MIDI folder not found (hardcoded): "${MIDI_DIR}"`);
  process.exit(1);
}

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (e) {
    console.error(`Erreur commande : ${cmd}`);
    console.error(`Command error: ${cmd}`);
    process.exit(1);
  }
}

function processSf2(sf2Path, config, useFFmpeg) {
  const sf2Name = path.basename(sf2Path, ".sf2");
  const outDirName = sf2Name + (useFFmpeg ? "-ffmpeg" : "");
  const outDir = path.join(path.dirname(sf2Path), outDirName);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`\nTraitement SF2 : ${sf2Name} ${useFFmpeg ? "avec" : "sans"} FFmpeg`);
  console.log(`Processing SF2: ${sf2Name} with${useFFmpeg ? "" : "out"} FFmpeg`);

  for (let note = 0; note <= 127; note++) {
    const midiFile = path.join(MIDI_DIR, `note_${note}.mid`);
    if (!fs.existsSync(midiFile)) {
      console.warn(`⚠️ MIDI absent : ${midiFile}, on passe...`);
      console.warn(`⚠️ MIDI missing: ${midiFile}, skipping...`);
      continue;
    }

    const wavFile = path.join(outDir, `${note}.wav`);
    const mp3File = path.join(outDir, `${note}.mp3`);

    // FluidSynth - Synthèse MIDI vers WAV
    // FluidSynth - MIDI synthesis to WAV
    let fsCmd = `"${config.FLUIDSYNTH}" -ni -g 3 -F "${wavFile}" "${sf2Path}" "${midiFile}"`;
    runCommand(fsCmd);

    // Encodage MP3
    // MP3 encoding
    if (useFFmpeg) {
      // Normalisation avec ffmpeg
      // Normalization with ffmpeg
      const wavNorm = path.join(outDir, `${note}_norm.wav`);
      const ffmpegCmd = `"${config.FFMPEG}" -y -i "${wavFile}" -filter:a "volume=1.5,alimiter=limit=0.99" "${wavNorm}"`;
      runCommand(ffmpegCmd);
      const lameCmd = `"${config.LAME}" --preset standard "${wavNorm}" "${mp3File}"`;
      runCommand(lameCmd);
      fs.unlinkSync(wavNorm);
    } else {
      // Sans ffmpeg, encodage direct
      // Without ffmpeg, direct encoding
      const lameCmd = `"${config.LAME}" --preset standard "${wavFile}" "${mp3File}"`;
      runCommand(lameCmd);
    }

    fs.unlinkSync(wavFile);
    console.log(`Note ${note} -> ${mp3File}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Utilisation : node convert-sf2-to-mp3.js <dossier_sf2> [-ffmpeg | -all]");
    console.error("Usage: node convert-sf2-to-mp3.js <sf2-folder> [-ffmpeg | -all]");
    process.exit(1);
  }

  const sf2Folder = path.resolve(args[0]);
  if (!fs.existsSync(sf2Folder) || !fs.statSync(sf2Folder).isDirectory()) {
    console.error(`Dossier SF2 invalide: ${sf2Folder}`);
    console.error(`Invalid SF2 folder: ${sf2Folder}`);
    console
    process.exit(1);
  }

  const useFFmpeg = args.includes("-ffmpeg");
  const useAll = args.includes("-all");

  const config = loadConfig();
console.log(config);
  // Recherche SF2 dans le dossier
  // Search for SF2 files in the folder
  const sf2Files = fs.readdirSync(sf2Folder).filter(f => f.toLowerCase().endsWith(".sf2"));

  if (sf2Files.length === 0) {
    console.error(`Aucun fichier .sf2 trouvé dans ${sf2Folder}`);
    console.error(`No .sf2 file found in ${sf2Folder}`);
    process.exit(1);
  }

  for (const sf2 of sf2Files) {
    const sf2Path = path.join(sf2Folder, sf2);
    if (useAll) {
      processSf2(sf2Path, config, false);
      processSf2(sf2Path, config, true);
    } else {
      processSf2(sf2Path, config, useFFmpeg);
    }
  }

  console.log("\n✅ Traitement terminé.");
  console.log("\n✅ Processing completed.");
}

main();
