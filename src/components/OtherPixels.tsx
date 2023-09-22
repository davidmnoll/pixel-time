
import { useContract } from "../providers";


// setOtherPixels: function() {
//   const otherPixels = App.pixels.filter(pixel => pixel.owner !== App.account);
//   console.log('otherPixels', otherPixels, App.pixels)
//   const otherPixelsEl = document.getElementById('otherPixels');
//   otherPixelsEl.innerHTML = '';
//   otherPixels.forEach(function(pixel) {
//     const pixelEl = document.createElement('other-pixel');
//     pixelEl.setAttribute('x-coordinate', pixel.x);
//     pixelEl.setAttribute('y-coordinate', pixel.y);
//     pixelEl.setAttribute('color', pixel.rgba);
//     pixelEl.setAttribute('color-change-button', 'Change Color');
//     pixelEl.setAttribute('estimate-gas-button', 'Estimate Gas');
//     pixelEl.setAttribute('expand-x-button', 'Expand X');
//     pixelEl.setAttribute('expand-y-button', 'Expand Y');
//     pixelEl.setAttribute('expand-frame-button', 'Expand Frame');
//     pixelEl.setAttribute('higher-threshold', 'Threshold');
//     pixelEl.setAttribute('more-to-pool', 'More to Pool');
//     otherPixelsEl.appendChild(pixelEl);
//   });
// },



export default function OtherPixels() {


  const contractData = useContract();


  const filterOtherPixels = (pixel) => {
    return !contractData().accounts.map(x => x.toUpperCase()).includes(pixel.owner.toUpperCase())
  };
  
 
  return (

      <div id="other-pixels">
        <div id="other-pixels-header">
          Test
        </div>
        {contractData() && <div id="other-pixels-body">
          {contractData().pixels.filter(filterOtherPixels).map(pixel => (
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
