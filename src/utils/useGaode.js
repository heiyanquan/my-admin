export default class GlobalGaode {
  constructor({ colorList }) {
    this.map = null
    this.districtExplorer = null
    this.heatMap = null
    this.mapLoca = null
    this.currentAreaNode = null
    this.boundLinelayer = null
    this.boundLinelayer2 = null
    this.boundPolygonLayer = null
    this.markerList = []
    this.areaFeatureList = []
    this.colorList = colorList || [
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
  }

  // 加载区域
  loadAreaNode(adcode) {
    if (!this.districtExplorer) {
      return false
    }
    return new Promise((resolve, reject) =>
      this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          return reject(error)
        }
        return resolve(areaNode)
      })
    )
  }
  // 3d地图所需要的数据
  PolygonLayerDataSet(arr) {
    const data = {
      type: "FeatureCollection",
      features: [...arr._data.geoData.lngLatSubList],
    }
    return data
  }
  // 创建3d图层
  setboundPolygonLayer(areaNode, cityhight) {
    /**
     * @param {Object} areaNode  //哪个城市的3d地图
     * @param {number} cityhight //高度
     */
    // 设置地图的数据
    const data = this.PolygonLayerDataSet(areaNode)
    const geo = new window.Loca.GeoJSONSource({
      data,
    })
    this.boundPolygonLayer = new window.Loca.PolygonLayer({
      zIndex: 20,
      opacity: 1,
      cullface: "none",
      shininess: 10,
      hasSide: true,
    })
    this.boundPolygonLayer.setSource(geo)
    // 样式
    this.boundPolygonLayer.setStyle({
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
    this.mapLoca.add(this.boundPolygonLayer)
    return this.boundPolygonLayer
  }
  // 创建线图层
  setboundLinelayer(areaNode, styleobj, altitude = 5) {
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
      loca: this.mapLoca,
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
  async render3DLayer(adcode, cityhight = 40000) {
    if (!this.map) {
      return
    }
    const areaNode = await this.loadAreaNode(adcode)
    // 创建loca容器
    if (!this.mapLoca) {
      this.mapLoca = new window.Loca.Container({
        map: this.map,
      })
    }
    // 每次进来先清除
    if (this.boundLinelayer) {
      this.boundLinelayer.destroy()
    }
    if (this.boundLinelayer2) {
      this.boundLinelayer2.destroy()
    }
    if (this.boundPolygonLayer) {
      this.boundPolygonLayer.destroy()
    }
    // 线图层一
    this.boundLinelayer = this.setboundLinelayer(areaNode, {})
    // 线图层二
    this.boundLinelayer2 = this.setboundLinelayer(areaNode, {
      color: "#6fd4fe",
      lineWidth: 5,
      altitude: 0 - cityhight,
    })
    // 3d图层
    this.boundPolygonLayer = this.setboundPolygonLayer(areaNode, cityhight)
  }
  // 初始化热力图-https://lbs.amap.com/demo/jsapi-v2/example/selflayer/heatmap
  initHeatMapLayer(dataSet, heatOptions, setOptions) {
    this.heatMap = new window.AMap.HeatMap(this.map, {
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
    this.heatMap.setDataSet({
      data: dataSet,
      zoom: 100,
      max: 10,
      ...setOptions,
    })
  }
  // 清除热力图
  clearHeatMapLayer() {
    if (this.heatMap) {
      this.heatMap.setDataSet({
        data: [],
        zoom: 100,
        max: 10,
      })
      this.heatMap = null
    }
  }
  // 显示省市区名称
  // https://lbs.amap.com/faq/js-api/map-js-api/cover/43368/
  async showAdministrativeRegionName(markerOptions = {}) {
    this.areaFeatureList = this.areaFeatureList.filter((feature) => feature.properties)
    this.areaFeatureList.forEach((feature) => {
      const { center, name } = feature.properties
      const marker = new window.AMap.Marker({
        position: center,
        offset: new window.AMap.Pixel(-10, -10),
        content: `<div class="marker_text">${name}</div>`,
        ...markerOptions,
      })
      this.map.add(marker)
      this.markerList.push(marker)
    })
  }
  // 绘制某个区域的边界-https://lbs.amap.com/demo/amap-ui/demos/amap-ui-districtexplorer/index
  renderAreaPolygons(areaNode, classifyColor, suboptions = {}, parentOptions = {}) {
    // 更新地图视野
    this.map.setBounds(areaNode.getBounds(), null, null, true)
    // 清除已有的绘制内容
    this.districtExplorer.clearFeaturePolygons()
    // 绘制子区域
    this.districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
      this.areaFeatureList.push(feature)
      let fillColor = this.colorList[i % this.colorList.length]
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
    this.districtExplorer.renderParentFeature(areaNode, {
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
  refreshAreaNode(areaNode, classifyColor, suboptions, parentOptions) {
    this.districtExplorer.setHoverFeature(null)
    this.renderAreaPolygons(areaNode, classifyColor, suboptions, parentOptions)
  }
  // 切换区域 https://lbs.amap.com/demo/amap-ui/demos/amap-ui-districtexplorer/index
  async switch2AreaNode(adcode, callback, classifyColor, suboptions, parentOptions) {
    if (!this.districtExplorer) {
      return false
    }
    if (this.currentAreaNode && `${this.currentAreaNode.getAdcode()}` === `${adcode}`) {
      return false
    }
    const areaNode = await this.loadAreaNode(adcode)
    this.currentAreaNode = areaNode
    // 设置当前使用的定位用节点
    this.districtExplorer.setAreaNodesForLocating([areaNode])
    this.refreshAreaNode(areaNode, classifyColor, suboptions, parentOptions)
    if (callback) {
      return callback(areaNode)
    }
    return areaNode
  }
  // 加载AMapUI，初始化districtExplorer
  async initDistrictExplorer() {
    return new Promise((resolve) => {
      window.AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], (DistrictExplorer) => {
        // 创建一个实例
        this.districtExplorer = new DistrictExplorer({
          eventSupport: true,
          map: this.map,
        })
        resolve()
      })
    })
  }
  async initMap(dom = "mapContainer", options = {}) {
    this.map = new window.AMap.Map(dom, options)
    await this.initDistrictExplorer()
  }
}
