import { useEffect, useRef } from 'react';
import { Button } from 'antd'
import GaodeView from './map'
import './style.scss'

function HomePage (props) {
  const gaodeRef = useRef(null)

  const btnEvent = () => {
  }

  useEffect(() => {
    console.log(11, gaodeRef.current);
    gaodeRef.current.loadMap()
  }, [])
  return (
    <div className="home_box">
      <Button onClick={() => btnEvent()} type="primary">Primary Button</Button>
      <GaodeView ref={gaodeRef} />
    </div>
  );
}

export default HomePage;