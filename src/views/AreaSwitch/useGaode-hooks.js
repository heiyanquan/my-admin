import { forwardRef, useCallback, useEffect, useImperativeHandle, useState, useMemo } from "react"

function useGaode(props = {}, ref) {
  const { adcode } = props
  let [map, setMap] = useState(null)
  const [districtExplorer, setDistrictExplorer] = useState(null)
  const [currentAreaNode, setCurrentAreaNode] = useState(null)
  let areaFeatureList = useMemo(() => [], [])
  const colorList = useMemo(() => props.colorList || [
    "#3366cc",
    "#dc3912",
    "#ff9900",
    "#109618",
    "#990099",
    "#0099c6",
    "#dd4477",
    "#3578D4",
    "#b82e2e",
    "#82B7FF",
    "#994499",
    "#22aa99",
    "#aaaa11",
    "#6633cc",
    "#e67300",
    "#69A8FF",
    "#9CC6FF",
    "#5574a6",
    "#3b3eac",
  ], [props.colorList])

  // 加载区域
  const loadAreaNode = useCallback((adcode) => {
    if (!districtExplorer) {
      return false
    }
    return new Promise((resolve, reject) =>
      districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          return reject(error)
        }
        return resolve(areaNode)
      })
    )
  }, [districtExplorer])
  // 绘制某个区域的边界-https://lbs.amap.com/demo/amap-ui/demos/amap-ui-districtexplorer/index
  const renderAreaPolygons = useCallback((areaNode, classifyColor, suboptions = {}, parentOptions = {}) => {
    // 更新地图视野
    map.setBounds(areaNode.getBounds(), null, null, true)
    // 清除已有的绘制内容
    districtExplorer.clearFeaturePolygons()
    // 绘制子区域
    districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
      areaFeatureList.push(feature)
      let fillColor = colorList[i % colorList.length]
      if (classifyColor) {
        fillColor = classifyColor(feature, i, areaNode)
      }
      return {
        cursor: "pointer",
        bubble: true,
        fillColor,
        fillOpacity: 0.4,
        strokeColor: "rgba(0, 145, 234, 0.1)", // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线宽
        ...suboptions,
      }
    })
    // 绘制父区域
    districtExplorer.renderParentFeature(areaNode, {
      cursor: "pointer",
      bubble: true,
      strokeColor: "#51CCFF", // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 0.7, // 线宽
      fillColor: !areaNode._data.geoData.sub ? "rgba(128,216,252,0.1)" : null,
      ...parentOptions,
    })
  }, [map, districtExplorer, areaFeatureList, colorList])
  // 切换区域后刷新显示内容
  const refreshAreaNode = useCallback((areaNode, classifyColor, suboptions, parentOptions) => {
    districtExplorer.setHoverFeature(null)
    renderAreaPolygons(areaNode, classifyColor, suboptions, parentOptions)
  }, [districtExplorer, renderAreaPolygons])
  // 切换区域 https://lbs.amap.com/demo/amap-ui/demos/amap-ui-districtexplorer/index
  const switch2AreaNode = useCallback(async (adcode, callback, classifyColor, suboptions, parentOptions) => {
    if (!districtExplorer) {
      return false
    }
    if (currentAreaNode && `${currentAreaNode.getAdcode()}` === `${adcode}`) {
      return false
    }
    const areaNode = await loadAreaNode(adcode)
    setCurrentAreaNode(areaNode)
    // 设置当前使用的定位用节点
    districtExplorer.setAreaNodesForLocating([areaNode])
    refreshAreaNode(areaNode, classifyColor, suboptions, parentOptions)
    if (callback) {
      return callback(areaNode)
    }
    return areaNode
  }, [districtExplorer, currentAreaNode, loadAreaNode, refreshAreaNode])
  // 加载AMapUI，初始化districtExplorer
  const initDistrictExplorer = useCallback((map) => {
    return new Promise((resolve) => {
      window.AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], (DistrictExplorer) => {
        // 创建一个实例
        setDistrictExplorer(new DistrictExplorer({
          eventSupport: true,
          map,
        }))
        resolve()
      })
    })
  }, [])
  const initMap = useCallback(async (dom = "mapContainer", options = {}) => {
    const mapInstance = new window.AMap.Map(dom, options)
    setMap(mapInstance)
    await initDistrictExplorer(mapInstance)
  }, [initDistrictExplorer])

  useEffect(() => {
    if (adcode) {
      switch2AreaNode(adcode)
    }
  }, [adcode, switch2AreaNode])

  useImperativeHandle(ref, () => ({
    map,
    districtExplorer,
    initMap,
    switch2AreaNode,
  }))

  return <div className="map_box" id="mapContainer1"></div>
}

export default forwardRef(useGaode)
