import {Component} from './js/Component';
import {Button} from './js/Button';
import { Key } from './js/Key';
import { Input } from './js/Input';

// Default piano keys

const pianoKeys = [
  {
    'a3': 'q',
    'a#3': '1',
    'b3': 'w',
    'c4': 'e',
    'c#4': '2',
    'd4': 'r',
    'd#4': '3',
    'e4': 't',
    'f4': 'y',
    'f#4': '4',
    'g4': 'u',
    'g#4': '5'
  },
  {
    'a4': 'i',
    'a#4': '6',
    'b4': 'o',
    'c5': 'p',
    'c#5': '7',
    'd5': 'a',
    'd#5': '8',
    'e5': 's',
    'f5': 'd',
    'f#5': '9',
    'g5': 'f',
    'g#5': '0'
  },
  {
    'a5': 'g',
    'a#5': 'c',
    'b5': 'h',
    'c6': 'j',
    'c#6': 'v',
    'd6': 'k',
    'd#6': 'b',
    'e6': 'l',
    'f6': 'z',
    'f#6': 'n',
    'g6': 'x',
    'g#6': 'm'
  }
];
window.addEventListener('load', () => {
  createLayout();
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
  return div(['piano__octave'], ...Object.entries(octaveKeys).map(([keyName, keyValue]) => {
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
  return div(['piano__combination'], input(['piano__input'], 'text').setPlaceholder(Object.keys(pianoKeys[0]).join('')), button(['piano__play-btn'], 'Play'))
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
function createLayout() {

}