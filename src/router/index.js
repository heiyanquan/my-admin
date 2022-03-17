import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import ComNav from 'components/Nav/Nav'
import HomeView from 'views/Home/Home';
import FormView from 'views/Form/Form';

const RoutesInfo = () => (
	<BrowserRouter>
    <Routes>
      <Route path="/" element={<ComNav />} />
      <Route path="/home" element={<HomeView/>} />
      <Route path="/form" element={<FormView/>} />
    </Routes>
	</BrowserRouter>
);
export default RoutesInfo;