const contains = (arr, str) => {
  // will implement object contains later
  if (_.isEmpty(arr) || _.isPlainObject(arr) || _.isNil(str)) {
    return false
  }

  if (_.isString(arr)) {
    arr = arr.split(',')
  } else if (_.isNumber(arr)) {
    arr = _.toString(arr)
  }

  return arrayContains(arr, str)
}

const showBanner = async (id, cb) => {
    const data = await think.model('ad_banner').getBannerById(id)
    cb(null, data[0].html)
}

export default env => {
  env.addFilter('showBanner', showBanner, true)
  env.addFilter('contains', contains)
  env.addFilter('formatCurrency', num => {
    return 'aaa'
  })
}
