import { useEffect } from 'react';
import { loadMap } from 'assets/js/map'
import './style.less'

function HomePage (props) {
  useEffect(() => {
    loadMap()
  }, [])
  return (
    <div className="home_box">
      <div className='map_box' id='mapContainer' style={{ height: '800px' }}></div>
    </div>
  );
}

export default HomePage;