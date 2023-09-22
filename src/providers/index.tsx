import { createContext, splitProps, useContext, createResource, createSignal, Suspense, createEffect } from "solid-js";

import { initContract , initChat } from './init'

const ContractContext = createContext();





export function ContractProvider(props) {


  const [contractValue, setContractValue] = createSignal(null);

  createEffect(() => {
    initContract().then(contract => {
      setContractValue(prevValue => contract);
    })
  })


  return (
    <ContractContext.Provider value={contractValue}>
      {props.children}
    </ContractContext.Provider>
  );
}

// TODO use real type
export function useContract(): any { return useContext(ContractContext); }





const ChatContext = createContext();

export function ChatProvider(props) {

  const contract = useContract();

  const [chatMessages, setChatMessages] = createSignal([]);

  const chatHandler = (message, peerId, metadata) => setChatMessages(prev => {
    // console.log('chatHandler', prev, message)
    return [...prev, {message, peerId, metadata}]
  })

  const [chatValue, setChatValue] = createSignal(null);

  createEffect(() => {
    if (contract() && contract().contractAddress) {
      setChatValue(prevValue => initChat(contract().contractAddress, chatHandler));
    }
    // if (chatMessages){
    //   console.log('chat messages', chatMessages())
    // }
  })

  const sendMessage = (ref) => {
    // console.log('messasge sent', chatMessages, ref.value, chatValue)
    chatValue ? chatValue().sendChat(ref.value) : console.log("chat not ready");
    ref.value = '';
  }


  return (
    <ChatContext.Provider value={{ chat: chatValue, messages: chatMessages, sendMessage}}>
      {props.children}
    </ChatContext.Provider>
  );


}
// TODO use real type
export function useChat(): any { return useContext(ChatContext); }