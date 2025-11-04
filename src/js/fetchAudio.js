export const pianoKeysPairs = [
  [
    ['c3', 'q'],
    ['d3', 'w'],
    ['e3', 'e'],
    ['f3', 'r'],
    ['g3', 't'],
    ['a3', 'y'],
    ['b3', 'u'],
    ['c#3', 'i'],
    ['d#3', 'o'],
    ['f#3', 'p'],
    ['g#3', 'a'],
    ['a#3', 's']
  ],
  [
    ['c4', 'd'],
    ['d4', 'f'],
    ['e4', 'g'],
    ['f4', 'h'],
    ['g4', 'j'],
    ['a4', 'k'],
    ['b4', 'l'],
    ['c#4', 'z'],
    ['d#4', 'x'],
    ['f#4', 'c'],
    ['g#4', 'v'],
    ['a#4', 'b']
  ]
];

export const ctx  = new AudioContext();
export const loadedAudio = {};

export async function fetchSound(keyName) {
  try {
  const data = await fetch(`assets/audio/${keyName.replace('#', '-')}.mp3`);
  if (!data.ok) throw new Error('File not found');
  const arrayBuffer = await data.arrayBuffer();
  const decodedAudio = await ctx.decodeAudioData(arrayBuffer);
  loadedAudio[keyName] = decodedAudio;
  } catch(err) {
    console.error(`Failed to decode ${keyName}.mp3:`, err);
  }
}

export async function fetchAudio(audioArr) {
  await Promise.all(audioArr.map(keyName => fetchSound(keyName)));
}
