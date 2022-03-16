const circleRuleId = {
  park: {
    unit: '个',
    name: '园区'
  },
  base: {
    unit: '个',
    name: '基地'
  },
  colony: {
    unit: '个',
    name: '集群'
  },
  Matching: {
    unit: '个',
    name: '创新资源'
  },
  company: {
    unit: '家',
    name: '企业'
  },
  project: {
    unit: '个',
    name: '项目'
  },
  building: {
    unit: '家',
    name: '楼宇'
  }
}

function useGaode({ currentCircleLevel }) {
  let map
  let AMap
  let districtExplorer = {}
  let currentAreaNode
  let markerList = []
  const parkType = 'park'

  // 绘制某个区域的边界
  function renderAreaPolygons(areaNode) {
    // 更新地图视野
    map.setBounds(areaNode.getBounds(), null, null, true);
    if (areaNode.adcode === 340000) {
      map.setZoomAndCenter(7.65, [116.978275, 31.870612]);
    }
    // 清除已有的绘制内容
    districtExplorer.clearFeaturePolygons();
    // 绘制子区域
    districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
      const colorList = [
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
      ];
      const fillColor = colorList[i % colorList.length];
      return {
        cursor: "pointer",
        bubble: true,
        // fillColor: 'rgba(128,216,252,0.1)',
        fillColor,
        // fillOpacity: 0.4,
        strokeColor: "rgba(0, 145, 234, 0.1)", // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线宽
      };
    });
    // 绘制父区域
    districtExplorer.renderParentFeature(areaNode, {
      cursor: "pointer",
      bubble: true,
      strokeColor: "#51CCFF", // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 0.7, // 线宽
      fillColor: null,
    });
  }
  // 切换区域后刷新显示内容
  function refreshAreaNode(areaNode) {
    districtExplorer.setHoverFeature(null);
    renderAreaPolygons(areaNode);
  }
  // 加载区域
  function loadAreaNode(adcode, callback) {
    districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }
      if (callback) {
        callback(null, areaNode);
      }
    });
  }
  // 切换区域
  async function switch2AreaNode(adcode, callback) {
    if (!districtExplorer) {
      return;
    }
    if (currentAreaNode && `${currentAreaNode.getAdcode()}` === `${adcode}`) {
      return;
    }
    loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }
      currentAreaNode = areaNode;
      // 设置当前使用的定位用节点
      districtExplorer.setAreaNodesForLocating([areaNode]);
      refreshAreaNode(areaNode);
      if (callback) {
        callback(null, areaNode);
      }
    });
  }
  async function fillAreaBgColor() {
    return new Promise((resolve) => {
      /*global AMapUI*/
      AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], (DistrictExplorer) => {
        // 创建一个实例
        districtExplorer = new DistrictExplorer({
          eventSupport: true,
          map,
        });
        currentAreaNode = null;
        switch2AreaNode(340000);
        resolve();
      });
    });
  }
  async function initMap() {
    map = new AMap.Map("mapContainer", {
      center: [116.978275, 31.870612],
      zoom: 7,
      mapStyle: "amap://styles/normal",
      viewMode: "3D",
      pitch: 20,
      skyColor: "grey",
    });
    const scale = new AMap.Scale({
      position: "RB",
    });
    const toolBar = new AMap.ToolBar({
      position: {
        bottom: "65px",
        right: "22px",
      },
    });
    map.addControl(scale);
    map.addControl(toolBar);
    await fillAreaBgColor();
  }
  async function loadMap() {
    return window.AMapLoader.load({
      key: "60fdb942e15dfeefff0d5595c58a8de3", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.DistrictLayer", "AMap.HeatMap", "AMap.DistrictSearch", "AMap.ToolBar", "AMap.Scale"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: {
        // 是否加载 AMapUI，缺省不加载
        version: "1.1", // AMapUI 版本
        plugins: ["overlay/SimpleMarker"], // 需要加载的 AMapUI ui插件
      },
      Loca: {
        // 是否加载 Loca， 缺省不加载
        version: "2.0", // Loca 版本
      },
    })
      .then((originAMap) => {
        AMap = originAMap
        return initMap();
      })
      .catch((e) => {
        console.error(e); //加载错误提示
      });
  }
  // 圆圈
  function drawMapCircle(list) {
    const { unit } = circleRuleId[parkType]
    if (markerList) {
      map && map.remove(markerList)
    }
    markerList = []
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i]
      let showName = item.address_city
      if (currentCircleLevel === 'district') {
        showName = item.address_area || item.address_city
      }
      const markerContent = `<div class="amap_cluster">
        <span class="showName">${showName}</span>
        <span class="showCount">${item.num}${unit}</span>
      </div>`
      let position
      if (Array.isArray(item.lnglat)) {
        position = item.lnglat
      }
      if (item.lng_lat) {
        position = item.lng_lat.split(',')
      }
      const marker = new AMap.Marker({
        position,
        content: markerContent,
        cursor: 'pointer',
        clickable: true,
        zIndex: 100,
        offset: new AMap.Pixel(-40, -40)
      })
      marker.item = item
      markerList.push(marker)
      marker.on('mouseover', () => {
        marker.setzIndex(110)
      })
      marker.on('mouseout', () => {
        marker.setzIndex(100)
      })
    }
    map.add(markerList)
  }


  return {
    map,
    districtExplorer,
    currentAreaNode,
    loadMap,
    initMap,
    switch2AreaNode,
    drawMapCircle,
  }
}

export default useGaode