
import { useContract } from "../providers";



export default function OtherPixels() {


  const contractData = useContract();




  return (

      <div id="other-pixels">
        <div id="other-pixels-header">

        </div>
        <div id="other-pixels-body">
          {/* {pixels.map(pixel => (
            <div class="card mb-3">
              <div class="card-body">
                {JSON.stringify(pixel)}
              </div>
            </div>
          ))} */}
          </div>
    </div>
  );
}
