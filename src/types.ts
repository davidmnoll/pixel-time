import { Room } from 'trystero'

export { 
  Room as TrysteroRoom
}

export interface Pixel {
  x: number,
  y: number,
  rgba: [number, number, number, number],
  salePrice: number,
  expandRow: boolean,
  expandCol: boolean,
  expandFrame: boolean,
  moreToPool: boolean,
  higherThreshold: boolean,
  newEra: boolean,
  tip: boolean,
}

export interface Frame {
  pixels: Pixel[],
  xSize: number,
  ySize: number,
  frameNumber: number,
  framePrice: number,
}

export interface Message {
  id: string,
  topic: string,
  message: string,
  sender: string,
  timestamp: number,
}


export type AppState = any;
// export interface AppState {
//   web3Provider: Web3,
//   truffleContract: any,
//   web3Contract: any,
//   contractInstance: any,
//   pixels: Pixel[],
//   currentFrame: number,
//   frameXSize: number,
//   frameYSize: number,
//   playInterval: number,
//   framesData: Frame[],
//   accounts: AccountObject[],
//   selectedAccount: number,
//   chatId: string,
//   chatTopic: string,
//   chatRoom: Room,
//   chatMessages: Message[],
//   blockedPeers: string[],
// }
