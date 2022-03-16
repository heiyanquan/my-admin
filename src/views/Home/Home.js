import { useEffect, useRef } from 'react';
import GaodeView from './map'
import './style.scss'
import useSelectData from './use-select-data'
import useMapFindPark from './use-map-find-park'

function HomePage (props) {
  const gaodeRef = useRef(null)
  const { cityNameCodeList, districtNameCodeList } = useSelectData()
  const { getIndexCluster } = useMapFindPark()

  useEffect(() => {
    gaodeRef.current.loadMap()
    getIndexCluster().then(res => {
      console.log(11, res);
    })
  }, [])
  return (
    <div className="home_box">
      <GaodeView ref={gaodeRef} />
    </div>
  );
}

export default HomePage;