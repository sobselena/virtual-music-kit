import { Component } from "./Component.js";
export class Input extends Component {
  constructor({classes = [], type = 'text'}) {
    super({tag: 'input', classes});
    this.setAttribute('type', type);
    const layoutMap = {
  'й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p','х':'[','ъ':']',
  'ф':'a','ы':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l','ж':';','э':'\'',
  'я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m','б':',','ю':'.'
    };
    this.addEvent('input', () => {
      let keyValue = this.currentNode().value.toLowerCase();
      keyValue = keyValue.replace(/[а-яё]/g, char => layoutMap[char]);
      keyValue = keyValue.replace(/[^a-z0-9]/, '');
      this.currentNode().value = keyValue;

    })
  }

  setPlaceholder(placeholder) {
    this.setAttribute('placeholder', placeholder);
    return this;
  }

  getValue() {
    return this.currentNode().value;
  }
}