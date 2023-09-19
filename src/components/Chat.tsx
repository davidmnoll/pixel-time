// Chat.jsx
export default function Chat() {
  return (
    <div class="tab-pane active" id="chat" role="tabpanel">
      <div id="chat-container">
        <div id="chat-messages"></div>
        <div id="chat-input-container">
          <input type="text" id="chat-input" placeholder="Enter your message here..." />
          <button id="chat-input-submit">Send</button>
        </div>
      </div>
    </div>
  );
}