<template>
  <transition name="more">
    <div class="morelist" v-show="showList" @click.stop="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon-music"></i>
            <span class="name">{{song.name}}</span>
          </h1>
        </div>
        <div class="list-content">
          <ul>
            <li class="item" @click="nextPlay">
              <i class="icon-next" ></i>
              <span>下一首播放</span>
            </li>
            <li @click="toggleCollection(song)">
              <i :class="getCollectionIcon(song)"></i>
              <span>{{getCollectionText(song)}}</span>
            </li>
            <li @click="selectSinger">
              <i class="icon-mine" ></i>
              <span>歌手:  {{song.singer}}</span>
            </li>
            <li @click="selectAlbum">
              <i><img src="./album.png" width="100%"/></i>
              <span>专辑:  {{song.album ? song.album : '无'}}</span>
            </li>
            <li @click="deleteOne" v-if="isDelete">
              <i class="icon-clear"></i>
              <span>删除</span>
            </li>
          </ul>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapMutations, mapActions} from 'vuex'
import {collectionMixin} from 'common/js/mixin'

export default {
  mixins: [collectionMixin],
  props: {
    song: {
      type: Object,
      default: function () {
      }
    },
    isDelete: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showList: false
    }
  },
  methods: {
    show () {
      this.showList = true
      this.setPopupState(true)
    },
    hide () {
      this.showList = false
      this.setPopupState(false)
    },
    nextPlay () {
      this.nextPlaySong(this.song)
      this.hide()
    },
    selectSinger () {
      if (this.song.singerid) {
        this.$router.push({
          path: `/singer/${this.song.singerid}`,
          query: {
            id: this.song.singerid
          }
        })
      } else {
        this.$emit('showMsgBox', '暂无相关内容')
      }
      this.hide()
    },
    selectAlbum () {
      if (this.song.singerid) {
        this.$router.push({
          path: `/album/${this.song.albumid}`,
          query: {
            id: this.song.albumid
          }
        })
      } else {
        this.$emit('showMsgBox', '暂无相关内容')
      }
      this.hide()
    },
    deleteOne () {
      this.$emit('deleteOne')
    },
    ...mapMutations({
      setPopupState: 'SET_POPUP_STATE'
    }),
    ...mapActions([
      'nextPlaySong'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .morelist
    position: fixed
    max-width:650px
    width:100%
    height:100%
    transform:translate3d(-50%,0,0)
    top: 0
    left: 50%
    bottom:0
    z-index:200
    background-color:$color-background-a
    &.more-enter-active, &.more-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.more-enter, &.more-leave-to
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
        padding: 20px 30px 20px 20px
        border-bottom: 3px solid $color-border-d
        .title
          display: flex
          align-items: center
          .icon-music
            margin-right: 10px
            font-size: $font-size-medium-x
            color: $color-theme
            margin-top: 4px
          .name
            flex: 1
            font-size: $font-size-medium
      .list-content
        max-height: 300px
        overflow: hidden
        li
          display: flex
          align-items: center
          height: 50px
          line-height: 50px
          padding: 0 30px 0 20px
          i
            flex: 0 0 35px
            width: 20px
            font-size: $font-size-medium
            color: $color-theme
            img
              width: 50px
              margin-top: 14px
              margin-left:-15px
          .icon-favorite
            color: $color-sub-theme
          span
            flex: 1
            no-wrap()
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 60px
        background: $color-highlight-background
        font-size: $font-size-medium-x
        color: $color-text
        border-top: 3px solid $color-border-d
</style>
