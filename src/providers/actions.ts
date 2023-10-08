import { providers} from 'web3';
// import type { AppState } from '../types';
import { fetchPixels } from './data';

declare global {
  interface Window {
    ethereum?: providers.Eip1193Provider;
  }
  interface crypto {
    getRandomValues: (array: Uint32Array) => Uint32Array;
  }
}




export const setPixelColor = (_web3: any, contractInstance: any) => (id: number, rgba: [number, number, number, number], options: any = {}) => {
  contractInstance.setPixelColor(id, rgba, options).then(function(result) {
    console.log('setPixelColor', result);
  }).catch(function(err: Error) {
    console.log(err.message);
  });
}

export const setPixelPrice = (_web3: any, contractInstance: any) => (id: number, price: number, options: any = {}) => {
  return contractInstance.setPixelSalePrice(id, price, options)
    .then(function(result) {
      console.log('sellPixel', result);
  }).catch(function(err: Error) {
    console.log(err.message);
  });

}

export const toggleVote = (_web3: any, contractInstance: any) => (id: number, topic: number, options: any = {}) => {
  return contractInstance.toggleVote(id, topic, options)
    .then(function(result) {
      console.log('toggleVote', result);
  }).catch(function(err: Error) {
    console.log(err.message);
    console.trace();
  });
}

export const buyPixel = (web3: any, contractInstance: any) => async (id: number, pixelOptions: any, buyOptions: any = {}) => {

  const thisPixelOptions = await fetchPixels(web3, contractInstance).then(pixels => {
    return pixels[id];
  }).then(pixel => {
    return {
      rgba: pixel.rgba,
      salePrice: pixel.salePrice,
      expandRow: pixel.expandRow,
      expandCol: pixel.expandCol,
      expandFrame: pixel.expandFrame,
      moreToPool: pixel.moreToPool,
      higherThreshold: pixel.higherThreshold,
      newEra: pixel.newEra,
      tip: pixel.tip,
    }
  });

  const mergedOptions = {
    ...thisPixelOptions,
    ...(pixelOptions || {}),
  }


  return contractInstance.buyPixel(
    id, 
    mergedOptions.rgba, 
    mergedOptions.salePrice, 
    [
      mergedOptions.expandRow,
      mergedOptions.expandCol,
      mergedOptions.expandFrame,
      mergedOptions.moreToPool,
      mergedOptions.higherThreshold,
      mergedOptions.newEra,
      mergedOptions.tip,
    ],
    {
      ...buyOptions
    }).then(function(result) {
      console.log('buyPixel', result);
  }).catch(function(err: Error) {
    console.log(err.message);
  });
}

export const seed = async (_web3: any, contractInstance: any) => {
  Array(50).forEach(async (_, i) => {
    await contractInstance.toggleVote.call(0, "row");
    await contractInstance.toggleVote.call(0, "column");
    Array(i).forEach(async (_, j) => {
      contractInstance.buyPixel.call(i, j, [12 * (i+j % 20), 25 * (j % 10), 25 * (i % 10), (255-i)*255/50])
    })
  });
}


