<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img" :onerror="errorImg"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="isRotate">
                <img class="image" :src="currentSong.img" :onerror="errorImg"/>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{playingLyric}}</p>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{current: currentLineNum == index}" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow == 'cd'}"></span>
            <span class="dot" :class="{active: currentShow == 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @updatePercent="updatePercent"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
            </div>
            <div class="icon i-left">
              <i @click="prev" class="icon-prev" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="togglePlay" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
            </div>
            <div class="icon i-right">
              <i @click="next" class="icon-next" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
            </div>
            <div class="icon i-right" @click="toggleCollection(currentSong)">
              <i class="icon" :class="getCollectionIcon(currentSong)" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="icon" @click="open" :class="isRotate">
          <img width="100%" height="100%" :src="currentSong.img" v-show="currentSong.img"
               :onerror="errorImg"/>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control1">
          <i ref="miniBtn" @click="togglePlay" class="icon-mini" :class="miniIcon" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
          <progress-circle :radius="radius" :percent="percent"></progress-circle>
        </div>
        <div class="control2" @click="showPlayList">
          <i class="icon-playlist" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove" @touchend="onShortcutTouchEnd"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSong.url" @playing="play" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progerss-circle/progerss-circle'
import {playMode} from 'common/js/config'
import {getRandomInt} from 'common/js/util'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Lyric from 'lyric-parser'
import {getLyrics} from 'api/singer'
import PlayList from 'components/play-list/play-list'
import {collectionMixin} from 'common/js/mixin'

