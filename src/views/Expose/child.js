import { forwardRef, useImperativeHandle } from "react";

function useChild(props, ref) {
  async function loadMap() {
    console.log('loadMap');
  }
  async function initMap() {
  }
  async function switch2AreaNode() {
  }
  useImperativeHandle(ref, () => ({
    loadMap,
    initMap,
  }));

  return <div className='child_box'></div>
}

export default forwardRef(useChild)
