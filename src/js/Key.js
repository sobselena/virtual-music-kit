import { Component } from "./Component.js";

export class Key extends Component {
  constructor({classes, text : keyName, onClick}) {
    const keyLabel = new Component({tag: 'span', classes: ['piano__key-name'], text: keyName})
    super({tag: 'div', classes}, keyLabel)
    if (onClick) {
      this.onClick = onClick;
      this.addEvent('click', onClick);
    }
  }

  setData(value) {
    this.setAttribute('data-key', value);
  }

  stopAudio() {
    this.removeEvent('click', this.onClick)
  }
}