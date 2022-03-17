import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from 'views/Home/Home';
import ComNav from 'components/Nav/Nav'

const RoutesInfo = () => (
	<BrowserRouter>
    <Routes>
      <Route path="/" element={<ComNav />} />
      <Route path="/home" element={<HomeView/>} />
    </Routes>
	</BrowserRouter>
);
export default RoutesInfo;