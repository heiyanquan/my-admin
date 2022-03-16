import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.min.css';
import { Provider } from 'react-redux';
import createStore from './store';
import App from './App';
import './index.scss';
import reportWebVitals from './reportWebVitals';

moment.locale('zh-cn');
const createHistory = require('history').createBrowserHistory
const history = createHistory()
const store = createStore();

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider history={history} store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
