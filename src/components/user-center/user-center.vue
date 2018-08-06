<template>
  <transition name="slide">
    <div class="user-center" ref="userCenter">
      <div class="head">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="title">个人中心</div>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <div class="list-head" v-show="!noResult">
        <div class="random-play" @click="randomPlayAll">
          <i class="icon-play"></i>
          <span>随机播放</span>
        </div>
        <div class="multi-select" @click="multiSelect">
          <span class="icon-multi"><img src="./multi.png" width="100%"/></span>
          <span>多选</span>
        </div>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="collectionList" class="list-scroll" v-if="currentIndex === 0" >
          <div class="list-inner">
            <song-list :songs="collectionList" :flag="true" @more="showMore"></song-list>
          </div>
        </scroll>
        <scroll ref="playHistoryList" class="list-scroll" v-if="currentIndex === 1">
          <div class="list-inner">
            <song-list :songs="playHistory" :flag="true" @more="showMore"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="title"></no-result>
      </div>
      <operation ref="operation" :songs="songs" @batchDelete="batchDelete"></operation>
      <more-list ref="moreList" :song="song" :isDelete="true" @deleteOne="deleteOne"></more-list>
      <message-box message="删除成功" ref="msgBox"></message-box>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {playlistMixin} from 'common/js/mixin'
import NoResult from 'base/no-result/no-result'
import MoreList from 'components/more-list/more-list'
import {getRandomInt} from 'common/js/util'
import Operation from 'base/operation/operation'
import MessageBox from 'base/message-box/message-box'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      songs: [],
      song: {},
      currentIndex: 0,
      switches: [
        '我的收藏',
        '最近播放'
      ]
    }
  },
  components: {
    SongList,
    Switches,
    Scroll,
    MoreList,
    NoResult,
    Operation,
    MessageBox
  },
  computed: {
    title () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '暂无最近播放'
      }
    },
    noResult () {
      if (this.currentIndex === 0) {
        return !this.collectionList.length
      } else {
        return !this.playHistory.length
      }
    },
    ...mapGetters([
      'collectionList',
      'playHistory'
    ])
  },
  methods: {
    handlePlaylist (playlist, popup) {
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.listWrapper.style.bottom = bottom
      const zIndex = popup ? '9999' : '100'
      this.$refs.userCenter.style.zIndex = zIndex
      this.$nextTick(() => {
        this.$refs.collectionList && this.$refs.collectionList.refresh()
        this.$refs.playHistoryList && this.$refs.playHistoryList.refresh()
      })
    },
    back () {
      this.$router.back()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    showMore (song) {
      this.song = song
      this.$refs.moreList.show()
    },
    deleteOne () {
      if (this.currentIndex === 0) {
        this.deleteCollectionList(this.song)
      } else {
        this.deletePlayHistory(this.song)
      }
      this.$refs.moreList.hide()
      this.$refs.msgBox.show()
    },
    randomPlayAll () {
      let list = this.currentIndex === 0 ? this.collectionList : this.playHistory
      let length = this.currentIndex === 0 ? this.collectionList.length : this.playHistory.length
      this.randomPlay({
        list,
        index: getRandomInt(0, length - 1)
      })
    },
    multiSelect () {
      this.songs = this.currentIndex === 0 ? this.collectionList : this.playHistory
      this.$refs.operation.show()
    },
    batchDelete (datas) {
      datas.forEach(song => {
        if (this.currentIndex === 0) {
          this.deleteCollectionList(song)
        } else {
          this.deletePlayHistory(song)
        }
      })
      this.$refs.msgBox.show()
    },
    ...mapActions([
      'deleteCollectionList',
      'deletePlayHistory',
      'randomPlay'
    ])
  },
  activated () {
    this.currentIndex = 0
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .user-center
    position: fixed
    max-width: 640px
    top: 0
    bottom:0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active
      transition: all 0.3s
    &.slide-enter
      transform: translate3d(100%, 0, 0)
    .head
      position: absolute
      top: 0
      left: 0
      z-index: 50
      width: 100%
      height: 62px
      padding: 40px 0px 8px
      display: flex
      background: $color-background-y
      color: $color-text-b
      .back
        flex:0 0 20px
        .icon-back
          display: block
          padding: 15px
          font-size: $font-size-large-x
      .title
        flex: 1
        font-size: $font-size-medium-x
        line-height: 58 px
        text-align: center
        margin-right: 50px
    .switches-wrapper
      margin: 140px 0 30px 0
    .list-head
      height: 40px
      margin: 0 30px
      padding-top: 20px
      border-bottom: 1px solid $color-border
      font-size: $font-size-small
      .random-play
        float: left
        display: flex
        align-items: center
        .icon-play
          font-weight: 700
          vertical-align: middle
          margin-top: 4px
          margin-right: 6px
      .multi-select
        float: right
        display: flex
        align-items: center
        .icon-multi
          width: 30px
          height: 30px
    .list-wrapper
      position: absolute
      top: 275px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding:0px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
