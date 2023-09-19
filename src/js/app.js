
handleClick = function(x, y) {
  console.log('handleClick', x, y)
}


App = {


  init: async function(mock = false) {
    if (mock){
      App.account = '0x1234'
      App.contractInstance = mockContractInstance;
      await App.getFrames();
      await App.getPixels();
      App.setVoteInfo();
      App.setMyPixels();  
      App.setOtherPixels();  
      return App.bindEvents();

    } else {
      return await App.initWeb3().then(async function() {
        // Use our contract to retrieve and mark the adopted pets
        await App.initContract()
        console.log('contracts', App.contracts)
        const instance = await App.contracts.Pixel.deployed()
        console.log('instance', instance)
        App.contractInstance = instance;
        App.web3Contract = new web3.eth.Contract(App.contractInstance.abi, App.contractInstance.address);
        await App.getFrames();
        await App.getPixels();
        App.setVoteInfo();
        App.setMyPixels();  
        App.setOtherPixels();  
        App.bindEvents();
      });
    }

  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    App.account = web3.eth.accounts[0];
  },

  initContract: async function() {
    await $.getJSON('./PixelFrames.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PixelArtifact = data;
      App.contracts.Pixel = TruffleContract(PixelArtifact);
      console.log('here', App.contracts.Pixel)
    
      // Set the provider for our contract
      App.contracts.Pixel.setProvider(App.web3Provider);
    
    });

  },

  bindEvents: function() {
    console.log('bindEvents')
  },




  setVideo: function() {
    const canvasPlayer = document.getElementById('canvas-player');
    canvasPlayer.data = App.framesData;
  },

  setVoteInfo: function() {

    const {
      expandRow,
      expandCol,
      expandFrame,
      higherThreshold,
      moreToPool,
      newEra,
      tip
    } = App.pixels.reduce(function(acc, pixel) {
      if (pixel.owner === App.account) {
        acc.expandRow += pixel.expandRow;
        acc.expandCol += pixel.expandCol;
        acc.expandFrame += pixel.expandFrame;
        acc.higherThreshold += pixel.higherThreshold;
        acc.moreToPool += pixel.moreToPool;
        acc.newEra += pixel.newEra;
      }
      return acc;
    }, {
      expandRow: 0,
      expandCol: 0,
      expandFrame: 0,
      higherThreshold: 0,
      moreToPool: 0,
      newEra: 0,
      tip: 0
    })

    const voteInfo = document.getElementById('vote-info');
    voteInfo.innerHTML = `
      <span>Pool %: ${moreToPool / App.pixels.length}</span>
      <span>Threshold %: ${higherThreshold / App.pixels.length}</span>
      <span>Add Row: ${expandRow / App.pixels.length}</span>
      <span>Add Column: ${expandCol / App.pixels.length}</span>
      <span>Capture Frame: ${expandFrame / App.pixels.length}</span>
      <span>New Era: ${newEra / App.pixels.length}</span>
      <span>Tip %: ${tip / App.pixels.length}</span>
    `;
      
  },


  setMyPixels: function() {
    const myPixels = App.pixels.filter(pixel => pixel.owner === App.account);
    console.log('myPixels', myPixels, App.pixels)
    if (myPixels){
      const myPixelsEl = document.getElementById('myPixels');
      myPixelsEl.innerHTML = '';
      myPixels.forEach(function(pixel) {
        const pixelEl = document.createElement('my-pixel');
        pixelEl.setAttribute('x-coordinate', pixel.x);
        pixelEl.setAttribute('y-coordinate', pixel.y);
        pixelEl.setAttribute('color', pixel.rgba);
        pixelEl.setAttribute('color-change-button', 'Change Color');
        pixelEl.setAttribute('estimate-gas-button', 'Estimate Gas');
        pixelEl.setAttribute('expand-x-button', 'Expand X');
        pixelEl.setAttribute('expand-y-button', 'Expand Y');
        pixelEl.setAttribute('expand-frame-button', 'Expand Frame');
        pixelEl.setAttribute('higher-threshold', 'Threshold');
        pixelEl.setAttribute('more-to-pool', 'More to Pool');
        myPixelsEl.appendChild(pixelEl);
      });  
    } else {
      myPixelsEl.innerHTML = `You do not have any pixels.  Please see
        <a class="nav-link" id="info-tab" data-toggle="tab" href="#info" role="tab">the disclaimer and instructions before participating</a>
      `;
    }
  },

  setOtherPixels: function() {
    const otherPixels = App.pixels.filter(pixel => pixel.owner !== App.account);
    console.log('otherPixels', otherPixels, App.pixels)
    const otherPixelsEl = document.getElementById('otherPixels');
    otherPixelsEl.innerHTML = '';
    otherPixels.forEach(function(pixel) {
      const pixelEl = document.createElement('other-pixel');
      pixelEl.setAttribute('x-coordinate', pixel.x);
      pixelEl.setAttribute('y-coordinate', pixel.y);
      pixelEl.setAttribute('color', pixel.rgba);
      pixelEl.setAttribute('color-change-button', 'Change Color');
      pixelEl.setAttribute('estimate-gas-button', 'Estimate Gas');
      pixelEl.setAttribute('expand-x-button', 'Expand X');
      pixelEl.setAttribute('expand-y-button', 'Expand Y');
      pixelEl.setAttribute('expand-frame-button', 'Expand Frame');
      pixelEl.setAttribute('higher-threshold', 'Threshold');
      pixelEl.setAttribute('more-to-pool', 'More to Pool');
      otherPixelsEl.appendChild(pixelEl);
    });
  },
  
  initChat: async function() {
    const config = {appId: 'san_narciso_3d'}
    const room = joinRoom(config, 'yoyodyne')
    room.onPeerJoin(peerId => console.log(`${peerId} joined`))
    const [sendChat, getChat] = room.makeAction('chat');
    
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;
    console.log('message', message)
    chatInput.value = '';

    const sendChatMessage = (message) => {
      sendChat({ message })
    }

    const chatSendButton = document.getElementById('chat-input-submit');
    chatSendButton.addEventListener('click', sendChatMessage);

    getChat((data, peerId) =>{
      if (!App.blockedPeers.includes(peerId)) {
        App.chatMessages.push({...data, peerId});
        App.setChatMessages();
      }
    })
    
  },

  setChatMessages: function() {
    const chatMessagesEl = document.getElementById('chat-messages');
    chatMessagesEl.innerHTML = '';
    App.chatMessages.forEach(function(message) {
      const messageEl = document.createElement('div');
      messageEl.textContent = message.payload;
      chatMessagesEl.appendChild(messageEl);
    });
  },

  sendChatMessage: function() {

  }

};




