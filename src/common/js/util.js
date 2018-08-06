// 洗牌/打乱
export function shuffle (arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}
// 随机数
export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 拼接
export function Splicing (arr) {
  let ret = []
  if (!arr) {
    return ''
  }
  arr.forEach((s) => {
    ret.push(s.name)
  })
  // 如果有多个歌手 用'/'连接起来
  return ret.join(' / ')
}
