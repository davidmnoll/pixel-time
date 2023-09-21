

export default function Info () {
  return (<>
    <p>
      Disclaimer:
      Pixel time is a game that is meant to be a fun game where participation also can hopefully help fund some future projects I would like to work on to help the state of decentralized apps.  The game is a risk.  I have made my best efforts to secure the contract, but there is always the risk of vulnerabilities I was unaware of.  Also, participating in this game is not adding economic value in and of itself, and since I'm taking a cut along with the gas costs, that means playing is -EV.  Please do not expect to make money, and do not participate with any money you can't afford to lose.  Please consider any money you put in to be a donation, tip, or a form of crowd funding.  I have absolutely 0 idea how this will pan out, so please don't consider me liable for any of it.  It's just an exploration.  
    </p>
    <p>
      You can buy pixels and change their color. Once you own the pixel, you can also use it to vote on the future of the canvas... expand in the X or Y direction, add a new frame, or wipe everything clean.
    </p>
    <p>
      2 meta-controls are used: increasing the pool %, and increasing the threshold %.  Increasing the threshold means more votes are required for actions such as expanding the canvas, capturing frames, or starting a new era.  The pool % determines how much of pixel sales proceeds go to the pool vs the original owner.
    </p>
    <p>
      When a new row or column of pixels is added, the new pixels are set for sale proportional to the current pool value and pool %.  The proceeds from new pixels sales go into the pool.            
    </p>
    <p>
      When a new frame is captured and the current state of the canvas is logged to be used as part of a video composed of all frames of the current era.     
    </p>
    <p>
      When a new era is started, the last frame is logged and the pixels are set to #0000, all votes are reset, all funds are disbursed to the pixel owners, and 7% is disbursed to me.
    </p>
  </>)
}