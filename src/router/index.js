import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import HomeView from 'views/Home/Home';

const RoutesInfo = () => (
	<BrowserRouter>
    <Routes>
      <Route exact path="/" element={<HomeView/>} />
      <Route path="/home" element={<HomeView/>} />
    </Routes>
	</BrowserRouter>
);
export default RoutesInfo;