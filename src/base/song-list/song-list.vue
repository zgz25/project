<template>
    <div class="song-list" ref="songList" :style="minHeight">
      <ul>
        <li v-for="(song,index) in songs" class="item" :key="index" @click="selectItem(song,index)">
          <div class="rank" v-show="rank">
            <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
          </div>
          <div class="content">
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">{{getDesc(song)}}</p>
          </div>
          <div class="more" @click.stop="more(song)">
            <img src="./more.png" width="100%"/>
          </div>
        </li>
      </ul>
      <slot></slot>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  props: {
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    minHeight () {
      if (this.flag) {
        return ''
      } else {
        let height = 68
        if (this.playlist.length) {
          height = 113
        }
        return `min-height: ${document.documentElement.clientHeight - height}px`
      }
    },
    ...mapGetters([
      'playlist'
    ])
  },
  methods: {
    getDesc (song) {
      return `${song.singer}  ${song.album}`
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    getRankCls (index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText (index) {
      if (index > 2) {
        return index + 1
      }
    },
    more (song) {
      this.$emit('more', song)
    },
    ...mapActions([
      'selectPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    overflow: hidden
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 85px
      font-size: $font-size-medium-x
      border-bottom: 1px solid $color-border-d
      .rank
        flex: 0 0 80px
        width: 80px
        text-align: center
        .icon
          display: inline-block
          width:50px
          height:48px
          background-size: 50px 48px
          margin: 0 30px
          &.icon0
           bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          margin-left: 30px
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 30px
        overflow: hidden
        margin-left: 20px
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 5px
          color: $color-text-d
          font-size: $font-size-small-s
      .more
        flex: 0 0 25px
        padding: 0 20px 0 10px
        line-height: 85px
</style>
