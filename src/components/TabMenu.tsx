import { Tab, Tabs } from 'solid-bootstrap'
import Chat from './Chat'
import MyPixels from './MyPixels'
import OtherPixels from './OtherPixels'
import Votes from './Votes'
import Info from './Info'

function TabMenu() {




  return (
    <Tabs
      defaultActiveKey="chat"
      id="tab-menu"
      class="mb-3"
    >
      <Tab eventKey="chat" title="Chat">
        <Chat />
      </Tab>
      <Tab eventKey="myPixels" title="My Pixels">
        <MyPixels />
      </Tab>
      <Tab eventKey="otherPixels" title="Other Pixels">
        <OtherPixels />
      </Tab>
      <Tab eventKey="votes" title="Votes">
        <Votes />
      </Tab>
      <Tab eventKey="info" title="Info">
        <Info />
      </Tab>
    </Tabs>
  );
}

export default TabMenu;

