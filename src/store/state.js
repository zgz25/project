import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadCollection} from 'common/js/cache'

const state = {
  // 播放状态
  playing: false,
  // 全屏或收起
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 播放类型
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1,

  searchHistory: loadSearch(),

  playHistory: loadPlay(),

  collectionList: loadCollection(),

  // 是否显示了底部弹窗
  popup: false
}

export default state
