<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <slider v-if="recommends.length">
            <div v-for="item in recommends" :key="item.id" class="slider-item">
              <a :href="item.linkUrl">
                <img :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.id" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" width="100%" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  components: {
    Scroll,
    Slider,
    Loading
  },
  methods: {
    handlePlaylist (playlist, popup) {
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.recommend.style.bottom = bottom
      const zIndex = popup ? '9999' : '100'
      this.$refs.recommend.style.zIndex = zIndex
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    },
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`,
        query: {
          id: item.dissid
        }
      })
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheel/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 165px
    bottom: 0
    max-width :640px
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 100px
          line-height: 100px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          padding: 30px
          padding-top: 0
          line-height: 40px
          overflow hidden
          font-size: $font-size-medium-x
          .icon
            width: 80px
            height: 80px
            margin-right: 20px
          .name
            color: $color-text
          .desc
            color: $color-text-d
            font-size: $font-size-small
       .loading-container
         position: absolute
         width:100%
         top: 50%
         transform:translateY(-50%)
</style>
