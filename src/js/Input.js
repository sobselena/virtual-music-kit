import { Component } from "Component";

export class Input extends Component {
  constructor({classes = [], type = 'text', value = ''}) {
    super({tag: 'input', classes});

    this.setAttribute('type', type);
    this.setAttribute('value', value)
  }

  setPlaceholder(placeholder) {
    this.setAttribute('placeholder', placeholder);
    return this.currentNode();
  }

  getValue() {
    return this.currentNode().value;
  }
  setValue(value) {
    this.setAttribute('value', value)
    return this.currentNode();
  }
}