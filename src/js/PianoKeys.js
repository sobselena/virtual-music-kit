import { Component } from "./Component.js";
import { ctx, loadedAudio } from "./fetchAudio.js";
import { pianoKeyObj } from "../index.js";
import { getKeyValueContainer } from "../index.js";
export class PianoKeys extends Component {
  #pressed = [];
  #isPlaying = false;
  #playSound;
  constructor(...children) {
    super({tag: 'div', classes: ['piano__keys']}, ...children);
  }
  getActiveKeys(keyValue) {
    return Array.from( this.currentNode().querySelectorAll(`.piano__key-name`)).filter(spanEl => spanEl.textContent === keyValue).map(span => span.closest('.piano__key-white, .piano__key-black'));
  }
  pressDown(keyValue) {
    if (this.#pressed.at(-1) !== keyValue) {
      this.#pressed.push(keyValue);
      if (this.#pressed.length === 1) {
        this.clickPianoKey();
      }
    }


  }

  pressUp(keyValue) {
    this.getActiveKeys(keyValue).forEach(keyEl => keyEl.classList.remove('active'));
    const keyIndex = this.#pressed.findIndex((value) => keyValue === value);
    if (keyIndex === -1) return;
     this.#pressed.splice(keyIndex, 1);
     if (keyIndex === 0 && this.#pressed.length > 0) {
      this.#isPlaying = false;
      this.clickPianoKey();
     }
  }
  clickPianoKey(combinationKey) {
      if (getKeyValueContainer.currentNode().classList.contains('edit')) return;
      const keyValue = combinationKey || this.getFirstPressedKey();
      const keyName =  Object.keys(pianoKeyObj).find(pianoKeyName =>pianoKeyObj[pianoKeyName] === keyValue);
      if (!keyValue) return;
      if (this.#playSound) {
        this.#playSound.stop();
        this.#playSound = null;
      }
      this.#isPlaying = true;

      this.getActiveKeys(keyValue).forEach(keyEl => keyEl.classList.add('active'));
      document.querySelector('.piano__current-key-name').textContent = keyName;
      document.querySelector('.piano__current-key-vl').textContent = '|';
      document.querySelector('.piano__current-key-value').textContent = keyValue;

      const editInput = getKeyValueContainer.getChildren()[1];
      editInput.setPlaceholder(keyValue);
      editInput.currentNode().value = keyValue;

      const playSound = ctx.createBufferSource();
      this.#playSound = playSound;
      playSound.buffer = loadedAudio[keyName];
      playSound.connect(ctx.destination);
      playSound.start();
      if (combinationKey) {
        playSound.onended = () => {
          this.pressUp(keyValue)
        }
      }
  }

  getFirstPressedKey() {
    return this.#pressed[0];
  }
}