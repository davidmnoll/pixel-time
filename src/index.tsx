/** @jsxImportSource solid-js */
/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { CanvasPlayerElement } from './components/CanvasPlayer';

customElements.define('canvas-player', CanvasPlayerElement);

const root = document.getElementById('root')

render(() => <App />, root!)
