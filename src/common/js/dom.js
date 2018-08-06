let elementStyle = document.createElement('div').style

let vendor = (() => {
  // 把样式名首字母变成大写

  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  // 前缀 +  把样式名首字母变成大写
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
