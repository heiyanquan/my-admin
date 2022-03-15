import fetch from 'utils/fetch'

const GET_AUTH_LIST = 'GET_AUTH_LIST'
const initialState = {
}

export default function reducer (state = initialState , action = {}) {
  switch (action.type) {
    case GET_AUTH_LIST:
      return Object.assign({}, state, action.data);
    default:
      return state
  }
}

export function callUserLogin (params = {}) {
  return () => {
    return fetch('user/login', { username: "lvxc", password: "123456" }).then(res => {
      window.localStorage.setItem('storagetoken', res); //数据存储
    })
  };
}
