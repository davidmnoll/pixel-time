import { Ref, createEffect, Suspense } from "solid-js";
import { useContract } from "../providers";


declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "canvas-player": Partial<CanvasPlayerElement & { ref: Ref<CanvasPlayerElement> }>;
    }
  }
}


export default function CanvasPlayer() {
    
  const data = useContract();
  
  let canvas;

  createEffect(() => {
    console.log('data', data)
    if (data.ready) {
      console.log('ready', data)
      canvas.data = data().framesData;
      canvas.loading = false;
    }
  })


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <canvas-player ref={canvas} id="canvas-player" loading ></canvas-player>
    </Suspense>
  )
}

const template = `
  <style>
    /*... Your styles here ...*/
  </style>
  <div id="container">
    <div id="loading-overlay">
      <canvas></canvas>
    </div>
    <div id="controls-container">
      <button id="prev-button">Previous</button>
      <button id="next-button">Next</button>
      <button id="play-button">Play</button>
      <button id="pause-button">Pause</button>
      <button id="restart-button">Stop</button>
    </div>
  </div>
`;

/**
 * CanvasPlayer - A custom HTML Element that uses a canvas to play and control video-like data.
 * 
 * @class
 * @extends HTMLElement
 * 
 * @property {number} frameDuration - The duration for each frame.
 * @property {number} currentFrame - The index of the current frame being shown.
 * @property {boolean} isPlaying - Represents whether the video is playing.
 * @property {string} template - The HTML structure of the component.
 * @property {CanvasRenderingContext2D} _canvas - The canvas rendering context.
 * @property {Array<Array<{x: number, y: number, rgba: {r: number, g: number, b: number, a: number}}>>} _data - The data representing the frames of the video.
 */
export class CanvasPlayerElement extends HTMLElement {
  frameDuration = 1000 / 24; // 24fps
  currentFrame = 0;
  isPlaying = false;
  loading = false;

  template = template;
  _data = [];
  _canvas;
  _playInterval;

  constructor() {
    super();

    this.attachTemplate();
    this._canvas = this.shadowRoot.querySelector('canvas');

    // Binding methods to "this"
    this.prevFrame = this.prevFrame.bind(this);
    this.nextFrame = this.nextFrame.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.restart = this.restart.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  attachTemplate() {
    const templateEl = document.createElement('template');
    templateEl.innerHTML = this.template;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateEl.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.hasAttribute('demo')) {
      this.data = this.getFakeFramesData(120);
    }
    if (this.hasAttribute('loading')) {
      this.shadowRoot.querySelector('#loading-overlay').classList.add('loading');
    } else {
      this.shadowRoot.querySelector('#loading-overlay').classList.remove('loading');
    }
    this.bindEvents();
  }


  bindEvents() {
    const prevButton = this.shadowRoot.getElementById('prev-button');
    const nextButton = this.shadowRoot.getElementById('next-button');
    const playButton = this.shadowRoot.getElementById('play-button');
    const pauseButton = this.shadowRoot.getElementById('pause-button');
    const restartButton = this.shadowRoot.getElementById('restart-button');

    if (this._data.length > 0) {
      this.getVideoFrame(this._data[this.currentFrame]);
      pauseButton.setAttribute('disabled', "disabled");
      restartButton.setAttribute('disabled', "disabled");
      prevButton.setAttribute('disabled', "disabled");
    }

    prevButton.addEventListener('click', this.prevFrame);
    nextButton.addEventListener('click', this.nextFrame);
    playButton.addEventListener('click', this.play);
    pauseButton.addEventListener('click', this.pause);
    restartButton.addEventListener('click', this.restart);
  }

  getVideoFrame(frameData) {

    this._canvas.width = frameData.xSize;
    this._canvas.height = frameData.ySize;

    let ctx = this._canvas.getContext('2d');
    const imgData = ctx.createImageData(this._canvas.width, this._canvas.height);

    frameData.pixels.forEach(pixel => {
      let idx = (pixel.y * this._canvas.width + pixel.x) * 4;
      Object.assign(imgData.data, {
        [idx]: pixel.rgba.r,
        [idx + 1]: pixel.rgba.g,
        [idx + 2]: pixel.rgba.b,
        [idx + 3]: pixel.rgba.a * 255  // Assuming alpha is between 0-1
      });
    });

    ctx.putImageData(imgData, 0, 0);
  }

