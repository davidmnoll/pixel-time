
import { createEffect } from "solid-js";
import { useContract } from "../providers";



// setMyPixels: function() {
//   const myPixels = App.pixels.filter(pixel => pixel.owner === App.account);
//   console.log('myPixels', myPixels, App.pixels)
//   if (myPixels){
//     const myPixelsEl = document.getElementById('myPixels');
//     myPixelsEl.innerHTML = '';
//     myPixels.forEach(function(pixel) {
//       const pixelEl = document.createElement('my-pixel');
//       pixelEl.setAttribute('x-coordinate', pixel.x);
//       pixelEl.setAttribute('y-coordinate', pixel.y);
//       pixelEl.setAttribute('color', pixel.rgba);
//       pixelEl.setAttribute('color-change-button', 'Change Color');
//       pixelEl.setAttribute('estimate-gas-button', 'Estimate Gas');
//       pixelEl.setAttribute('expand-x-button', 'Expand X');
//       pixelEl.setAttribute('expand-y-button', 'Expand Y');
//       pixelEl.setAttribute('expand-frame-button', 'Expand Frame');
//       pixelEl.setAttribute('higher-threshold', 'Threshold');
//       pixelEl.setAttribute('more-to-pool', 'More to Pool');
//       myPixelsEl.appendChild(pixelEl);
//     });  
//   } else {
//     myPixelsEl.innerHTML = `You do not have any pixels.  Please see
//       <a class="nav-link" id="info-tab" data-toggle="tab" href="#info" role="tab">the disclaimer and instructions before participating</a>
//     `;
//   }
// },


export default function MyPixels() {


  const contractData = useContract();


  const filterMyPixels = (pixel) => {
    return contractData().accounts.map(x => x.toUpperCase()).includes(pixel.owner.toUpperCase())
  };
  

  return (
      <div id="my-pixels">
        <div id="my-pixels-header">
          Test
        </div>
          {contractData() && <div id="my-pixels-body">
            {contractData().pixels.filter(filterMyPixels).map(pixel => (
              <div class="card mb-3">
                <div class="card-body">
                  {JSON.stringify(pixel)}
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
}
