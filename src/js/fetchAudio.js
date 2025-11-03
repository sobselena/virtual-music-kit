export const pianoKeysPairs = [
  [
    ['c3', 'q'],
    ['d3', 'w'],
    ['e3', 'e'],
    ['f3', 'r'],
    ['g3', 't'],
    ['a3', 'y'],
    ['b3', 'u'],
    ['c#3', '1'],
    ['d#3', '2'],
    ['f#3', '3'],
    ['g#3', '4'],
    ['a#3', '5']
  ],
  [
    ['c4', 'i'],
    ['d4', 'o'],
    ['e4', 'p'],
    ['f4', 'a'],
    ['g4', 's'],
    ['a4', 'd'],
    ['b4', 'f'],
    ['c#4', '6'],
    ['d#4', '7'],
    ['f#4', '8'],
    ['g#4', '9'],
    ['a#4', '0']
  ],
  [
    ['c5', 'g'],
    ['d5', 'h'],
    ['e5', 'j'],
    ['f5', 'k'],
    ['g5', 'l'],
    ['a5', 'z'],
    ['b5', 'x'],
    ['c#5', 'c'],
    ['d#5', 'v'],
    ['f#5', 'b'],
    ['g#5', 'n'],
    ['a#5', 'm']
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
