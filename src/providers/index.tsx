import { createContext, splitProps, useContext, createResource, createSignal, Suspense, createEffect } from "solid-js";

import { initContract , initChat } from './init'

const DataContext = createContext();





export function ContractProvider(props) {


  const [contract, { mutate, refetch }] = createResource(initContract);

  createEffect(() => {
    if (contract.error){
      console.log('error', contract.error)
      throw contract.error
    }
  })


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataContext.Provider value={{contract, mutateContract: mutate, refetchContract: refetch }}>
        {props.children}
      </DataContext.Provider>
    </Suspense>
  );
}

// TODO use real type
export function useContract(): any { return useContext(DataContext); }

const ChatContext = createContext();

export function ChatProvider(props) {

  const { contract, mutateContract } = useContract();


  const chatHandler = (message, peerId, metadata) => mutateContract(state => {
    state.chat.push({message, peerId, metadata})
  })

  // console.log('contract asd', contract().contractAddress)

  const [chat, setChat] = createSignal({
    messages: []
  });

  // Use createEffect to initialize chat once contract is ready
  createEffect(() => {
    if (contract.ready) {
      const chatInst = initChat(contract().contractAddress, chatHandler);
      setChat(chatInst);
    }
  });

  return (
    <ChatContext.Provider value={chat}>
      {props.children}
    </ChatContext.Provider>
  );


}
// TODO use real type
export function useChat(): any { return useContext(ChatContext); }