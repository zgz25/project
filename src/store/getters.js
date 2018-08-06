
export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

// 当前播放歌曲
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const collectionList = state => state.collectionList

export const popup = state => state.popup
