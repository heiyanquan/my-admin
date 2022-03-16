// 过滤掉重复标签
export async function handleRepeatLabel(list) {
  if (!list) {
    return
  }
  list.value.forEach((item) => {
    const mySet = new Set()
    const newLabel = []
    item.label = item.label || []
    item.label.forEach((second) => {
      if (!mySet.has(second.label_name1)) {
        mySet.add(second.label_name1, true)
        newLabel.push(second)
      }
    })
    item.label = newLabel
  })
}
export function getSelectField(list, name) {
  let list1 = []
  list.forEach((item) => {
    list1.push({
      label: item.parameter_option,
      value: item.parameter_option
    })
  })
  list1 = [].concat({ label: name, value: 'all' }, list1)
  return list1
}
