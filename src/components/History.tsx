
import { createEffect} from "solid-js";
import { useContract } from "../providers";
import { CanvasPlayerElement } from "./CanvasPlayer";

export default function History () {

  const contract = useContract();

  return contract() ? 
  ((contractData) => contractData.pastEras.map((era: any) => <HistoryPlayer data={era} />))(contract())
  : <div>Loading...</div>
}

function HistoryPlayer(props: any) {
  
  let canvas: CanvasPlayerElement | null = null;

  createEffect(() => {
    if (props.data){
        canvas.data = props.data;
        canvas.loading = false;
        console.log('canvas.data', canvas.data)
      }
  })


  return (
    <canvas-player ref={canvas} id="canvas-player" data={props.data} ></canvas-player>
  )
}