getFrames: async function() {
  console.log('Getting pixels from contract...', App.contractInstance, App.contracts.Pixel, App.contractInstance.address)

  const framesResponse = await App.web3Contract.getPastEvents('FrameCaptured',{
    fromBlock: 0,
    toBlock: 'latest',
  });
  App.framesData = framesResponse.map(frame => {
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
    console.log('token', result[0][0], result)
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

  App.setVideo();
  return frames
},


setPixelColor: function(x, y, rgba) {
  App.contractInstance.setPixelColor(x, y, rgba).then(function(result) {
    console.log('setPixelColor', result);
    App.getFrames();
  }).catch(function(err) {
    console.log(err.message);
  });
},

sellPixel: function(x, y, price) {
  return App.contractInstance.setPixelSalePrice(x, y, price)
    .then(function(result) {
      console.log('sellPixel', result);
      App.getFrames();
  }).catch(function(err) {
    console.log(err.message);
  });

},

toggleVote: function(x, y, topic) {
  return App.contractInstance.toggleVote(x, y, topic)
    .then(function(result) {
      console.log('toggleVote', result);
      App.getFrames();
  }).catch(function(err) {
    console.log(err.message);
  });
},



getPixels: async function() {
  const pixelCount = await App.contractInstance.getPixelCount.call();
  const pixels = Promise.all(Array(pixelCount).map(async function(_, i){
    const pixel = await App.contractInstance.getCurrentPixel.call(i);
    const owner = await App.contractInstance.ownerOf.call(i)
    return ({...pixel, owner});
  }));
  App.pixels = await pixels;
},