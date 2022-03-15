const GET_LIST = 'GET_LIST'
const initialState = {
  total: 0,
  communityList: []
}

export default function reducer (state = initialState , action = {}) {
  switch (action.type) {
    case GET_LIST:
      return Object.assign({}, state, {
        communityList: action.communityList,
        total: action.total
      })
    default:
      return state
  }
}

export function getList (params = {}) {
  return (dispatch, state) => {
  };
}