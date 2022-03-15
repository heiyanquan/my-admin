import fetch from 'utils/fetch'

//
export const homeSelectByAppId = data => fetch.get( '/standard/config/home/selectByAppId', data);