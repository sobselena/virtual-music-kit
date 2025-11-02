import {Component} from './js/Component.js';
import {Button} from './js/Button.js';
import { Key } from './js/Key.js';
import { Input } from './js/Input.js';
import { PianoKeys } from './js/PianoKeys.js';
// Default piano keys

const pianoKeysPairs = [
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
const pianoKeyObj = pianoKeysPairs.flat().reduce((acc, [keyName, keyValue]) => {
  acc[keyName] = keyValue
  return acc;
}, {});
const keyNames = Object.keys(pianoKeyObj);

let getPianoKeys;
let getPianoKeysScroller;

const ctx  = new AudioContext();
const loadedAudio = {};
async function fetchSound(keyName) {
  try {
  const data = await fetch(`audio/${keyName.replace('#', '-')}.mp3`);
  if (!data.ok) throw new Error('File not found');
  const arrayBuffer = await data.arrayBuffer();
  const decodedAudio = await ctx.decodeAudioData(arrayBuffer);
  loadedAudio[keyName] = decodedAudio;
  } catch(err) {
    console.error(`Failed to decode ${keyName}.mp3:`, err);
  }
}

async function fetchAudio(audioArr) {
  await Promise.all(audioArr.map(keyName => fetchSound(keyName)));
}


window.addEventListener('load', async () => {
  await fetchAudio(keyNames);
  showLayout();
});

// Basic Components
const main = (classes, ...children) => {
  return new Component({tag: 'main', classes}, ...children);
}
const section = (classes, ...children) => {
  return new Component({tag: 'section', classes}, ...children)
}
const pianoKeys = (...children) => {
  return new PianoKeys( ...children)
}
const div = (classes, ...children) => {
  return new Component({tag: 'div', classes}, ...children);
}

const span = (classes, text) => {
  return new Component({tag: 'span', text, classes});
}

function clickPianoKey(keyName) {
  const playSound = ctx.createBufferSource();
  playSound.buffer = loadedAudio[keyName];
  playSound.connect(ctx.destination);
  playSound.start();
}
const key = (classes, keyName) => {
  return new Key({classes, text: pianoKeyObj[keyName]})
}
const button = (classes, text, onClick ) => {
  return new Button({classes, text, onClick});
}
const input = (classes, type, value) => {
  return new Input({classes, type, value})
}
// Piano itself

function clickPianoKeys(event) {
  const activeKey = event.target.closest('.piano__key-white, .piano__key-black')
  if (activeKey) {
      const pianoKeyValue = activeKey.querySelector('.piano__key-name').textContent;
    getPianoKeys.toggleActive(pianoKeyValue);
    getPianoKeysScroller.toggleActive(pianoKeyValue);
    clickPianoKey(activeKey.getAttribute('data-key'));
  }
}
function createOctave(octaveKeys) {
  return div(['piano__octave'], ...octaveKeys.map(([keyName]) => {
    const keyColor = keyName.includes('#') ? ['piano__key-black'] : ['piano__key-white'];
    const pianoKey = key(keyColor, keyName);
    pianoKey.setData(keyName);
    return pianoKey;
  }))
}


function createPianoContainer() {
  getPianoKeys = pianoKeys(...pianoKeysPairs.map(octaveKeys => createOctave(octaveKeys)));
  getPianoKeys.addEvent('click', clickPianoKeys);
  return div(['piano__container'], getPianoKeys, createPianoScroller())
}
function createPianoScroller() {
  getPianoKeysScroller = pianoKeys( ...pianoKeysPairs.map(octaveKeys => createOctave(octaveKeys)))
  return div(['piano__scroller'], getPianoKeysScroller);
}


// Piano Settings

//  Current Key Layout
function createPianoCurrentKeyPair() {
  return div(['piano__current-key-pair'], span(["piano__current-key-name"], 'A3'), span([], '|'), span(['piano__current-key-value'], 'Q'))
}
function createPianoCurrentKey() {
  return div(['piano__current-key'], span(['piano__current-key-label'], 'Key:'), createPianoCurrentKeyPair())
}

function createPianoCurrentKeyContainer() {
  return div(['piano__current-key-container'], createPianoCurrentKey(), button(['piano__edit-btn']))
}

// Piano Combination Layout
function createPianoCombination() {
  return div(['piano__combination'], input(['piano__input'], 'text').setPlaceholder(pianoKeysPairs[0].filter(([keyName]) => !keyName.includes('#')).map(([, keyValue]) => keyValue).join('')), button(['piano__play-btn'], 'Play'))
}

// Piano Show Keys
function createPianoShowKeysSwitcher() {
  return div(['piano__show-keys-switcher'], div(['piano__show-keys-line']));
}
function createPianoShowKeys() {
  return div(['piano__show-keys'], createPianoShowKeysSwitcher(), span(['piano__show-keys-text'], 'Show keys'))
}
// Overall Settings Layout
function createPianoSettings() {
  return div(['piano__settings' ], createPianoCurrentKeyContainer(),createPianoCombination(), createPianoShowKeys())
}
// Overall Layout
function createPianoSection() {
  return section(['piano'], createPianoSettings(), createPianoContainer())
}
function createMainLayout() {
  return main(['main'], div(['wrapper'], createPianoSection()));
}

function showLayout() {
  document.body.append(createMainLayout().currentNode());
}

// Add events for Piano Keys

document.addEventListener('keydown', (event) => {
  let curKey = event.code;
  if (!curKey.includes('Digit') && !curKey.includes('Key')) return;
  curKey = curKey?.at(-1).toLowerCase();
  const keyName = Object.keys(pianoKeyObj).find(pianoKeyName =>pianoKeyObj[pianoKeyName] === curKey);
  if (keyName) {
    console.log(getPianoKeys.getActiveKeys(curKey))
    getPianoKeys.toggleActive(curKey);
    getPianoKeysScroller.toggleActive(curKey);
    clickPianoKey(keyName)
  };
});