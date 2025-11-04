import {Component} from './js/Component.js';
import {Button} from './js/Button.js';
import { Key } from './js/Key.js';
import { Input } from './js/Input.js';
import { PianoKeys } from './js/PianoKeys.js';
// Fetch audio
import {fetchAudio, pianoKeysPairs} from './js/fetchAudio.js';
// Default piano keys



function createPianoKeyObj() {
  return pianoKeysPairs.flat().reduce((acc, [keyName, keyValue]) => {
  acc[keyName] = keyValue
  return acc;
}, {});
}
export let pianoKeyObj = createPianoKeyObj();
const keyNames = Object.keys(pianoKeyObj);

let getShowKeysLine;
let getPianoKeys;
let getPianoKeysScroller;
let getEditInput;
let getCombinationInput;;
export let getKeyValueContainer;


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
const p = (classes, text) => {
  return new Component({tag: 'p', text, classes});
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

  getPianoKeys.currentNode().querySelectorAll('.piano__key-white, .piano__key-black').forEach(keyEl => keyEl.addEventListener('mouseleave', (event) => clickPianoKeys(event, 'pressUp')));
  return div(['piano__container'], getPianoKeys, createPianoScroller(), div(['piano__container-overlay']))
}
function createPianoScroller() {
  getPianoKeysScroller = pianoKeys( ...pianoKeysPairs.map((octaveKeys, index) => createOctave(octaveKeys, index === 0)))
  return div(['piano__scroller'], getPianoKeysScroller);
}


// Piano Settings

//  Current Key Layout
function createPianoCurrentKeyPair() {
  getEditInput = input(['piano__current-key-value-input']);
  getEditInput.setAttribute('maxlength', 1);
  getEditInput.setAttribute('pattern', '[a-zA-Z0-9]');
  getEditInput.addEvent('keydown', (event) => {
    if (event.key === 'Enter') {
      clickEditBtn();
    }
  })
  getKeyValueContainer = div(['piano__current-key-value-container'], span(['piano__current-key-value'], '?'), getEditInput);
  return div(['piano__current-key-pair'], span(["piano__current-key-name"], '?'), span(["piano__current-key-vl"], '|'),  getKeyValueContainer)
}
function createPianoCurrentKey() {
  return div(['piano__current-key'], span(['piano__current-key-label'], 'Key:'), createPianoCurrentKeyPair())
}

function findOctaveKeyIndex(key) {
  const overallIndex = pianoKeysPairs.flat().findIndex(([keyName]) => keyName === key);
  const octaveIndex = Math.floor((overallIndex) / pianoKeysPairs[0].length)
  const relativeIndex = overallIndex % pianoKeysPairs[0].length;
  return [octaveIndex, relativeIndex];
}
function clickEditBtn() {
  if (document.querySelector(".piano__current-key-value").textContent === '?') return;
  const editInputValue = document.querySelector('.piano__current-key-value-input').value.toLowerCase();
  const canSwap = Object.keys(pianoKeyObj).find(key => pianoKeyObj[key] === editInputValue);
  const curKey = document.querySelector('.piano__current-key-name').textContent;
  if (!(/[0-9a-z]/.test(editInputValue) ) && getKeyValueContainer.currentNode().classList.contains('edit')) {
    document.querySelector(".piano__current-key-value-error").style.display = 'block';
    return;
  }
  const [octaveIndexCur, relativeIndexCur] = findOctaveKeyIndex(curKey);

  if (canSwap) {
    const [octaveIndexSwap, relativeIndexSwap] = findOctaveKeyIndex(canSwap);
    const temp = pianoKeysPairs[octaveIndexCur][relativeIndexCur][1];
    pianoKeysPairs[octaveIndexCur][relativeIndexCur][1] = editInputValue;
    pianoKeysPairs[octaveIndexSwap][relativeIndexSwap][1] = temp;

    document.querySelectorAll(`.piano__key-white[data-key='${canSwap}'] .piano__key-name, .piano__key-black[data-key='${canSwap}'] .piano__key-name`).forEach(el => el.textContent = pianoKeysPairs[octaveIndexSwap][relativeIndexSwap][1]);
  } else {
    pianoKeysPairs[octaveIndexCur][relativeIndexCur][1] = editInputValue;
  }
  document.querySelectorAll(`.piano__key-white[data-key='${curKey}'] .piano__key-name, .piano__key-black[data-key='${curKey}'] .piano__key-name`).forEach(el => el.textContent = pianoKeysPairs[octaveIndexCur][relativeIndexCur][1]);
  pianoKeyObj = createPianoKeyObj();
  document.querySelector('.piano__current-key-value').textContent = pianoKeysPairs[octaveIndexCur][relativeIndexCur][1];
  getKeyValueContainer.currentNode().classList.toggle('edit');
  if (combinationIsPlaying) return;
  
  document.querySelector('.piano__container').classList.toggle('blocked');
}

function createPianoCurrentKeyContainer() {
  return div(['piano__current-key-container'], div(['piano__current-key-overall-container'], createPianoCurrentKey(), button(['piano__edit-btn'], '', clickEditBtn)), p(['piano__current-key-value-error'], 'You shall not pass!'));
}

// Piano Combination Layout
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
let combinationIsPlaying = false;
async function playCombination() {
  const combination = getCombinationInput.currentNode().value.split('');
  document.querySelector('.piano__container').classList.add('blocked');
  combinationIsPlaying = true;
  for (const key of combination) {
    getPianoKeys.clickPianoKey(key);
    await delay(300);
  }
  combinationIsPlaying = false;
  if (getKeyValueContainer.currentNode().classList.contains('edit')) return;
  document.querySelector('.piano__container').classList.remove('blocked');
}
function createPianoCombination() {
  getCombinationInput = input(['piano__input'], 'text').setPlaceholder(pianoKeysPairs[0].filter(([keyName]) => !keyName.includes('#')).map(([, keyValue]) => keyValue).join(''));
  getCombinationInput.addEvent('keydown', (event) => {
    if (event.key === 'Enter') {
      playCombination();
    }
  getEditInput.setAttribute('pattern', '[a-zA-Z0-9]');
  getCombinationInput.setAttribute('maxlength', Object.values(pianoKeyObj).filter(value => value).length * 2);
  })
  return div(['piano__combination'], getCombinationInput , button(['piano__play-btn'], 'Play', playCombination))
}

// Piano Show Keys
function toggleShowKeys() {
  console.log(getPianoKeys.currentNode())
  getPianoKeys.currentNode().classList.toggle('hideKeys');
  getShowKeysLine.currentNode().closest('.piano__show-keys-switcher').classList.toggle('hideKeys');
}

function createPianoShowKeysSwitcher() {
  getShowKeysLine = div(['piano__show-keys-switcher'], div(['piano__show-keys-line']));
  getShowKeysLine.addEvent('click', toggleShowKeys);
  return getShowKeysLine;
}
function createPianoShowKeys() {
  return div(['piano__show-keys'], createPianoShowKeysSwitcher(), span(['piano__show-keys-text'], 'Show keys'))
}
// Overall Settings Layout
function createPianoSettings() {
  const pianoSettings = div(['piano__settings' ], createPianoCurrentKeyContainer(),createPianoCombination(), createPianoShowKeys())

  return pianoSettings;
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
  const keyName = Object.keys(pianoKeyObj).find(pianoKeyName =>pianoKeyObj[pianoKeyName] === key);
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

