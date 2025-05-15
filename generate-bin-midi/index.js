import fs from 'fs/promises';
import path from 'path';
import MidiWriter from 'midi-writer-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMidis() {
  const outputDir = path.join(__dirname, 'midis');
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (err) {
    console.error('Erreur création dossier:', err);
    console.error('Error creating folder:', err);
    return;
  }

  for (let note = 0; note < 128; note++) {
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    track.addEvent(new MidiWriter.NoteEvent({ pitch: [note], duration: 'T480', velocity: 100 }));

    const write = new MidiWriter.Writer(track);
    const midiData = write.buildFile();

    await fs.writeFile(path.join(outputDir, `note_${note}.mid`), Buffer.from(midiData));
    console.log(`Note ${note} MIDI générée.`);
    console.log(`Note ${note} MIDI generated.`);
  }

  console.log('✅ Tous les fichiers MIDI ont été générés dans le dossier "midis".');
  console.log('✅ All MIDI files generated in midis folder');
}

generateMidis();
