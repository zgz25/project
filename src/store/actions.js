import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay, deletePlay, saveCollection, deleteCollection} from 'common/js/cache'

// 选择播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 随机播放全部
export const randomPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 下一首播放
export const nextPlaySong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let fpIndex = findIndex(playlist, song)
  let currentIndex = state.currentIndex
  if (fpIndex > -1) {
    if (fpIndex === currentIndex) {
      return
    }
    playlist.splice(fpIndex, 1)
    if (fpIndex < currentIndex) {
      currentIndex--
      commit(types.SET_CURRENT_INDEX, currentIndex)
    }
  }
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  commit(types.SET_PLAYLIST, playlist)
  // 添加后列表只有一首歌时
  if (playlist.length === 1) {
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex
  // 查找当前列表中是否存在待插入的歌曲
  let fpIndex = findIndex(playlist, song)
  // 如果已经存在了这首歌，先把他删除，再插入
  if (fpIndex > -1) {
    playlist.splice(fpIndex, 1)
    // 因为删去了一首歌 当前歌曲的下标应 -1
    currentIndex--
  }
  // 在当前歌曲后面 添加一首歌
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex
  let fpIndex = findIndex(playlist, song)
  playlist.splice(fpIndex, 1)
  if (currentIndex === fpIndex) {
    commit(types.SET_PLAYING_STATE, true)
  }
  if (currentIndex > fpIndex) {
    currentIndex--
  }
  if (currentIndex === playlist.length) {
    currentIndex = 0
  }
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  }
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYLIST, playlist)
}

export const clearSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, index) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(index))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const deletePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, deletePlay(song))
}

export const saveCollectionList = function ({commit}, song) {
  commit(types.SET_COLLECTION_LIST, saveCollection(song))
}
export const deleteCollectionList = function ({commit}, song) {
  commit(types.SET_COLLECTION_LIST, deleteCollection(song))
}
