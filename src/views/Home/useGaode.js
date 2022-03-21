import { forwardRef, useImperativeHandle } from "react"

function useGaode(props = {}, ref) {
  let map = null
  let districtExplorer = null
  let heatMap = null
  let mapLoca = null
  let currentAreaNode = null
  let boundLinelayer = null
  let boundLinelayer2 = null
  let boundPolygonLayer = null
  const markerList = []
  let areaFeatureList = []
  const colorList = props.colorList || [
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
  ]

  // 加载区域
  function loadAreaNode(adcode) {
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
  }
  // 3d地图所需要的数据
  function PolygonLayerDataSet(arr) {
    const data = {
      type: "FeatureCollection",
      features: [...arr._data.geoData.lngLatSubList],
    }
    return data
  }
  // 创建3d图层
  function setboundPolygonLayer(areaNode, cityhight) {
    /**
     * @param {Object} areaNode  //哪个城市的3d地图
     * @param {number} cityhight //高度
     */
    // 设置地图的数据
    const data = PolygonLayerDataSet(areaNode)
    const geo = new window.Loca.GeoJSONSource({
      data,
    })
    boundPolygonLayer = new window.Loca.PolygonLayer({
      zIndex: 20,
      opacity: 1,
      cullface: "none",
      shininess: 10,
      hasSide: true,
    })
    boundPolygonLayer.setSource(geo)
    // 样式
    boundPolygonLayer.setStyle({
      topColor() {
        return "#00366A"
      },
      sideTopColor() {
        return "#00366A"
      },
      sideBottomColor() {
        return "#076DA4"
      },
      // 地图厚度
      height() {
        return cityhight
      },
      altitude: 0 - cityhight, // 地图偏移量
      // 地图侧边贴图
      // texture: mapSidePng
    })
    mapLoca.add(boundPolygonLayer)
    return boundPolygonLayer
  }
  // 创建线图层
  function setboundLinelayer(areaNode, styleobj, altitude = 5) {
    /**
     * @param {Object} areaNode  //哪个城市的线条
     * @param {Object} styleobj  //线条颜色
     * @param {Object} altitude //偏移量
     */
    styleobj = styleobj || {}
    const parentFeature = areaNode.getParentFeature()

    const {
      geometry: {
        coordinates: [[boundCoords]],
      },
      properties,
    } = parentFeature
    // 创建线图层需要的数据
    const data = new window.Loca.GeoJSONSource({
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties,
            geometry: {
              type: "LineString",
              coordinates: boundCoords,
            },
          },
        ],
      },
    })
    const boundTmpLinelayer = new window.Loca.LineLayer({
      loca: mapLoca,
      zIndex: 10,
    })
    boundTmpLinelayer.setSource(data)
    // 样式
    boundTmpLinelayer.setStyle({
      color: "#bad5f0",
      lineWidth: 3,
      altitude,
      ...styleobj,
    })
    return boundTmpLinelayer
  }
  // 渲染图层
  async function render3DLayer(adcode, cityhight = 40000) {
    if (!map) {
      return
    }
    const areaNode = await loadAreaNode(adcode)
    // 创建loca容器
    if (!mapLoca) {
      mapLoca = new window.Loca.Container({
        map: map,
      })
    }
    // 每次进来先清除
    if (boundLinelayer) {
      boundLinelayer.destroy()
    }
    if (boundLinelayer2) {
      boundLinelayer2.destroy()
    }
    if (boundPolygonLayer) {
      boundPolygonLayer.destroy()
    }
    // 线图层一
    boundLinelayer = setboundLinelayer(areaNode, {})
    // 线图层二
    boundLinelayer2 = setboundLinelayer(areaNode, {
      color: "#6fd4fe",
      lineWidth: 5,
      altitude: 0 - cityhight,
    })
    // 3d图层
    boundPolygonLayer = setboundPolygonLayer(areaNode, cityhight)
  }
  // 初始化热力图-https://lbs.amap.com/demo/jsapi-v2/example/selflayer/heatmap
  function initHeatMapLayer(dataSet, heatOptions, setOptions) {
    heatMap = new window.AMap.HeatMap(map, {
      radius: dataSet.length > 1000 ? 10 : 20, // 给定半径
      opacity: [0, 1],
      "3d": {
        heightScale: dataSet.length > 1000 ? 0.2 : 0.5,
      },
      gradient: {
        0: "rgba(81,204,255,1)",
        0.3: "rgba(48,210,0,1)",
        0.7: "rgba(228,196,17,1)",
        0.9: "rgba(254,129,0,1)",
        1.0: "rgba(255,0,0,1)",
      },
      zIndex: 10000,
      ...heatOptions,
    })
    heatMap.setDataSet({
      data: dataSet,
      zoom: 100,
      max: 10,
      ...setOptions,
    })
  }
  // 清除热力图
  function clearHeatMapLayer() {
    if (heatMap) {
      heatMap.setDataSet({
        data: [],
        zoom: 100,
        max: 10,
      })
      heatMap = null
    }
  }
  // 显示省市区名称
  // https://lbs.amap.com/faq/js-api/map-js-api/cover/43368/
  async function showAdministrativeRegionName(markerOptions = {}) {
    areaFeatureList = areaFeatureList.filter((feature) => feature.properties)
    areaFeatureList.forEach((feature) => {
      const { center, name } = feature.properties
      const marker = new window.AMap.Marker({
        position: center,
        offset: new window.AMap.Pixel(-10, -10),
        content: `<div class="marker_text">${name}</div>`,
        ...markerOptions,
      })
      map.add(marker)
      markerList.push(marker)
    })
  }
  // 绘制某个区域的边界-https://lbs.amap.com/demo/amap-ui/demos/amap-ui-districtexplorer/index
  function renderAreaPolygons(areaNode, classifyColor, suboptions = {}, parentOptions = {}) {
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
  }
  // 切换区域后刷新显示内容
  function refreshAreaNode(areaNode, classifyColor, suboptions, parentOptions) {
    districtExplorer.setHoverFeature(null)
    renderAreaPolygons(areaNode, classifyColor, suboptions, parentOptions)
  }
  // 切换区域 https://lbs.amap.com/demo/amap-ui/demos/amap-ui-districtexplorer/index
  async function switch2AreaNode(adcode, callback, classifyColor, suboptions, parentOptions) {
    if (!districtExplorer) {
      return false
    }
    if (currentAreaNode && `${currentAreaNode.getAdcode()}` === `${adcode}`) {
      return false
    }
    const areaNode = await loadAreaNode(adcode)
    currentAreaNode = areaNode
    // 设置当前使用的定位用节点
    districtExplorer.setAreaNodesForLocating([areaNode])
    refreshAreaNode(areaNode, classifyColor, suboptions, parentOptions)
    if (callback) {
      return callback(areaNode)
    }
    return areaNode
  }
  // 加载AMapUI，初始化districtExplorer
  async function initDistrictExplorer() {
    return new Promise((resolve) => {
      window.AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], (DistrictExplorer) => {
        // 创建一个实例
        districtExplorer = new DistrictExplorer({
          eventSupport: true,
          map,
        })
        resolve()
      })
    })
  }
  async function initMap(dom = "mapContainer", options = {}) {
    map = new window.AMap.Map(dom, options)
    await initDistrictExplorer()
  }

  useImperativeHandle(ref, () => ({
    map,
    districtExplorer,
    initMap,
    switch2AreaNode,
    initHeatMapLayer,
    clearHeatMapLayer,
    render3DLayer,
    showAdministrativeRegionName,
  }))

  return <div className="map_box" id="mapContainer1"></div>
}

export default forwardRef(useGaode)
