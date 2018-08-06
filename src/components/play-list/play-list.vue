<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <div class="clear" @click="showConfirm"><span class="clear-text">清空</span></div>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content">
          <transition-group name="list" tag="ul" ref="list">
            <li class="item" v-for="(item, index) in playlist" :key="item.id" @click="selectPlay(index)">
              <i class="current" :class="getCurrentIcon(item)" @click.stop="togglePlay"></i>
              <p class="text"><span class="name">{{item.name}}</span> - {{item.singer}}</p>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
        <confirm ref="confirm" text="是否清空所有搜索历史？" confirmBtnText="清空" @confirm="clearSongList"></confirm>
      </div>
    </div>
  </transition>
</template>

<script>
import Confirm from 'base/confirm/confirm'
import {mapMutations, mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'

export default {
  data () {
    return {
      showFlag: false
    }
  },
  components: {
    Confirm,
    Scroll
  },
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    modeText () {
      return this.mode === playMode.sequence ? '循环播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    },
    ...mapGetters([
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  methods: {
    show () {
      this.showFlag = true
      this.scrollToCurrent()
    },
    hide () {
      this.showFlag = false
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    clearSearch () {
      this.clearSongList()
    },
    getCurrentIcon (item) {
      if (item.id === this.currentSong.id) {
        if (this.playing) {
          return 'icon-pause'
        } else {
          return 'icon-play'
        }
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
    },
    togglePlay () {
      this.setPlayingState(!this.playing)
    },
    selectPlay (index) {
      if (index !== this.currentIndex) {
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      }
      this.hide()
    },
    deleteOne (item) {
      this.deleteSong(item)
    },
    scrollToCurrent () {
      this.$nextTick(() => {
        this.$refs.listContent.refresh()
        let el = this.$refs.list.$el.children[this.currentIndex]
        this.$refs.listContent.scrollToElement(el, 0)
      })
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAYLIST',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    ...mapActions([
      'deleteSong',
      'clearSongList'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    max-width:640px
    width:100%
    transform:translate3d(-50%,0,0)
    top:0
    left:50%
    bottom:0
    z-index: 200
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-background
      .list-header
        position: relative
        padding: 25px 30px 20px 20px
        border-bottom: 1px solid $color-border
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: $font-size-medium-x
            color: $color-theme
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text
          .clear
            extend-click()
            font-size: $font-size-medium
            .icon-clear
              color: $color-text-g
              font-size: $font-size-small
              margin-right: 4px
            .clear-text
              vertical-align: top
              color: $color-text-g
      .list-content
        height: 260px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 60px
          padding: 0 30px 0 20px
          &.list-enter-active, &.list-leave-active
            transition: all .1s linear
          &.list-enter, &.list-leave-to
            height: 0
          .current
            margin-top: 3px
            flex: 0 0 35px
            width: 20px
            font-size: $font-size-medium
            color: $color-theme
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium-x
            color: $color-text
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-text-l
      .list-close
        text-align: center
        line-height: 65px
        background: $color-highlight-background
        font-size: $font-size-medium-x
        color: $color-text
        border-top: 1px solid $color-border
</style>
