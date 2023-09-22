import { Suspense } from "solid-js";
import { useChat, ChatProvider } from "../providers";
import { createEffect, createSignal } from "solid-js";

export default function ChatWrapper() {

  return (
    <ChatProvider>
        <Chat />
    </ChatProvider>
  )

}


function Chat(){
    
  const { chat, messages, sendMessage } = useChat();

  let chatInput;


  // createEffect(() => {
  //   console.log('Messages changed: ', messages());
  // });

  return (
    <div class="tab-pane active" id="chat" role="tabpanel">
      <div id="chat-container">
        <div id="chat-messages">{
          messages() ? messages().map(message => (
            <div class="chat-message">
              <div class="chat-message-author">{JSON.stringify(message)}</div>
            </div>
          )) : <div>Loading...</div>
        }</div>
        {chat && <div id="chat-input-container">
          <input type="text" id="chat-input" placeholder="Enter your message here..." ref={chatInput} />
          <button id="chat-input-submit" onClick={() => sendMessage(chatInput)} disabled={!chat()}>Send</button>
        </div>}
      </div>
    </div>
  );
}