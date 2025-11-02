import {Component} from './js/Component.js';
import {Button} from './js/Button.js';
import { Key } from './js/Key.js';
import { Input } from './js/Input.js';

// Default piano keys

const pianoKeys = [
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
window.addEventListener('load', () => {
  showLayout();
});

// Basic Components
const main = (classes, ...children) => {
  return new Component({tag: 'main', classes}, ...children);
}
const section = (classes, ...children) => {
  return new Component({tag: 'section', classes}, ...children)
}
const div = (classes, ...children) => {
  return new Component({tag: 'div', classes}, ...children);
}
const span = (classes, text) => {
  return new Component({tag: 'span', text, classes});
}
const key = (classes, keyValue, onClick) => {
  return new Key({classes, text: keyValue, onClick})
}
const button = (classes, text, onClick) => {
  return new Button({classes, text, onClick});
}
const input = (classes, type, value) => {
  return new Input({classes, type, value})
}
// Piano itself

function createOctave(octaveKeys) {
  return div(['piano__octave'], ...octaveKeys.map(([keyName, keyValue]) => {
    const keyColor = keyName.includes('#') ? ['piano__key-black'] : ['piano__key-white'];
    const pianoKey = key(keyColor, keyValue);
    pianoKey.setData(keyName);
    return pianoKey;
  }))
}
function createPianoKeys() {
  return div(['piano__keys'], ...pianoKeys.map(octaveKeys => createOctave(octaveKeys)))
}
function createPianoScroller() {
  return div(['piano__scroller'], createPianoKeys());
}
function createPianoContainer() {
  return div(['piano__container'], createPianoKeys(), createPianoScroller())
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
  return div(['piano__combination'], input(['piano__input'], 'text').setPlaceholder(pianoKeys[0].filter(([keyName]) => !keyName.includes('#')).map(([, keyValue]) => keyValue).join('')), button(['piano__play-btn'], 'Play'))
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