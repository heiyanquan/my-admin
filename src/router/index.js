import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';

import HomeView from 'views/Home/Home';

const RoutesInfo = () => (
	<HashRouter>
    <Routes>
      <Route exact path="/" component={HomeView} />
      <Route path="/home" component={HomeView} />
    </Routes>
	</HashRouter>
);
export default RoutesInfo;