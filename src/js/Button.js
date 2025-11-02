import { Component } from "./Component.js";

export class Button extends Component {
  constructor({classes, text = '', onClick}) {
    super({tag: 'button', classes, text});
    if (onClick) {
      this.onClick = onClick;
      this.addEvent('click', onClick);
    }
  }

  deleteClickEvent() {
    this.removeEvent('click', this.onClick);
  }
}