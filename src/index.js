import {Component} from './js/Component.js';
import {Button} from './js/Button.js';
import { Key } from './js/Key.js';
import { Input } from './js/Input.js';
import { PianoKeys } from './js/PianoKeys.js';
// Fetch audio
import {pianoKeyObj, fetchAudio, pianoKeysPairs} from './js/fetchAudio.js';
// Default piano keys


const keyNames = Object.keys(pianoKeyObj);

let getPianoKeys;
let getPianoKeysScroller;



window.addEventListener('load', async () => {
  await fetchAudio(keyNames);
  showLayout();
  initScroller();
  calcScale();
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

function clickPianoKeys(event, handlerName = 'pressDown') {
  if (!(event.target instanceof Element)) return;
  const activeKey = event.target.closest('.piano__key-white, .piano__key-black')
  if (activeKey) {
      const pianoKeyValue = activeKey.querySelector('.piano__key-name').textContent;
      changeKeyStage(pianoKeyValue, activeKey.getAttribute('data-key'), handlerName);
  }
}

function createOctave(octaveKeys, isFirst = false) {
  const keysArr = octaveKeys.map(([keyName]) => {
    const keyColor = keyName.includes('#') ? ['piano__key-black'] : ['piano__key-white'];
    const pianoKey = key(keyColor, keyName);
    pianoKey.setData(keyName);
    return pianoKey;
  });
  return isFirst ? div(['piano__octave'], div(['piano__octave-overlay']), div(['piano__octave-scroller']), ...keysArr) : div(['piano__octave'], ...keysArr);
}


function createPianoContainer() {
  getPianoKeys = pianoKeys(...pianoKeysPairs.map(octaveKeys => createOctave(octaveKeys)));
  return div(['piano__container'], getPianoKeys, createPianoScroller())
}
function createPianoScroller() {
  getPianoKeysScroller = pianoKeys( ...pianoKeysPairs.map((octaveKeys, index) => createOctave(octaveKeys, index === 0)))
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
function changeKeyStage(key, keyName, handlerName) {
    getPianoKeys[handlerName](key);
  getPianoKeysScroller[handlerName](key);

}
function handleKeyUpDown(key, handlerName) {
  if (!key.includes('Digit') && !key.includes('Key')) return;
  key = key?.at(-1).toLowerCase();
  const keyName = Object.keys(pianoKeyObj).find(pianoKeyName =>pianoKeyObj[pianoKeyName] === key);;
  if (!keyName) return;
  changeKeyStage(key, keyName, handlerName);
}

document.addEventListener('keydown', (event) => {
  let keyDown = event.code;
  handleKeyUpDown(keyDown, 'pressDown')
});


document.addEventListener('keyup', (event) => {
  let keyUp = event.code;
  handleKeyUpDown(keyUp, 'pressUp');
})

document.addEventListener('mousedown', (event) => clickPianoKeys( event, 'pressDown'));
document.addEventListener('mouseup', (event) => clickPianoKeys(event, 'pressUp'));
document.addEventListener('mouseleave', (event) => clickPianoKeys(event, 'pressUp'));

// Resize range
const coords = {curTransform: 0, isScrolling: false}
let scale;

function calcScale() {
  const piano = document.querySelector('.piano');
  const scroller = getPianoKeysScroller.currentNode().querySelector('.piano__octave-scroller');
  scale = 3 * Math.min(piano.getBoundingClientRect().width / getPianoKeys.currentNode().getBoundingClientRect().width, 1);
  scroller.style.transform = `translateX(${coords.curTransform}px) scaleX(${scale})`;
}

window.addEventListener('resize', calcScale)

function initScroller() {
  const overlay = document.querySelector('.piano__octave-overlay');
  const scroller = document.querySelector('.piano__octave-scroller');

  overlay.addEventListener('pointerdown', (event) => {
    coords.x1 = event.clientX;
    coords.x2 = event.clientX;
    coords.isScrolling = true
  });

  overlay.addEventListener('pointermove', (event) => {
    if (!coords.isScrolling) return;
    coords.x2 = event.clientX;
  });

  overlay.addEventListener('pointerup', () => {
    coords.isScrolling = false
  });

  overlay.addEventListener('pointerleave', () => {
    coords.isScrolling = false
  });

  function animate() {
    if (coords.isScrolling) {
      const maxValue = (overlay.getBoundingClientRect().width - scroller.getBoundingClientRect().width)/ 2 + 3;

      coords.curTransform = Math.min(Math.max(-maxValue, coords.curTransform + (coords.x2 - coords.x1) * 1),  maxValue);

      scroller.style.transform = `translateX(${coords.curTransform}px) scaleX(${scale})`;

      getPianoKeys.currentNode().style.transform = `translateX(${-coords.curTransform * overlay.getBoundingClientRect().width / scroller.getBoundingClientRect().width}px)`;
      coords.x1 = coords.x2;
    }

    requestAnimationFrame(animate)
  }
  animate();
}

const media = window.matchMedia('(hover:hover) and (pointer:fine)');
media.addEventListener('change', () => {
  calcScale();
})