
import { useContract } from "../providers";

export default function Votes() {

  const contractData = useContract();


  const filterMyPixels = (pixel) => {
    return contractData().accounts.map(x => x.toUpperCase()).includes(pixel.owner.toUpperCase())
  };
  


  return (
    <div class="tab-pane" id="votes" role="tabpanel">
      <div id="vote-info">

      </div>
    </div>
  );
}




// setVoteInfo: function() {

//   const {
//     expandRow,
//     expandCol,
//     expandFrame,
//     higherThreshold,
//     moreToPool,
//     newEra,
//     tip
//   } = App.pixels.reduce(function(acc, pixel) {
//     if (pixel.owner === App.account) {
//       acc.expandRow += pixel.expandRow;
//       acc.expandCol += pixel.expandCol;
//       acc.expandFrame += pixel.expandFrame;
//       acc.higherThreshold += pixel.higherThreshold;
//       acc.moreToPool += pixel.moreToPool;
//       acc.newEra += pixel.newEra;
//     }
//     return acc;
//   }, {
//     expandRow: 0,
//     expandCol: 0,
//     expandFrame: 0,
//     higherThreshold: 0,
//     moreToPool: 0,
//     newEra: 0,
//     tip: 0
//   })

//   const voteInfo = document.getElementById('vote-info');
//   voteInfo.innerHTML = `
//     <span>Pool %: ${moreToPool / App.pixels.length}</span>
//     <span>Threshold %: ${higherThreshold / App.pixels.length}</span>
//     <span>Add Row: ${expandRow / App.pixels.length}</span>
//     <span>Add Column: ${expandCol / App.pixels.length}</span>
//     <span>Capture Frame: ${expandFrame / App.pixels.length}</span>
//     <span>New Era: ${newEra / App.pixels.length}</span>
//     <span>Tip %: ${tip / App.pixels.length}</span>
//   `;
    
// },

