import storage from 'good-storage'

const SEARCH_KEY = '__search__'
// 搜索历史的最大存储空间
const SEARCH_MAX_LENGTH = 10

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const COLLECTION_KEY = '__collection__'

// -------------------搜索历史---------------------
// 从本地读取保存的数据
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch (index) {
  let searches = storage.get(SEARCH_KEY, [])
  searches.splice(index, 1)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
// -------------------最近播放---------------------
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function deletePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  deleteFromArray(songs, song)
  storage.set(PLAY_KEY, songs)
  return songs
}
// ----------------------收藏------------------------
export function loadCollection () {
  return storage.get(COLLECTION_KEY, [])
}

export function saveCollection (song) {
  let songs = storage.get(COLLECTION_KEY, [])
  songs.unshift(song)
  storage.set(COLLECTION_KEY, songs)
  return songs
}

export function deleteCollection (song) {
  let songs = storage.get(COLLECTION_KEY, [])
  deleteFromArray(songs, song)
  storage.set(COLLECTION_KEY, songs)
  return songs
}

// -------------------共用--------------------
function insertArray (arr, val, maxLen) {
  const index = arr.findIndex(item => {
    if (val.id) {
      return val.id === item.id
    }
    return val === item
  })
  // 如果插入的数据已存在 且在第一条 直接返回
  if (index === 0) {
    return
  }
  // 如果插入的数据已存在 且在不在第一条 删除这条数据
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 把数据插入到第一条的位置
  arr.unshift(val)
  // 如果超过储存空间 把最后一条删除
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, val) {
  const index = arr.findIndex(item => {
    return val.id === item.id
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
}
