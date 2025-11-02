export class Component {
  #node = null;
  constructor({tag = 'div', classes = [], text = ''}, ...children) {
    const node = document.createElement(tag);
    if (classes.length > 0) {
      node.classList.add(...classes);
    }
    node.textContent = text;
    this.#node = node;
    if (children) {
      this.appendChildren(children);
    }
  }

  appendChildren(children) {
    children.forEach(child => {
      this.#node.append(child.currentNode());
    });
  }

  currentNode() {
    return this.#node;
  }

  addEvent(event, callback) {
    this.#node.addEventListener(event, callback);
  }

  removeEvent(event, callback) {
    this.#node.removeEventListener(event, callback);
  }

  setAttribute(attributeName, attributeValue) {
    this.#node.setAttribute(attributeName, attributeValue);
  }
}