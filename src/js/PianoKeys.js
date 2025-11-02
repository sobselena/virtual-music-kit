import { Component } from "./Component.js";

export class PianoKeys extends Component {
  constructor(...children) {
    super({tag: 'div', classes: ['piano__keys']}, ...children);
  }
  removeOctaveEvent() {
    this.removeEvent('click', this.onClick)
  }
  getActiveKeys(keyValue) {
    return Array.from( this.currentNode().querySelectorAll(`.piano__key-name`)).filter(spanEl => spanEl.textContent === keyValue).map(span => span.closest('.piano__key-white, .piano__key-black'));
  }
  pressDown(keyValue) {
    this.getActiveKeys(keyValue).forEach(keyEl => keyEl.classList.add('active'));
  }
  pressUp(keyValue) {
    this.getActiveKeys(keyValue).forEach(keyEl => keyEl.classList.remove('active'));
  }
}