import { useEffect } from 'react';
import { loadMap } from 'assets/js/map'
import './style.scss'

function HomePage (props) {
  useEffect(() => {
    loadMap()
  }, [])
  return (
    <div className="home_box">
      <div className='map_box' id='mapContainer'></div>
    </div>
  );
}

export default HomePage;