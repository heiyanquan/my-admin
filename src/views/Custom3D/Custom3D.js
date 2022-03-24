import { useEffect, useRef } from "react";
import "./style.scss";
import GlobalGaode from "utils/useGaode";

function HomePage(props) {
  const mapInstance = useRef(null);
  useEffect(() => {
    const init = async () => {
      mapInstance.current = new GlobalGaode({});
      await mapInstance.current.initMap("mapContainer1", {
        center: [117.283042, 31.86119],
        zoom: 7,
        pitchEnable: true,
        pitch: 30,
        viewMode: '3D',
        mapStyle: 'amap://styles/4eee52d358907721115d6546de8f67ff'
      });
      await mapInstance.current.switch2AreaNode(340000)
      mapInstance.current.render3DLayer(340000)
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
