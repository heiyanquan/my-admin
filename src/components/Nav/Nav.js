import React from "react"
import { useNavigate } from "react-router-dom"
import "./style.scss"

function NavView() {
  const navList = [
    { label: "填充、区名称", path: "/home" },
    { label: "填充、下钻", path: "/areaSwitch" },
    { label: "form", path: "/form" },
    { label: "memo", path: "/memo" },
  ]
  const colorList = [
    "#46A0FF",
    "#FFC64C",
    "#63E587",
    "#FA885D",
    "#7BF0EB",
    "#F277E1",
    "#FF7B7B",
    "#728EFE",
    "#E1EC9E",
    "#8F2EFF",
    "#8DEEFF",
    "#7C69F2",
    "#CCF6B5",
    "#EE8989",
    "#84B2FF",
    "#80E5C4",
  ]
  const navigate = useNavigate()
  const toUrl = (path) => {
    navigate(path)
  }

  return (
    <div className="navigation_page_wrapper">
      {navList.map((item, index) => (
        <div key={item.label} style={{ background: colorList[index] }} onClick={() => toUrl(item.path)}>
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default NavView