export default {
  mixins: [collectionMixin],
  data () {
    return {
      duration: 0,
      currentTime: 0,
      radius: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      lineShow: false,
      errorImg: 'this.src="' + require('../../common/image/default.png') + '"'
    }
  },
  components: {
    Scroll,
    SongList,
    Loading,
    ProgressBar,
    ProgressCircle,
    PlayList
  },
  created () {
    this.touch = {}
  },
  mounted () {
    this.radius = this.$refs.miniBtn.clientWidth
    window.addEventListener('resize', () => {
      this.radius = this.$refs.miniBtn.clientWidth
    })
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    isRotate () {
      return this.playing ? 'play' : 'play pause'
    },
    // 当前歌曲播放进度的比例
    percent () {
      return this.currentTime / this.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'playHistory'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlay () {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    end () {
      // 播放结束 按钮暂停
      this.togglePlay()
      setTimeout(() => {
        // 如果是单曲循环模式
        if (this.mode === playMode.loop) {
          // 重新播放
          this.updatePercent(0)
          if (this.currentLyric) {
            this.currentLyric.seek(0)
          }
        } else {
          // 下一首
          this.next()
        }
      }, 500)
    },
    // 如果列表只有一首歌
    once () {
      if (this.playlist.length === 1) {
        this.updatePercent(0)
      }
    },
    next () {
      let index
      if (this.mode === playMode.random) {
        index = this.random(index, this.playlist.length - 1)
      } else {
        index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
      }
      this.setCurrentIndex(index)
      this.once()
      // 如果当前按钮的样式是暂停的
      if (!this.playing) {
        this.togglePlay()
      }
    },
    prev () {
      let index
      if (this.mode === playMode.random) {
        index = this.random(index, this.playlist.length - 1)
      } else {
        index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
      }
      this.setCurrentIndex(index)
      this.once()
      // 如果当前的按钮样式是暂停的
      if (!this.playing) {
        this.togglePlay()
      }
    },
    showPlayList () {
      this.$refs.playList.show()
    },
    random (index, max) {
      index = getRandomInt(0, max)
      // 如果随机数等于当前播放歌曲的下标 重新播放
      if (index === this.currentIndex) {
        this.updatePercent(0)
      }
      return index
    },
    // 当媒介已就绪可以开始播放时运行
    play () {
      this.duration = this.$refs.audio.duration
    },
    error () {
    },
    onShortcutTouchStart (e) {
      e.touches[0].target.style.opacity = 0.6
    },
    onShortcutTouchMove (e) {
      let offsetLeft = e.target.offsetLeft
      let offsetWidth = e.target.offsetWidth
      let width = offsetLeft + offsetWidth
      let clientX = e.touches[0].clientX
      let offsetTop = e.target.offsetTop
      let offsetHeight = e.target.offsetHeight
      let height = offsetTop + offsetHeight
      let clientY = e.touches[0].clientY
      if (clientX < offsetLeft || clientX > width || clientY < offsetTop || clientY > height) {
        e.target.style.opacity = 1
      }
    },
    onShortcutTouchEnd (e) {
      e.target.style.opacity = 1
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      let second = interval % 60
      if (second.toString().length < 2) {
        second = '0' + second
      }
      return `${minute}:${second}`
    },
    updatePercent (percent) {
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
    },
    getLyric () {
      getLyrics(this.currentSong.mid).then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      this.playingLyric = txt
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 如果y轴的偏移量 大于x轴的偏移量
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style['transitionDuration'] = 0
      // 在屏幕的偏移量
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style['transitionDuration'] = 0
    },
    middleTouchEnd () {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      let time = 300
      if (this.currentShow === 'cd') {
        // 移动超过屏幕的一半
        if (this.touch.percent > 0.3) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.7) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style['transitionDuration'] = `${time}ms`
      this.touch.initiated = false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (oldSong.id === newSong.id || !newSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      this.$nextTick(() => {
        this.savePlayHistory(this.currentSong)
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing (state) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        state ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      width: 100%
      max-width: 640px
      margin: 0 auto
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background-e
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.4
        filter: blur(20px)
      .top
        position: relative
        margin-top: 15px
        .back
          position absolute
          top: 0
          left: 12px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text-b
        .subtitle
          line-height: 60px
          text-align: center
          font-size: $font-size-medium
          color: $color-text-b
          font-weight: 0
      .middle
        position: absolute
        width: 100%
        top: 150px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 70%
          .cd-wrapper
            position: absolute
            left: 15%
            top: 0
            width: 70%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 40px auto 0
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 24px
              padding: 10px 0
              font-size: $font-size-medium
              color: $color-text-ll
        .middle-r
          display:inline-block
          vertical-align: top
          width: 100%
          height: 80%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 60px
              color: $color-text-d
              font-size: $font-size-medium
              font-weight: 0
              &.current
                color: $color-text-b
      .bottom
        position: absolute
        bottom: 90px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          margin-bottom: 15px
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto 10px
          padding: 10px 0
          .time
            color: $color-text-ll
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            margin-left: 20px
            margin-right: 12px
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            i
              font-size: 50px
          .i-left
            text-align: right
          .i-center
            padding: 0 25px
            text-align: center
            i
              font-size: 75px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0,-100px,0)
        .bottom
          transform: translate3d(0,100px,0)
    .mini-player
      max-width: 640px
      position: fixed
      transform: translateX(-50%)
      width: 100%
      left: 50%
      bottom: 0
      z-index: 180
      width: 100%
      height: 1.2rem
      background: $color-background-e
      &.mini-enter-active, &.mini-leave-active
        transition: all .4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
        transform: translate3d(-50%,1.2rem,0)
      .icon
        width: 1rem
        padding: .1rem 0
        margin: 0 20px
        float: left
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
        img
          border-radius: 50%
      .text
        float: left
        display inline-block
        margin-top: 5px
        line-height: 30px
        .name
          width: 200px
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
          font-size: $font-size-medium
          color: $color-text-b
        .desc
          font-size: $font-size-small-s
          color: $color-text-d
          float: left
      .control2
        position: absolute
        right: 0
        padding: 20px
        margin-right: 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
      .control1
        position absolute
        top 14px
        right 100px
        width 50px
        height 50px
        .icon-mini
          font-size: 50px
          position: absolute
          left: 0
          top: 0
          color: $color-theme-d
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
