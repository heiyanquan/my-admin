import { useRef, useEffect } from "react"
import "./style.scss"
import GaodeView from "./useGaode"

function HomePage(props) {
  const gaodeRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      await gaodeRef.current.initMap("mapContainer1", {
        center: [116.978275, 31.870612],
        zoom: 9,
      })
      await gaodeRef.current.switch2AreaNode(100000)
      // 显示行政区域名称
      gaodeRef.current.showAdministrativeRegionName(100000)
    }
    init()
  }, [])
  return (
    <div className="home_box">
      <GaodeView ref={gaodeRef} />
    </div>
  )
}

export default HomePage
