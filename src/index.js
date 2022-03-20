import React from "react";
import ReactDOM from "react-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import "antd/dist/antd.min.css";
import { Provider } from "react-redux";
import createStore from "./store";
import App from "./App";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";

moment.locale("zh-cn");
const createHistory = require("history").createBrowserHistory;
const history = createHistory();
const store = createStore();

window.AMapLoader.load({
  key: "60fdb942e15dfeefff0d5595c58a8de3", // 申请好的Web端开发者Key，首次调用 load 时必填
  version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  plugins: [
    "AMap.DistrictLayer",
    "AMap.HeatMap",
    "AMap.DistrictSearch",
    "AMap.Marker",
    "AMap.Text",
  ],
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
  .then((AMap) => {
    window.AMap = AMap;
    ReactDOM.render(
      <React.StrictMode>
        <ConfigProvider locale={zhCN}>
          <Provider history={history} store={store}>
            <App />
          </Provider>
        </ConfigProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch((e) => {
    console.log(e); // 加载错误提示
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
