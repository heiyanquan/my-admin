import { useEffect, useRef } from "react";
import "./style.scss";
import GlobalGaode from "utils/useGaode";
import heatmapData from './heatmapData'

function HomePage(props) {
  const mapInstance = useRef(null);
  useEffect(() => {
    const init = async () => {
      mapInstance.current = new GlobalGaode({});
      await mapInstance.current.initMap("mapContainer1", {
        resizeEnable: true,
        center: [116.418261, 39.921984],
        zoom: 11
      });
      await mapInstance.current.switch2AreaNode(110000)
      mapInstance.current.initHeatMapLayer(heatmapData)
    };
    init()
  }, []);

  return (
    <div className="home_box">
      <div className="map_box" id="mapContainer1"></div>
    </div>
  );
}

export default HomePage;
