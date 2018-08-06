<template>
  <div class="rank" ref="rank">
    <scroll ref="scroll" :data="topList" class="toplist">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="100%" :src="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {ERR_OK} from 'api/config'
import {getRank} from 'api/rank'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  components: {
    Loading,
    Scroll
  },
  methods: {
    handlePlaylist (playlist, popup) {
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.rank.style.bottom = bottom
      const zIndex = popup ? '9999' : '100'
      this.$refs.rank.style.zIndex = zIndex
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    },
    _getRank () {
      getRank().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`,
        query: {
          id: item.id
        }
      })
    }
  },
  created () {
    this._getRank()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    max-width: 640px
    position: fixed
    top: 165px
    bottom: 0
    width: 100%
    .toplist
      padding: 0 20px
      height: 100%
      overflow: hidden
      .item
        display: flex
        height: 150px
        margin-bottom: 38px
        &:last-child
          padding-bottom: 40px
        .icon
          flex: 0 0 150px
          width: 150px
          height: 150px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 150px
          overflow: hidden
          background: $color-background-d
          color: $color-text
          font-size: $font-size-medium
          .song
            no-wrap()
            line-height: 42px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
