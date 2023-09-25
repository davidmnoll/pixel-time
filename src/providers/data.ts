

const parseFrameResponse = (frame) => {
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
  
}


export const fetchPixels = async (web3, contractInstance) => {
  console.log('Getting Pixels from contract...')
  const pixelCount = await contractInstance.getPixelCount.call();
  console.log('here', pixelCount)
  const pixelPromiseMap = Array(web3.utils.toNumber(pixelCount)).fill(0).map(async function(_, i){
    console.log('pixel', i)
    const result = await contractInstance.getCurrentPixel.call(i);
    const pixel = result[0];
    const owner = result[1];
    console.log('pixelData', pixel, owner)
    return ({
      x: parseInt(pixel.x),
      y: parseInt(pixel.y),
      rgba: pixel.rgba.map(x => parseInt(x)),
      salePrice: parseInt(pixel.salePrice),
      expandRow: pixel.votes[0],
      expandCol: pixel.votes[1],
      expandFrame: pixel.votes[2],
      moreToPool: pixel.votes[3],
      higherThreshold: pixel.votes[4],
      newEra: pixel.votes[5],
      tip: pixel.votes[6],
      owner,
      id: i,
    });
  })
  console.log('pixelPromiseMap', pixelPromiseMap)
  const pixels = await Promise.all(pixelPromiseMap);
  return await pixels;
}

export const fetchEras = async (web3, contractInstance) => {
  console.log('Getting Eras from contract...')

  const erasResponse = await contractInstance.getPastEvents('NewEra',{
    fromBlock: 0,
    toBlock: 'latest',
  });


  const [finishedEras, currentEraStart] = await erasResponse.reduce(async (accPromise, curr) => {

    const acc = await accPromise;

    const framesResponse = await contractInstance.getPastEvents('FrameCaptured',{
      fromBlock: acc[1],
      toBlock: curr.blockNumber,
    });
  
    const framesData = framesResponse.map(parseFrameResponse);

    return [acc[0].concat(framesData), curr.blockNumber];
  }, [[], 0]);


  const currentEraFramesResponse = await contractInstance.getPastEvents('FrameCaptured',{
    fromBlock: currentEraStart,
    toBlock: 'latest',
  });


  const currentFramesData = currentEraFramesResponse.map(parseFrameResponse);

  return [...finishedEras, currentFramesData];

}
