// import { Suspense, splitProps } from "solid-js";

import './App.css'

import Header from './components/Header';
import CanvasPlayer from './components/CanvasPlayer';
import AccordionMenu from './components/AccordionMenu';


import { ContractProvider } from './providers'


const App = () => {

 

  return (
    <ContractProvider>
      <div class="container mt-4">
        <div class="row">
          <Header />
        </div>
        <div class="row" id="content-row">
            <CanvasPlayer />
          <AccordionMenu />
        </div>
      </div>
    </ContractProvider>
  );
}

export default App



