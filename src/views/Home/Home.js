import { useRef, useEffect } from "react"
import "./style.scss"
import GlobalGaode from "utils/useGaode";

function HomePage(props) {
  const mapInstance = useRef(null);

  useEffect(() => {
    const init = async () => {
      mapInstance.current = new GlobalGaode({});
      await mapInstance.current.initMap("mapContainer1", {
        center: [116.978275, 31.870612],
        zoom: 9,
      })
      await mapInstance.current.switch2AreaNode(100000)
      // 显示行政区域名称
      mapInstance.current.showAdministrativeRegionName(100000)
    }
    init()
  }, [])
  return (
    <div className="home_box">
      <div className="map_box" id="mapContainer1"></div>
    </div>
  )
}

export default HomePage
