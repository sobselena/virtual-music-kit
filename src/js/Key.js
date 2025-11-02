import { Component } from "./Component.js";

export class Key extends Component {
  constructor({classes, text : keyValue}) {
    const keyLabel = new Component({tag: 'span', classes: ['piano__key-name'], text: keyValue})
    super({tag: 'div', classes}, keyLabel)
  }

  setData(value) {
    this.setAttribute('data-key', value);
  }

}