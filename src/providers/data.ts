export const fetchFrames =  async (web3, contractInstance) => {
  console.log('Getting pixels from contract...', contractInstance, contractInstance.address)

  const framesResponse = await contractInstance.getPastEvents('FrameCaptured',{
    fromBlock: 0,
    toBlock: 'latest',
  });
  const framesData = framesResponse.map(frame => {
    const pixels = frame.returnValues[0].map((token) => {
      return {
        x: parseInt(token.x),
        y: parseInt(token.y),
        rgba: token.rgba.map(x => parseInt(x)),
        salePrice: parseInt(token.salePrice),
        expandRow: token.expandRowVote,
        expandCol: token.expandColumnVote,
        expandFrame: token.expandFrameVote,
        moreToPool: token.moreToPoolVote,
        higherThreshold: token.higherThresholdVote,
        newEra: token.newEraVote,
        tip: token.tipVote,
      }
    })

    return [pixels, 
      frame.returnValues[1], 
      frame.returnValues[2], 
      frame.returnValues[3], 
      frame.returnValues[4]
    ];

  });
  
  return framesData
}



export const fetchPixels = async (web3, contractInstance) => {
  const pixelCount = await contractInstance.getPixelCount.call();
  const pixels = Promise.all(Array(pixelCount).map(async function(_, i){
    const pixel = await contractInstance.getCurrentPixel.call(i);
    const owner = await contractInstance.ownerOf.call(i)
    return ({...pixel, owner});
  }));
  return await pixels;
}

export const fetchEras = async (web3, contractInstance) => {

  
}