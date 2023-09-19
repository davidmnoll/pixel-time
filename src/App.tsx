import './App.css'

import { createSignal, createEffect } from "solid-js";
import Header from './components/Header';
import CanvasPlayer from './components/CanvasPlayer';
import TabMenu from './components/TabMenu';


const App = () => {

  const [data, setData] = createSignal({

  });

  createEffect(() => {
    // getData();
    seed();

  })

  const toggleVote = async (id, type) => {
    const vote = await App.toggleVote(id, type);
    setData({ ...data, vote });
  }

  const buyPixel = async (x, y, color) => {
    const pixel = await App.buyPixel(x, y, color);
    setData({ ...data, pixel });
  }

  const seed = async () => {
    Array(50).forEach(async (_, i) => {
      await App.toggleVote(0, "row");
      await App.toggleVote(0, "column");
      Array(i).forEach(async (_, j) => {
        App.buyPixel(i, j, [12 * (i+j % 20), 25 * (j % 10), 25 * (i % 10), (255-i)*255/50])
      })
    });
  }


  return (
    <div class="container mt-4">
      <div class="row">
        <Header />
      </div>
      <div class="row" id="content-row">
        <CanvasPlayer />
        <TabMenu />
      </div>
    </div>
  );
}

export default App

// $(function() {
//   $(window).load(async function() {
//     await App.init();
//     await seed(App);
//   });
// });

