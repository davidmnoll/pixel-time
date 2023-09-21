
import { Suspense } from "solid-js";
import { useContract } from "../providers";

export default function MyPixels() {


  const contractData = useContract();


  return (

      <div id="my-pixels">
        <div id="my-pixels-header">
          Test
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <div id="my-pixels-body">
            {/* {data().pixels.filter(pixel => pixel.owner === data.selectedAccount).map(pixel => (
              <div class="card mb-3">
                <div class="card-body">
                  {JSON.stringify(pixel)}
                </div>
              </div>
            ))} */}
          </div>
        </Suspense>
    </div>
  );
}
