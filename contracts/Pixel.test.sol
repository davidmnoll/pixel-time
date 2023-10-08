
pragma solidity ^0.8.0;

import "./Pixel.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@ganache/console.log/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PixelTest is IERC721Receiver{
  PixelFrames pixelFrames;
  address creator;
  address contractAddress;


  function testPixels() public {
    (PixelFrames.PixelToken memory px, address owner) = pixelFrames.getCurrentPixel(0);
    console.log("px.x: %s", px.x);
    console.log("px.y: %s", px.y);
    console.log("owner: %s", owner);
    console.log("creator: %s", creator);
    console.log("sender", msg.sender);
    console.log("contractAddress", contractAddress);
    console.log("origin", tx.origin);
    require(px.x == 0, "x coordinate should be zero");
    require(px.y == 0, "y coordinate should be zero");
    require(owner == creator, "owner should be creator");
  }


  function setUp() public {
    pixelFrames = new PixelFrames();
    contractAddress = address(pixelFrames);
    creator = msg.sender;
  }

  function onERC721Received(
      address operator,
      address from,
      uint256 tokenId,
      bytes calldata data
    ) public returns (bytes4) {

      console.log("onERC721Received called");
      console.log("operator: %s, from: %s, tokenId: %s, data: %s");
      console.log(operator);
      console.log(from);
      console.log(tokenId);
      console.log(string(data));
    return IERC721Receiver.onERC721Received.selector;
  }
}