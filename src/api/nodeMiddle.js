import fetch from 'utils/fetch'

function fetchMethod(url, data, method = 'post') {
  return fetch(method, process.env.REACT_APP_NODE_MIDDLE_API + url, data)
}

// 产业档案
export const getIndustryFileList = (data) => fetchMethod('/industryFile/list', data)
export const getIndustryFileFilter = (data) => fetchMethod('/industryFile/filter', data)
export const getCommonDetailData = (data) => fetchMethod('/industryFile/detail', data)
// 园区详情
export const getParkDetailBasic = (data) => fetchMethod('/parkDetail/basic', data)

export const getParkDetailService = (data) => fetchMethod('/parkDetail/serviceList', data)

export const getParkDetailCompanyDate = (data) => fetchMethod('/parkDetail/companyData', data)
export const getParkDetailCompanyList = (data) => fetchMethod('/parkDetail/companyList', data)

export const getParkDetailDynamic = (data) => fetchMethod('/parkDetail/dynamic', data)

export const getParkDetailPolicy = (data) => fetchMethod('/parkDetail/policyList', data)
export const getParkDetailSpaceList = (data) => fetchMethod('/parkDetail/spaceList', data)

// 一级领域
export const getFirstFieldList = (data) => fetchMethod('/common/field', data)
// 所有城市
export const getCityList = (data) => fetchMethod('/common/city', data)
// 所有领域
export const getAllFieldList = (data) => fetchMethod('/common/allField', data)
// 一级领域和城市
export const getFieldAndCity = (data) => fetchMethod('/common/fieldAndCity', data)
// 所有领域和城市
export const getAllFieldAndCity = (data) => fetchMethod('/common/allFieldAndCity', data)
