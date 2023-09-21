import { Web3, providers, AccountObject } from 'web3';
import type { AppState } from '../types';
import { fetchPixels } from './data';

declare global {
  interface Window {
    ethereum?: providers.Eip1193Provider;
  }
  interface crypto {
    getRandomValues: (array: Uint32Array) => Uint32Array;
  }
}




export const setPixelColor = (web3, contractInstance) => (x, y, rgba) => {
  contractInstance.setPixelColor(x, y, rgba).then(function(result) {
    console.log('setPixelColor', result);
  }).catch(function(err) {
    console.log(err.message);
  });
}

export const setPixelPrice = (web3, contractInstance) => (x, y, price) => {
  return contractInstance.setPixelSalePrice(x, y, price)
    .then(function(result) {
      console.log('sellPixel', result);
  }).catch(function(err) {
    console.log(err.message);
  });

}

export const toggleVote = (web3, contractInstance) => (x, y, topic) => {
  return contractInstance.toggleVote(x, y, topic)
    .then(function(result) {
      console.log('toggleVote', result);
  }).catch(function(err) {
    console.log(err.message);
  });
}

export const buyPixel = (web3, contractInstance) => async (x, y, price, account, options?) => {

  const thisPixelOptions = await fetchPixels(web3, contractInstance).then(pixels => {
    return pixels.filter(pixel => pixel.x === x && pixel.y === y)[0];
  }).then(pixel => {
    return {
      rgba: pixel.rgba,
      expandRow: pixel.expandRow,
      expandCol: pixel.expandColumn,
      expandFrame: pixel.expandFrame,
      moreToPool: pixel.moreToPool,
      higherThreshold: pixel.higherThreshold,
      newEra: pixel.newEra,
      tip: pixel.tip,
    }
  });

  const mergedOptions = {
    ...thisPixelOptions,
    ...(options || {}),
  }


  return contractInstance.buyPixel(
    x, 
    y, 
    options.rgba, 
    options.expandRow, 
    options.expandCol, 
    options.expandFrame, 
    options.moreToPool, 
    options.higherThreshold, 
    options.newEra, 
    options.tip, 
    {
      from: account, 
      value: price
    }).then(function(result) {
      console.log('buyPixel', result);
  }).catch(function(err) {
    console.log(err.message);
  });
}

export const seed = async (web3, contractInstance) => {
  Array(50).forEach(async (_, i) => {
    await contractInstance.toggleVote.call(0, "row");
    await contractInstance.toggleVote.call(0, "column");
    Array(i).forEach(async (_, j) => {
      contractInstance.buyPixel.call(i, j, [12 * (i+j % 20), 25 * (j % 10), 25 * (i % 10), (255-i)*255/50])
    })
  });
}


