import { Web3, providers, AccountObject } from 'web3';
import type { AppState } from '../types';
import {joinRoom} from 'trystero'
import * as ContractData from '../../build/contracts/PixelFrames.json';
import TruffleContract from '@truffle/contract';
import { fetchEras } from './data'
import { fetchPixels } from './data'
import {
  setPixelColor as setPixelColorAction,
  setPixelPrice as setPixelPriceAction,
  buyPixel as buyPixelAction,
  toggleVote as toggleVoteAction
} from './actions'

export const initContract = async (): Promise<AppState> => {

  console.log("init")
  const [web3, accounts] = await getWeb3();
  const contractInstance = await getContract(web3);


  const eras = await fetchEras(web3, contractInstance);
  const currentEra = eras.pop();
  const pastEras = [...eras];
  console.log('eras', eras, eras.length, currentEra)

  const pixels = await fetchPixels(web3, contractInstance);

  const toggleVote = toggleVoteAction(web3, contractInstance);
  const setPixelColor = setPixelColorAction(web3, contractInstance);
  const setPixelPrice = setPixelPriceAction(web3, contractInstance);
  const buyPixel = buyPixelAction(web3, contractInstance);

  const contractAddress = contractInstance.address;

  return {
    contractAddress,
    pastEras,
    currentEra,
    pixels,
    toggleVote,
    setPixelColor,
    setPixelPrice,
    buyPixel,
    accounts,
  }
}


export const initChat = (address, chatHandler) => {
  console.log('here')
  const room = joinRoom({
    appId: address,
  }, 'chat');

  const [sendChatRaw, getChat] = room.makeAction("chat");

  const blockChatter = (peerId) => {
    const blockedChatters = localStorage.getItem('blockedChatters') ? JSON.parse(localStorage.getItem('blockedChatters')) : [];
    localStorage.setItem('blockedChatters', JSON.stringify([...blockedChatters, peerId]));
  }

  const unblockChatter = (peerId) => {
    const blockedChatters = localStorage.getItem('blockedChatters') ? JSON.parse(localStorage.getItem('blockedChatters')) : [];
    localStorage.setItem('blockedChatters', JSON.stringify(blockedChatters.filter(id => id !== peerId)));
  }

  getChat((message, peerId, metadata) => {
    const blockedChatters = localStorage.getItem('blockedChatters') ? JSON.parse(localStorage.getItem('blockedChatters')) : [];
    if (blockedChatters.includes(peerId)) return;
    console.log('chat', message, peerId, metadata)
    chatHandler(message, peerId, metadata);
  });

  const sendChat = (message) => {
    console.log('test', message)
    sendChatRaw(message);
    chatHandler(message, 'self', {});
  }

  return {sendChat, blockChatter, unblockChatter};
}

export const notInitialized = function (...any) {
  console.log('arguments', arguments)
  throw new Error(`${arguments.callee.toString()} called before initialization`);
}

export const getContract = async (web3) => {
  // Get the necessary contract artifact file and instantiate it with @truffle/contract
  const contract = TruffleContract(ContractData);
  contract.setProvider(web3.currentProvider);
  const instance = await contract.deployed();
  return instance;
}


export const getWeb3 = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return [new Web3(window.ethereum), accounts];
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
    }

  // If no injected web3 instance is detected, fall back to Ganache
  else {
    const provider = new Web3.providers.HttpProvider('http://localhost:7545');
    const web3 = new Web3(provider);
    return [web3, web3.eth.accounts];
  }

}