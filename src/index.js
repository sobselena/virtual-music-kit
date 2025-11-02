import {Component} from './js/Component';
import {Button} from './js/Button';
import { Key } from './js/Key';

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


function createLayout() {

}