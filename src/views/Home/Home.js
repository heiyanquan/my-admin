import { useCallback, useEffect } from "react";
import "./style.scss";
import useGaode from "./useGaode";

function HomePage(props) {
  const useGaodeObj = useGaode();
  const { initMap, map } = useGaodeObj
  const callMap = useCallback(() => {
    initMap('mapContainer1', {
      center: [116.978275, 31.870612],
      zoom: 9
    })
  }, [initMap])
  console.log(11, map);
  useEffect(() => {
    callMap()
    console.log(22, useGaodeObj);
  }, [callMap, useGaodeObj]);
  return <div className="home_box">
    <div className='map_box' id='mapContainer1'></div>
  </div>;
}

export default HomePage;
