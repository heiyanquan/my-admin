import React, { useEffect, useRef } from 'react';
import './style.scss'
import ChildView from './child'

function IndustryPage (props) {
  const childRef = useRef(null)

  useEffect(() => {
    childRef.current.loadMap()
  }, [])

  return (
    <div className="home_box">
      expose
      <ChildView ref={childRef} />
    </div>
  );
}

export default IndustryPage;