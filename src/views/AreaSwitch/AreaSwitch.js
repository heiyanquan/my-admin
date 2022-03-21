import { useRef, useEffect, useState } from "react"
import "./style.scss"
import GaodeView from "./useGaode"

function HomePage(props) {
  const gaodeRef = useRef(null)
  const [adcode, setAdcode] = useState()

  useEffect(() => {
    const init = async () => {
      await gaodeRef.current.initMap('mapContainer1', {
        center: [116.978275, 31.870612],
        zoom: 9
      })
      setAdcode(100000)
    }
    init()
  }, [])

  return (
    <div className="home_box">
      <GaodeView adcode={adcode} ref={gaodeRef} />
    </div>
  )
}

export default HomePage
