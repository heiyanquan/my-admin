import { useEffect, useRef } from "react";
import "./style.scss";
import GlobalGaode from "utils/useGaode";

function HomePage(props) {
  const mapInstance = useRef(null);
  useEffect(() => {
    const init = async () => {
      mapInstance.current = new GlobalGaode({});
      await mapInstance.current.initMap("mapContainer1", {
        center: [116.978275, 31.870612],
        zoom: 9,
      });
      await mapInstance.current.switch2AreaNode(100000)
      if (mapInstance.current.districtExplorer) {
        // 创建一个辅助Marker，提示鼠标内容
        const tipMarker = new window.AMap.Marker({
          // 启用冒泡，否则click事件会被marker自己拦截
          bubble: true
        })
        mapInstance.current.districtExplorer.on('featureMouseout featureMouseover', (e, feature) => {
          const { name } = feature.properties
          const isHover = e.type === 'featureMouseover'
          if (!isHover) {
            tipMarker.setMap(null)
            return
          }
          tipMarker.setMap(mapInstance.current.map)
          tipMarker.setPosition(e.originalEvent.lnglat)
          tipMarker.setLabel({
            offset: new window.AMap.Pixel(20, 20),
            content: name
          })
        })
        mapInstance.current.districtExplorer.on('featureMousemove', (e) => {
          // 更新提示位置
          tipMarker.setPosition(e.originalEvent.lnglat)
        })
      }
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
