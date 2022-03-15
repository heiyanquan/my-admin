import React, { useEffect } from 'react';
import Routers from './router';
import ComHeader from 'components/Header/Header'
import './App.css';

function App(props) {

  useEffect(() => {
  }, [])

  return (
    <div className="App">
      <ComHeader title="产业大数据" />
      <Routers />
    </div>
  );
}

export default App;
