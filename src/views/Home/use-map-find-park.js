import { inxGeneral, inxGeneralDetail } from 'api/index'

const circleModuleId = 'AHCYDT0002'
const circleRuleId = {
  park: {
    city: 'AHGCJ0598',
    district: 'AHGCJ0599',
    last: 'AHGCJ0600',
    cityField: 'AHGCJ0616',
    districtField: 'AHGCJ0617',
    lastField: 'AHGCJ0618',
    cityLevel: 'AHGCJ0619',
    districtLevel: 'AHGCJ0620',
    lastLevel: 'AHGCJ0621',
    cityFieldAndLevel: 'AHGCJ0622',
    districtFieldAndLevel: 'AHGCJ0623',
    lastFieldAndLevel: 'AHGCJ0624',
    unit: '个',
    name: '园区'
  },
  base: {
    city: 'AHGCJ0607',
    district: 'AHGCJ0608',
    last: 'AHGCJ0609',
    cityField: 'AHGCJ0637',
    districtField: 'AHGCJ0638',
    lastField: 'AHGCJ0639',
    unit: '个',
    name: '基地'
  },
  colony: {
    city: 'AHGCJ0604',
    district: 'AHGCJ0605',
    last: 'AHGCJ0606',
    cityField: 'AHGCJ0634',
    districtField: 'AHGCJ0635',
    lastField: 'AHGCJ0636',
    unit: '个',
    name: '集群'
  },
  Matching: {
    city: 'AHGCJ0610',
    district: 'AHGCJ0611',
    last: 'AHGCJ0612',
    cityField: 'AHGCJ0640',
    districtField: 'AHGCJ0641',
    lastField: 'AHGCJ0642',
    cityLevel: 'AHGCJ0643',
    districtLevel: 'AHGCJ0644',
    lastLevel: 'AHGCJ0645',
    cityFieldAndLevel: 'AHGCJ0646',
    districtFieldAndLevel: 'AHGCJ0647',
    lastFieldAndLevel: 'AHGCJ0648',
    unit: '个',
    name: '创新资源'
  },
  company: {
    city: 'AHGCJ0601',
    district: 'AHGCJ0602',
    last: 'AHGCJ0603',
    cityField: 'AHGCJ0625',
    districtField: 'AHGCJ0626',
    lastField: 'AHGCJ0627',
    cityLevel: 'AHGCJ0628',
    districtLevel: 'AHGCJ0629',
    lastLevel: 'AHGCJ0630',
    cityFieldAndLevel: 'AHGCJ0631',
    districtFieldAndLevel: 'AHGCJ0632',
    lastFieldAndLevel: 'AHGCJ0633',
    unit: '家',
    name: '企业'
  },
  project: {
    city: 'AHGCJ0613',
    district: 'AHGCJ0614',
    last: 'AHGCJ0615',
    cityField: 'AHGCJ0649',
    districtField: 'AHGCJ0650',
    lastField: 'AHGCJ0651',
    cityLevel: 'AHGCJ0652',
    districtLevel: 'AHGCJ0653',
    lastLevel: 'AHGCJ0654',
    cityFieldAndLevel: 'AHGCJ0655',
    districtFieldAndLevel: 'AHGCJ0656',
    lastFieldAndLevel: 'AHGCJ0657',
    unit: '个',
    name: '项目'
  },
  building: {
    city: 'AHGCJ0660',
    district: 'AHGCJ0661',
    last: 'AHGCJ0662',
    unit: '家',
    name: '楼宇'
  }
}

export default function useMapFindPark() {
  const currentRuleIdInfor = circleRuleId.park
  // 市级
  async function getIndexCluster() {
    let rule_id = currentRuleIdInfor.city
    return inxGeneral({
      module_id: circleModuleId,
      rule_id
    }).then((res) => {
      const itemInfor = res[0]
      return inxGeneralDetail({
        date: itemInfor.date,
        index_id: itemInfor.index_id,
        page: 1,
        page_size: itemInfor.value,
        start_date: itemInfor.start_date
      }).then((res2) => {
        return res2.list
      })
    })
  }

  // 县级
  function callMapDistrictData(cityInfor) {
    let rule_id = currentRuleIdInfor.value.district
    inxGeneral({
      module_id: circleModuleId,
      rule_id
    }).then((res) => {
      res = res.filter((item) => item.index_name.indexOf(cityInfor.address_city) > -1)
      const itemInfor = res[0]
      inxGeneralDetail({
        date: itemInfor.date,
        index_id: itemInfor.index_id,
        page: 1,
        page_size: itemInfor.value,
        start_date: itemInfor.start_date
      }).then((res2) => {
        return res2.list
      })
    })
  }
  // 县级详情-最后一级
  function callLastMarkerData(districtInfor) {
    let rule_id = currentRuleIdInfor.last
    inxGeneral({
      module_id: circleModuleId,
      rule_id
    }).then((res) => {
      res = res.filter((item) => item.index_name.indexOf(districtInfor.address_area) > -1)
      if (!res.length) {
        return
      }
      const itemInfor = res[0]
      inxGeneralDetail({
        date: itemInfor.date,
        index_id: itemInfor.index_id,
        page: 1,
        page_size: itemInfor.value,
        start_date: itemInfor.start_date
      }).then((res2) => {
        return res2.list
      })
    })
  }

  return {
    getIndexCluster,
    callLastMarkerData,
    callMapDistrictData,
  }
}
