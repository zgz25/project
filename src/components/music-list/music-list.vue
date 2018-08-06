<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" ref="title">{{title}}</h1>
    <div class="filter" ref="filter">
      <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
    </div>
    <div class="outer-layer" ref="layer" v-show="songs.length>0">
      <div class="picture">
        <img :src="bgImage" width="100%" :onerror="errorImg"/>
      </div>
      <div class="wrapper">
        <span class="name">{{title}}</span>
        <span class="text" v-html="text"></span>
        <span class="desc" v-html="desc" @click="showDetailBox"></span>
        <div class="play-wrapper" ref="btn">
          <div class="play">
            <i class="icon-play"></i>
            <span class="play-text" @click="randomPlayAll">随机播放全部</span>
          </div>
        </div>
      </div>
    </div>
    <scroll class="list" ref="list" :listenScroll="listenScroll"  @scroll="scroll" @scrollEnd="scrollEnd" @pullingUp="pullingUp">
      <song-list ref="songList" :songs="songs" :rank="rank" @more="showMore">
        <div class="load-more" v-show="loadShow && songs.length" @click="pullingUp">{{loadMsg}}</div>
      </song-list>
      <div v-show="songs.length == 0 && !noResult" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <div class="no-result-wrapper" v-show="noResult">
      <no-result title="暂无内容或结果"></no-result>
    </div>
    <more-list ref="moreList" :song="song"></more-list>
    <message-box :message="message" ref="msgBox"></message-box>
    <detail-box :text="desc" ref="detailBox"></detail-box>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {getRandomInt} from 'common/js/util'
import {playlistMixin} from 'common/js/mixin'
import MoreList from 'components/more-list/more-list'
import MessageBox from 'base/message-box/message-box'
import {prefixStyle} from 'common/js/dom'
import DetailBox from 'base/detail-box/detail-box'
import NoResult from 'base/no-result/no-result'

const transform = prefixStyle('transform')

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    text: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    },
    loadShow: {
      type: Boolean,
      default: false
    },
    loadMsg: {
      type: String,
      default: '加载更多'
    },
    noResult: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0,
      song: {},
      message: '',
      errorImg: 'this.src="' + require('../../common/image/default.png') + '"'
    }
  },
  components: {
    SongList,
    Scroll,
    Loading,
    MoreList,
    MessageBox,
    DetailBox,
    NoResult
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$nextTick(() => {
        this.$refs.list.refresh()
      })
    },
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    scrollEnd (pos) {
      let bgImgHeight = this.$refs.bgImage.clientHeight
      let titleHeight = this.$refs.title.clientHeight
      let range = Math.abs(pos.y)
      if (range > 0 && range < bgImgHeight - titleHeight) {
        this.$refs.list.scrollTo(0, 0, 500)
        this.scrollY = 0
      }
    },
    pullingUp () {
      this.$emit('pullingUp')
    },
    randomPlayAll () {
      this.randomPlay({
        list: this.songs,
        index: getRandomInt(0, this.songs.length - 1)
      })
    },
    showMore (song) {
      this.song = song
      this.$refs.moreList.show()
    },
    showMsgBox (msg) {
      if (msg) {
        this.message = msg
      }
      this.$refs.msgBox.show()
    },
    showDetailBox () {
      this.$refs.detailBox.show()
    },
    ...mapActions([
      'randomPlay'
    ])
  },
  created () {
    this.listenScroll = true
  },
  activated () {
    this.$nextTick(() => {
      this.$refs.list.scrollTo(0, 0)
      this.scrollY = 0
    })
  },
  watch: {
    scrollY (newVal) {
      let scale = 1
      let opacity = 1
      let bgImgHeight = -this.$refs.bgImage.clientHeight
      let titleHeight = this.$refs.title.clientHeight
      // 最多滚动距离不超过 bgImage-40
      let tranlateY = Math.max(bgImgHeight + titleHeight, newVal)
      // 滚动和图片高度 的比例
      let percent = Math.abs(newVal / bgImgHeight)
      if (newVal > 0) {
        scale = 1 + percent
      } else {
        opacity = Math.min(1 * percent, 1)
        this.$refs.filter.style.top = `${tranlateY}px`
        this.$refs.layer.style.top = `${tranlateY}px`
        this.$refs.layer.style.opacity = 1 - opacity
      }
      // 隐藏按钮
      if (newVal < bgImgHeight + titleHeight) {
        this.$refs.btn.style.display = 'none'
        this.$refs.title.style.visibility = 'visible'
      } else {
        this.$refs.btn.style.display = 'block'
        this.$refs.title.style.visibility = 'hidden'
      }
      this.$refs.filter.style[transform] = `scale(${scale})`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    transform: translateX(-50%)
    max-width: 640px
    margin:0 auto
    width 100%
    bottom:0
    left: 50%
    height:100%
    z-index: 100
    background: $color-background
  .back
    position absolute
    top: 48px
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    font-weight: bold
    position: absolute
    height:110px
    top:35px
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 70px
    font-size: $font-size-medium-x
    color: $color-text-ll
    visibility: hidden
  .filter
    position: relative
    background: $color-background-e
    width: 100%
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      z-index: 10
      overflow: hidden
      filter: blur(20px)
      opacity: 0.4
  .rank-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    z-index: 10
  .outer-layer
    position: absolute
    top:0
    width: 100%
    height: 450px
    display: flex
    align-items: center
    z-index: 20
    opacity: 1
    color: $color-text-ll
    .picture
      flex: 0 0 150px
      margin 0 20px
    .wrapper
      flex:1
      display: flex
      flex-direction: column
      line-height: 42px
      .name
        margin-top: -12px
        width: 95%
        font-size: $font-size-medium-x
        no-wrap()
      .text
        font-size: $font-size-small
      .desc
        font-size: $font-size-small-s
        line-height: 28px
        width: 95%
        height: 50px
        overflow: hidden
    .play-wrapper
      position absolute
      left:50%
      transform: translateX(-50%)
      bottom: 30px
      margin-top: 20px
      z-index: 20
      display: block
      .play
        box-sizing: border-box
        width: 220px
        padding: 8px 0
        margin 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 10px
          font-size: $font-size-medium-x
        .play-text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-medium
  .list
    margin-top: 15px
    position: absolute
    width: 100%
    top:435px
    left:0
    bottom: 0px
    overflow: visible
    z-index: -1
    .load-more
      text-align: center
      font-size: $font-size-small-x
      color: $color-text-d
      height 60px
      line-height 60px
      border-top: 1px solid $color-border-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
  .no-result-wrapper
    position: fixed
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
