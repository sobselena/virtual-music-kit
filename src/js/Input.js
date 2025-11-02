import { Component } from "./Component.js";

export class Input extends Component {
  constructor({classes = [], type = 'text'}) {
    super({tag: 'input', classes});

    this.setAttribute('type', type);
  }

  setPlaceholder(placeholder) {
    this.setAttribute('placeholder', placeholder);
    return this;
  }

  getValue() {
    return this.currentNode().value;
  }
  setValue(value) {
    this.setAttribute('value', value)
    return this;
  }
}