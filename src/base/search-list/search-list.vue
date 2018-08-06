<template>
  <div class="search-list" ref="searchList">
    <div class="wrapper">
      <scroll class="list" :listenScroll="listenScroll"  @pullingUp="pullingUp" ref="list">
        <slot></slot>
      </scroll>
      <div v-show="result.length == 0 && !noResult" class="loading-container">
        <loading></loading>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result title="暂无内容或结果"></no-result>
      </div>
      <more-list ref="moreList" :song="song" @showMsgBox="showMsgBox"></more-list>
      <message-box :message="message" ref="msgBox"></message-box>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import NoResult from 'base/no-result/no-result'
import MessageBox from 'base/message-box/message-box'
import Loading from 'base/loading/loading'
import MoreList from 'components/more-list/more-list'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  props: {
    result: {
      type: Array,
      default: function () {
      }
    },
    noResult: {
      type: Boolean,
      default: false
    },
    song: {
      type: Object,
      default: function () {
      }
    }
  },
  data () {
    return {
      message: ''
    }
  },
  components: {
    Scroll,
    NoResult,
    MessageBox,
    Loading,
    MoreList
  },
  methods: {
    handlePlaylist (playlist, popup) {
      const height = playlist.length > 0 ? '1.3rem' : '0'
      this.$refs.searchList.style.bottom = height
      this.$nextTick(() => {
        this.$refs.list.refresh()
      })
    },
    showMore () {
      this.$refs.moreList.show()
    },
    showMsgBox (msg) {
      console.log(11)
      this.message = msg
      this.$refs.msgBox.show()
    },
    pullingUp () {
      this.$emit('pullingUp')
    }
  },
  created () {
    this.listenScroll = true
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-list
    width:100%
    position: fixed
    top:165px
    bottom: 0px
    .wrapper
      height: 100%
      overflow: hidden
      .list
        padding: 0px 30px
        height:100%
        overflow: hidden
        .search-list-item
          display: flex
          align-items: center
          height: 85px
          border-bottom: 1px solid $color-border
          &:last-child
            border-bottom:0
      .no-result-wrapper
        position: fixed
        width: 100%
        top: 50%
        transform: translateY(-50%)
        & >>> .no-result-text
          color: $color-text-g
      .loading-container
        position: fixed
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
