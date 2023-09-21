/**
 * Generates fake frame data for a given number of frames.
 * 
 * @function
 * @param {number} numFrames - The number of frames to generate.
 * @returns {Array<Array<{x: number, y: number, rgba: {r: number, g: number, b: number, a: number}}>>} An array of frames, where each frame is an array of pixel data objects.
 */
const getFakeFramesData = (numFrames: number) => {
  const frames = [];
  
  for (let i = 0; i < numFrames; i++) {
    const frame = [];
    
    for (let j = 0; j < 1000; j++) { // assuming each frame has 1000 pixels
      frame.push(getFakePixelData(j));
    }
    
    frames.push(frame);
  }
  
  return frames;
};


const getFakePixelData = (i: number) => [
    [{c:255}, {c:0}, {c:0}, {c:255}],
    {c: i % 100},
    {c: Math.floor(i / 100)},
    false,
    false,
    false,
    false,
    false
  ]


const mockContractInstance = {

  getPastFrames: async () => getFakeFramesData(30),
  getPixelCount: async () => 1000,
  getCurrentPixel: async (i: number) => {
    console.log('getPixel', i)
    return new Promise(() => getFakePixelData(i))
  },
  setPixelColor: async (x: number, y: number, rgba: [number, number, number, number]) => console.log('setPixelColor', x, y, rgba),

}
