import { useEffect, useState } from 'react'
import { filterParam, inxGeneral, inxGeneralDetail } from 'api/index'
import { getFirstFieldList } from 'api/nodeMiddle'
import { getSelectField } from './tools'

const circleModuleId = 'AHCYDT0002'

export default function useSelectData() {
  const [industryList, setIndustryList] = useState([])
  const [selectList, setSelectList] = useState({})
  const [cityNameCodeList, setCityNameCodeList] = useState([])
  const [districtNameCodeList, setDistrictNameCodeList] = useState([])

  async function callSelectData() {
    const fieldList = await getFirstFieldList()
    fieldList.unshift({ label: '全部产业', value: 'all' })
    setIndustryList(fieldList)
    filterParam({
      pids: ['A0001', 'A0003', 'A0004', 'A0027']
    }).then((res) => {
      const item = res
      setSelectList({
        company: getSelectField(item.A0003, '所有企业'),
        park: getSelectField(item.A0001, '全部级别'),
        Matching: getSelectField(item.A0004, '所有配套'),
        project: getSelectField(item.A0027, '所有项目')
      })
    })
  }
  // 所有城市列表和经纬度
  function callCityNameCodeList() {
    inxGeneral({
      module_id: circleModuleId,
      rule_id: 'AHGCJ0658'
    }).then((res) => {
      const itemInfor = res[0]
      inxGeneralDetail({
        date: itemInfor.date,
        index_id: itemInfor.index_id,
        page: 1,
        page_size: itemInfor.value,
        start_date: itemInfor.start_date
      }).then((res2) => {
        setCityNameCodeList(res2.list)
      })
    })
  }
  // 所有区县列表和经纬度
  function callDistrictNameCodeList() {
    inxGeneral({
      module_id: circleModuleId,
      rule_id: 'AHGCJ0659'
    }).then((res) => {
      const itemInfor = res[0]
      inxGeneralDetail({
        date: itemInfor.date,
        index_id: itemInfor.index_id,
        page: 1,
        page_size: itemInfor.value,
        start_date: itemInfor.start_date
      }).then((res2) => {
        setDistrictNameCodeList(res2.list)
      })
    })
  }

  useEffect(() => {
    callSelectData()
    callCityNameCodeList()
    callDistrictNameCodeList()
  }, [])

  return {
    industryList,
    selectList,
    cityNameCodeList,
    districtNameCodeList
  }
}
