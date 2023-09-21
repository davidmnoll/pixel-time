export const fetchFrames =  async (web3, contractInstance) => {
  console.log('Getting pixels from contract...', contractInstance, contractInstance.address)

  const framesResponse = await contractInstance.getPastEvents('FrameCaptured',{
    fromBlock: 0,
    toBlock: 'latest',
  });
  const framesData = framesResponse.map(frame => {
    console.log('frame', frame)
    const result = web3.eth.abi.decodeLog([
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "x",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "y",
              "type": "uint256"
            },
            {
              "internalType": "uint8[4]",
              "name": "rgba",
              "type": "uint8[4]"
            },
            {
              "internalType": "uint256",
              "name": "salePrice",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "expandRowVote",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "expandColumnVote",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "expandFrameVote",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "moreToPoolVote",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "higherThresholdVote",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "newEraVote",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "tipVote",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "struct PixelFrames.PixelToken[]",
          "name": "",
          "type": "tuple[]"
        },'uint256','uint256','uint256','uint256'], frame.data);
    console.log('token', result)
    const pixels = result[0].map((token) => {
      return {
        x: web3.utils.toNumber(token.x),
        y: web3.utils.toNumber(token.y),
        rgba: token.rgba.map(x => web3.utils.toNumber(x)),
        salePrice: web3.utils.toNumber(token.salePrice),
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
      web3.utils.toNumber(result[1]), 
      web3.utils.toNumber(result[2]), 
      web3.utils.toNumber(result[3]), 
      web3.utils.toNumber(result[4])
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