import { Suspense } from "solid-js";
import { useChat, ChatProvider } from "../providers";
import { createEffect } from "solid-js";

export default function ChatWrapper() {

  return (
      <ChatProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Chat />
        </Suspense>
      </ChatProvider>
  )
}


function Chat(){

  const chat = useChat();
  console.log('chat', chat.status)



  return (
    <div class="tab-pane active" id="chat" role="tabpanel">
      <div id="chat-container">
        <div id="chat-messages">{
          chat().messages.map(message => (
            <div class="chat-message">
              <div class="chat-message-author">{message.author}</div>
              <div class="chat-message-text">{message.text}</div>
            </div>
          ))
        }</div>
        <div id="chat-input-container">
          <input type="text" id="chat-input" placeholder="Enter your message here..." />
          <button id="chat-input-submit">Send</button>
        </div>
      </div>
    </div>
  );
}