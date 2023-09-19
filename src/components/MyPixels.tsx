

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "my-pixel": any
    }
  }
}





const myPixeltemplate = `
<style>
  /* Add any styles here */
</style>
<template>
  <div class="card mb-3">
    <div class="card-body">
      <p>X Coordinate: <span id="x-coordinate"></span></p>
      <p>Y Coordinate: <span id="y-coordinate"></span></p>
      <p>Color: 
        <input type="color" id="color-input" />
        <button id="color-change-button">Change Color</button>
        <button id="estimate-gas-button">Estimate Gas</button>
      </p>
      <p>Votes: 
        <button id="expand-x-button">Expand X</button>
        <button id="expand-y-button">Expand Y</button>
        <button id="expand-frame-button">Expand Frame</button>
      </p>
      <p id="higher-threshold"></p>
      <p id="more-to-pool"></p>
    </div>
  </div>
</template>
`;

class MyPixel extends HTMLElement {

  static get observedAttributes() {
    return ['x-coordinate', 'y-coordinate', 'color', 'color-change-button', 'estimate-gas-button', 'expand-x-button', 'expand-y-button', 'expand-frame-button', 'higher-threshold', 'more-to-pool'];
  }
  
  constructor() {
    super();
    this._data = [];
    this.demo = this.getAttribute('demo') === '' || !!this.getAttribute('demo');
    this.loading = this.getAttribute('loading') === '' || !!this.getAttribute('loading');
    
    const templateEl = document.createElement('template');
    templateEl.innerHTML = myPixeltemplate;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateEl.content.cloneNode(true));
  }

  connectedCallback() {
    this.updateAttributes();
    if (this.demo) {
      this.setAttribute('x-coordinate', '100');
      this.setAttribute('y-coordinate', '150');
      this.setAttribute('color', '#ff0000');
      // ... Set other demo attributes as needed
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateAttributes();
  }

  updateAttributes() {
    const shadowRoot = this.shadowRoot;
    const attrs = ['x-coordinate', 'y-coordinate', 'color', 'color-change-button', 'estimate-gas-button', 'expand-x-button', 'expand-y-button', 'expand-frame-button', 'higher-threshold', 'more-to-pool'];
    
    for (let attr of attrs) {
      if (shadowRoot.getElementById(attr)) {
        shadowRoot.getElementById(attr).textContent = this.getAttribute(attr) || '';
      }
    }

    const colorInput = shadowRoot.getElementById('color-input');
    if (colorInput) {
      colorInput.value = this.getAttribute('color') || '';
    }
  }
}

customElements.define('my-pixel', MyPixel);

// MyPixels.jsx
export default function MyPixels() {
  return (
    <div class="tab-pane active" id="myPixels" role="tabpanel">
      <div id="my-pixels">
        <my-pixel x-coordinate="0" y-coordinate="0" color="#33333333"></my-pixel>
      </div>
    </div>
  );
}