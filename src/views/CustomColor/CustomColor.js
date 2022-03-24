import { useEffect, useRef } from "react";
import "./style.scss";
import GlobalGaode from "utils/useGaode";

function HomePage(props) {
  const mapInstance = useRef(null);
  useEffect(() => {
    const init = async () => {
      const colorList = ['#0068D8', '#1C89FF', '#4CA3FF', '#75B7FF', '#B1D7FF']
      mapInstance.current = new GlobalGaode({});
      await mapInstance.current.initMap("mapContainer1", {
        center: [116.978275, 31.870612],
        zoom: 9,
      });
      await mapInstance.current.switch2AreaNode(340000, null, (feature, i) => {
        const fillColor = colorList[i % colorList.length]
        return fillColor
      })
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
