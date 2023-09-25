
import { useContract } from "../providers";

export default function Votes() {

  const contractData = useContract();


  const reduceToInfo = (acc, pixel) => {
    const poolVotes = acc.poolVotes + pixel.moreToPool
    const thresholdVotes = acc.thresholdVotes + pixel.higherThreshold
    const addRowVotes = acc.addRowVotes + pixel.expandRow
    const addColumnVotes = acc.addColumnVotes + pixel.expandCol
    const addFrameVotes = acc.addFrameVotes + pixel.expandFrame
    const newEraVotes = acc.newEraVotes + pixel.newEra
    const tipVotes = acc.tipVotes + pixel.tip

    const totalPixels = acc.totalPixels + 1

    console.log('acc', acc, 'pixel', pixel)

    return {
      poolVotes, 
      totalPixels, 
      thresholdVotes, 
      addRowVotes,
      addColumnVotes,
      addFrameVotes,
      newEraVotes,
      tipVotes,
    }
  }

  return (
    <div class="tab-pane" id="votes" role="tabpanel">
      <div id="vote-info">
        {((data) => {
          if (data) {
            console.log('data', data  )
            const voteInfo = data.pixels.reduce(reduceToInfo, {
              poolVotes: 0,
              totalPixels: 0,
              thresholdVotes: 0,
              addRowVotes: 0,
              addColumnVotes: 0,
              addFrameVotes: 0,
              newEraVotes: 0,
              tipVotes: 0,
            })
            return (
              <div style="text-align: left">
                <div>Pool %: {voteInfo.poolVotes / voteInfo.totalPixels}</div>
                <div>Threshold %: {voteInfo.thresholdVotes / voteInfo.totalPixels}</div>
                <div>Add Row: {voteInfo.addRowVotes / voteInfo.totalPixels} -- ({ voteInfo.thresholdVotes ? voteInfo.addRowVotes / voteInfo.thresholdVotes : 0}% of threshold)</div>
                <div>Add Column: {voteInfo.addColumnVotes / voteInfo.totalPixels} -- ({voteInfo.thresholdVotes ? voteInfo.addColumnVotes / voteInfo.thresholdVotes: 0} % of threshold)</div>
                <div>Capture Frame: {voteInfo.addFrameVotes / voteInfo.totalPixels} -- ({voteInfo.thresholdVotes ?  voteInfo.addFrameVotes / voteInfo.thresholdVotes : 0} % of threshold)</div>
                <div>New Era: {voteInfo.newEraVotes / voteInfo.totalPixels} ({voteInfo.thresholdVotes ? voteInfo.newEraVotes  / voteInfo.thresholdVotes : 0} % of threshold)</div>
                <div>Tip %: {voteInfo.tipVotes / voteInfo.totalPixels}</div>
              </div>
            )
          } else {
            return <div>Loading...</div>
          }
        })(contractData())}
      </div>
    </div>
  );
}




