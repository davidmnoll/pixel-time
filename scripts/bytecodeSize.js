
const MyContract = artifacts.require("PixelFrames");

module.exports = async (callback) => {
  try {
    const bytecodeSize = (MyContract.bytecode.length / 2) - 1;
    console.log("Bytecode Size:", bytecodeSize);
  } catch (error) {
    console.error(error);
  }
  callback();
};