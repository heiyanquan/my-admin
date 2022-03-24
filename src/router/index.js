import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ComNav from "components/Nav/Nav"
import HomeView from "views/Home/Home"
import FormView from "views/Form/Form"
import MemoView from "views/Memo/Memo"
import AreaSwitch from "views/AreaSwitch/AreaSwitch"
import CustomColor from "views/CustomColor/CustomColor"
import CustomHover from "views/CustomHover/CustomHover"
import Custom3D from "views/Custom3D/Custom3D"

const RoutesInfo = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ComNav />} />
      <Route path="/home" element={<HomeView />} />
      <Route path="/form" element={<FormView />} />
      <Route path="/memo" element={<MemoView />} />
      <Route path="/areaSwitch" element={<AreaSwitch />} />
      <Route path="/customColor" element={<CustomColor />} />
      <Route path="/customHover" element={<CustomHover />} />
      <Route path="/custom3D" element={<Custom3D />} />
    </Routes>
  </BrowserRouter>
)
export default RoutesInfo