  get data() {
    return this._data;
  }

  set data(newVal) {
    this._data = newVal;
    if(this._data.length) this.makeVideo();
  }

  async makeVideo() {
    let frameIndex = 0;
    const drawNextFrame = () => {
      if (frameIndex != this._data.length - 1) {
        this.getVideoFrame(this._data[frameIndex++]);    
        setTimeout(drawNextFrame, this.frameDuration);
      }
    }
    drawNextFrame();
  }

  getFakeFramesData(numFrames) {
    const frameSize = { x: 100, y: 100 };

    const generateRandomRGBA = (multiplier) => ({
        r: Math.floor(Math.random() * 256 * multiplier),
        g: Math.floor(Math.random() * 256 * multiplier),
        b: Math.floor(Math.random() * 256 * multiplier),
        a: Math.random() * multiplier
    });

    const generatePixelsForFrame = (thisFrame) => Array(frameSize.y).fill(0).flatMap((_, y) => 
      Array(frameSize.x).fill(0).map((_, x) => ({
          x,
          y,
          rgba: generateRandomRGBA(thisFrame / numFrames)
      }))
    );

    return Array(numFrames).fill(0).map((_, i) => generatePixelsForFrame(i));
  }
  prevFrame() {
    if (this.currentFrame > 0) {
      this.currentFrame--;
      this.getVideoFrame(this._data[this.currentFrame]);
      this.shadowRoot.querySelector('#next-button').removeAttribute("disabled");
    } else {
      this.shadowRoot.querySelector('#prev-button').setAttribute("disabled", "disabled");
    }
  }

  nextFrame() {
    if (this.currentFrame < this._data.length - 1) {
      this.currentFrame++;
      this.getVideoFrame(this._data[this.currentFrame]);
      this.shadowRoot.querySelector('#restart-button').removeAttribute("disabled");
      this.shadowRoot.querySelector('#prev-button').removeAttribute("disabled");
    } else {
      this.shadowRoot.querySelector('#next-button').setAttribute("disabled", "disabled");
    }
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.shadowRoot.querySelector('#play-button').setAttribute("disabled", "disabled");
      this.shadowRoot.querySelector('#prev-button').setAttribute("disabled", "disabled");
      this.shadowRoot.querySelector('#next-button').setAttribute("disabled", "disabled");
      this.shadowRoot.querySelector('#pause-button').removeAttribute("disabled");
      this.shadowRoot.querySelector('#restart-button').removeAttribute("disabled");
  
      this._playInterval = setInterval(() => {
        if (this.currentFrame < this._data.length - 1) {
          this.getVideoFrame(this._data[this.currentFrame]);
          this.currentFrame++;
        } else {
          this.currentFrame = 0;
        }
      }, this.frameDuration); 
    }
  }
  
  pause() {
    if (this.isPlaying) {
      clearInterval(this._playInterval);
      this.isPlaying = false;
      this.shadowRoot.querySelector('#pause-button').setAttribute("disabled", "disabled");
      this.shadowRoot.querySelector('#play-button').removeAttribute("disabled");
      this.shadowRoot.querySelector('#prev-button').removeAttribute("disabled");
      this.shadowRoot.querySelector('#next-button').removeAttribute("disabled");
    }
  }
  
  restart() {
    clearInterval(this._playInterval);
    this.isPlaying = false;
    this.currentFrame = 0;
    this.getVideoFrame(this._data[this.currentFrame]);
    this.shadowRoot.querySelector('#pause-button').setAttribute("disabled", "disabled");
    this.shadowRoot.querySelector('#prev-button').setAttribute("disabled", "disabled");
    this.shadowRoot.querySelector('#next-button').removeAttribute("disabled");
    this.shadowRoot.querySelector('#play-button').removeAttribute("disabled");
  }
  

}



