import { Accordion } from 'solid-bootstrap'
import Chat from './Chat'
import MyPixels from './MyPixels'
import OtherPixels from './OtherPixels'
import Votes from './Votes'
import History from './History'
import Info from './Info'

function AccordionMenu() {

 
  return (
    <Accordion
      defaultActiveKey="chat"
      id="tab-menu"
      class="mb-3"
    >
      <Accordion.Item eventKey="chat" title="Chat">
        <Accordion.Header>
          <h5>Chat</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Chat/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="myPixels" title="My Pixels">
       <Accordion.Header>
          <h5>My Pixels</h5>
        </Accordion.Header>
        <Accordion.Body>
          <MyPixels />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="otherPixels" title="Other Pixels">
        <Accordion.Header>
          <h5>Other Pixels</h5>
        </Accordion.Header>
        <Accordion.Body>
          <OtherPixels />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="votes" title="Votes">
        <Accordion.Header>
          <h5>Votes</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Votes />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="history" title="History">
        <Accordion.Header>
          <h5>History</h5>
        </Accordion.Header>
        <Accordion.Body>
          <History />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="info" title="Info">
        <Accordion.Header>
          <h5>Info</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Info />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionMenu;

