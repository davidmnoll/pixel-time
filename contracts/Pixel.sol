// SPDX-License-Identifier: MIT
  /**
   * @title PixelTime
   * @dev PixelTime
   * @custom:dev-run-script ./src/scripts/deploy.ts
   */

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@ganache/console.log/console.sol";

contract PixelFrames is ERC721 {
  using SafeMath for uint256;

  event PixelColorChanged(uint256 pixelId, uint8[4] rgba);
  event FrameCaptured(PixelToken[] frame, uint256 xSize, uint256 ySize, uint256 balanceDisbursed, uint256 numPixels);
  event NewEra();

  struct PixelToken {
    uint256 x;
    uint256 y;
    uint8[4] rgba; // [r, g, b, a]
    uint256 salePrice;
    bool[8] votes;
  }

  uint256 maxRowIndex = 0;
  uint256 maxColIndex = 0;

  PixelToken[] public pixels;  
  mapping(uint256 => uint256) public pixelIdByPositionHash;


  constructor() ERC721("PixelToken", "PX") {

    _mintPixel(0, 0, [0,255,255,255], [false,false,false,false,false,false,false,false]);
    
    // emit PixelBought(msg.sender, pixelId);
    emit FrameCaptured(_getCurrentFrame(), 1, 1, 0, 1);

  }

  function _mintPixel(
    uint256 x, 
    uint256 y, 
    uint8[4] memory rgba,
    bool[8] memory votes
    ) private returns (uint256) {
      
    PixelToken memory newPixel = PixelToken({x: x, y: y, rgba: rgba, salePrice: 0, votes: votes});
    pixels.push(newPixel);
    uint256 pixelId = pixels.length - 1;
    console.log("minting pixel to %s" , msg.sender);
    console.log("tx.origin %s" , tx.origin);
    _safeMint(msg.sender, pixelId);
    return pixelId;
  }

  function computePositionHash(uint256 x, uint256 y) private pure returns (uint256) {
    bytes32 hash = keccak256(abi.encodePacked(x, y));
    return uint256(hash);
  }

  function computeCost() private pure returns (uint256) {
    return 0.001 ether;
  }
  

  function buyPixel(
    uint256 x, 
    uint256 y, 
    uint256 salePrice,
    uint8[4] memory rgba, 
    bool[8] memory votes
    ) public payable returns (uint256) {

    require(x <= maxRowIndex, "Pixel out of bounds (x)");
    require(y <= maxColIndex, "Pixel out of bounds (y)");
    require(msg.value >= computeCost(), "Not enought money sent");

    uint256 pixelHash = computePositionHash(x, y);
    uint256 pixelId = pixelIdByPositionHash[pixelHash];
    if(pixelId > 0) {
      require(ownerOf(pixelId) != address(0), "Pixel owner not found");
      require(pixels[pixelId].salePrice > 0, "Pixel not for sale");
      require(msg.value == pixels[pixelId].salePrice, "Sent ether not equal to sale price");

      // set sale price to 0

      uint256 totalPoolVotes = _getVoters(3); 
      uint256 poolShare = (msg.value * totalPoolVotes) / pixels.length;

      uint256 ownerShare = msg.value - poolShare;
      payable(ownerOf(pixelId)).transfer(ownerShare);

      // Transfer ownership of pixel
      _safeTransfer(ownerOf(pixelId), msg.sender, pixelId, "");

      pixels[pixelId].salePrice = salePrice;
      pixels[pixelId].rgba = rgba;
      pixels[pixelId].votes = votes;
      // emit PixelSold(msg.sender, pixelId);

    } else {
      require(ownerOf(pixelId) == address(0), "Pixel owner found");
        
      PixelToken memory newPixel = PixelToken({
        x: x,
        y: y,
        rgba: rgba,
        salePrice: 0,
        votes: votes
      });

      pixels.push(newPixel);


      pixelId = pixels.length - 1;
      pixelIdByPositionHash[pixelHash] = pixelId;

      _safeMint(msg.sender, pixelId, "");

    }

    return pixelId;
  }


  function setPixelSalePrice(uint256 pixelId, uint256 _salePrice) public {
    require(ownerOf(pixelId) == msg.sender, "Not the owner of this pixel");
    pixels[pixelId].salePrice = _salePrice;
  }

  function setPixelColor(uint256 pixelId, uint8[4] memory rgba) public {
    require(ownerOf(pixelId) == msg.sender, "Not the owner of this pixel");
    pixels[pixelId].rgba = rgba;
    emit PixelColorChanged(pixelId, rgba);
  }
  
  function toggleVote(uint256 pixelId, uint8 topic) public {

    // TODO: avoid any hacking

    console.log("toggleVote", pixelId, topic);

    require(ownerOf(pixelId) == msg.sender, "Not the owner of this pixel");
    require(topic < 8, "Topic out of bounds");
    pixels[pixelId].votes[topic] = !pixels[pixelId].votes[topic];

    bool isTopicVote = topic < 3 || topic == 5;

    if(isTopicVote && _isThreshold(topic)){
      if(topic == 0) {
        maxRowIndex++;
      }else if(topic == 1){
        maxColIndex++;
      }else if(topic == 2){
        (uint256 balanceDisbursed, uint256 totalPixels) = distributePoolRewards();
        emit FrameCaptured(pixels, maxRowIndex + 1, maxColIndex + 1, balanceDisbursed, totalPixels);
      }else if(topic == 5){
        _clearCanvas();
        emit NewEra();
      }
      _resetVotes(topic);
    }
  }

  function _clearCanvas() private {
    for (uint256 i = 1; i <= pixels.length; i++) {
      pixels[i].rgba = [0,0,0,0];
    }
  }

  function _resetVotes(uint8 topic) private {
    // TODO: avoid any hacking
    for (uint256 i = 1; i <= pixels.length; i++) {
      pixels[i].votes[topic] = false;
    }
  }



  function distributePoolRewards() public returns(uint256, uint256) {
 
    //TODO actually calculate the pool rewards
    uint256 totalReward = address(this).balance.mul(1).div(10);
    uint256 reward = totalReward.div(pixels.length);
    for(uint256 i = 0; i < pixels.length; i++) {
      payable(ownerOf(i)).transfer(reward);
    }
    return (totalReward, reward);
  }


  function _isThreshold(uint8 topic) private view returns(bool) {
    // TODO: avoid any hacking
    require(topic < 3 || topic == 5, "Topic out of bounds");
    uint256 topicVoters = _getVoters(topic);
    uint256 thresholdVoters = _getVoters(4);
    return topicVoters >= thresholdVoters;
  }


  function _getVoters(uint8 topic) private view returns(uint256) {
    uint256 count = 0;
    for(uint256 i = 0; i < pixels.length; i++) {
      if(pixels[i].votes[topic]) {
        count++;
      }
    }
    return count;
  }
 

  function getPixelCount() public view returns (uint256) {
    return pixels.length;
  }
 
  function getCurrentPixel(uint256 pixelIndex) public view returns (PixelToken memory, address) {
    return (pixels[pixelIndex], ownerOf(pixelIndex));
  }

  function _getCurrentFrame() public view returns (PixelToken[] memory) {
    return pixels;
  }


}