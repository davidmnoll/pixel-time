

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "other-pixel": any
    }
  }
}



// OtherPixels.jsx
export default function OtherPixels() {
  return (
    <div class="tab-pane" id="otherPixels" role="tabpanel">
      <div class="card mb-3">
        <div class="card-body">
          <other-pixel></other-pixel>
        </div>
      </div>
      <div id="other-pixels">
        Additional content or components related to Other Pixels...
      </div>
    </div>
  );
}

const otherPixelTemplate = `
<template>
  <div class="card mb-3">
    <div class="card-body">
      <p>X Coordinate: <slot name="x-coordinate"></slot></p>
      <p>Y Coordinate: <slot name="y-coordinate"></slot></p>
      <p>Color: 
        <slot name="color-input"></slot> 
        <button><slot name="color-change-button">Change Color</slot></button>
        <button><slot name="estimate-gas-button">Estimate Gas</slot></button>
      </p>
      <p>Votes: 
        <button><slot name="expand-x-button">Expand X</slot></button>
        <button><slot name="expand-y-button">Expand Y</slot></button>
        <button><slot name="expand-frame-button">Expand Frame</slot></button>
      </p>
      <p><slot name="higher-threshold"></slot></p>
      <p><slot name="more-to-pool"></slot></p>
    </div>
  </div>
</template>
`;

class OtherPixel extends HTMLElement {

  constructor() {
    super();
    this._data = [];
    this.demo = this.getAttribute('demo') === '' || !!this.getAttribute('demo');
    this.loading = this.getAttribute('loading') === '' || !!this.getAttribute('loading');
    this.attachTemplate();
    if (this.demo) {
      this.setDemoContent();
    }
  }

  attachTemplate() {
    const templateEl = document.createElement('template');
    templateEl.innerHTML = otherPixelTemplate;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateEl.content.cloneNode(true));
  }

  setDemoContent() {
    this.innerHTML = `
      <span slot="x-coordinate">100</span>
      <span slot="y-coordinate">150</span>
      <input type="color" slot="color-input" value="#ff0000">
      <span slot="expand-x-button">Dummy Expand X</span>
      <span slot="expand-y-button">Dummy Expand Y</span>
      <span slot="expand-frame-button">Dummy Expand Frame</span>
      <span slot="higher-threshold">Dummy Threshold</span>
      <span slot="more-to-pool">Dummy More to Pool</span>
    `;
  }

}

customElements.define('other-pixel', OtherPixel);
