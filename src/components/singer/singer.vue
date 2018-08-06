<template>
  <div class="singer" ref="singer">
    <scroll class="listview" ref="listView"  @scroll="scroll" :listenScroll="listenScroll">
      <ul >
        <li v-for="group in singer" class="list-group" :key="group.id" ref="listGroup">
          <h2 class="title">{{group.title}}</h2>
          <ul>
            <li v-for="item in group.items" class="list-group-item" :key="item.id" @click="selectSinger(item)">
              <img class="avatar" v-lazy="item.img">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"  @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li v-for="(item, index) in shortcutList"  class="item" :class="{'current':currentIndex==index}" :data-index="index" :key="index" >
            {{item}}
          </li>
        </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed" v-if="singer.length">
        <div class="fixed-title">{{fixedTitle}} </div>
      </div>
      <div class="loading-container" v-if="!singer.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'

const HOT_SINGER_LEN = 10
const LIST_HEIGHT = 18
const HOT_NAME = '热门'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      singer: [],
      listHeight: [],
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  components: {
    Scroll,
    Loading
  },
  created () {
    this.touch = {} // 在这里定义 不会时刻被监听 在data定义会时刻监听
    this.listenScroll = true
    this._getSingerLists()
    setTimeout(() => {
      this._calculateHeight()
    }, 200)
  },
  computed: {
    shortcutList () {
      return this.singer.map((item) => {
        return item.title.substr(0, 1)
      })
    },
    fixedTitle () {
      // 浮动的标题
      // 当第一个listGroup的title往下拉时 隐藏浮动的title
      if (this.scrollY > 0) {
        return false
      }
      return this.singer[this.currentIndex].title ? this.singer[this.currentIndex].title : false
    },
    titleHeight () {
      return this.$refs.fixed.clientHeight
    }
  },
  methods: {
    handlePlaylist (playlist, popup) {
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.singer.style.bottom = bottom
      const zIndex = popup ? '9999' : '100'
      this.$refs.singer.style.zIndex = zIndex
      this.$nextTick(() => {
        this.$refs.listView.refresh()
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 前10条为热门
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            img: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        } else {
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            img: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
      })
      // 为了得到有序列表，我们需要处理 map
      let hot = []
      let ret = []
      for (let key in map) {
        if (map[key].title === HOT_NAME) {
          hot.push(map[key])
        } else if (map[key].title.match(/[a-zA-Z]/)) {
          ret.push(map[key])
        }
        // 排序
        ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      }
      return hot.concat(ret)
    },
    _getSingerLists () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singer = this._normalizeSinger(res.data.list)
        }
      })
    },
    onShortcutTouchStart (e) {
      // 获取该元素下 子元素属性为 ：data-index 的值
      let anchorIndex = e.target.getAttribute('data-index')
      // 得到第一个手指当前的位置
      let firshTouch = e.touches[0]
      // 把y坐标存到this.touch中
      this.touch.y1 = firshTouch.pageY
      this.touch.index = anchorIndex
      // 滚动到指定元素的位置
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firshTouch = e.touches[0]
      this.touch.y2 = firshTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / LIST_HEIGHT | 0
      // LIST_HEIGHT 索引列表每一项的高度 |0 向下取整
      let anchorIndex = parseInt(this.touch.index) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      // 当点到列表头部和底部的空白处时 return
      if (!index) {
        return
      }
      // 当 list-shortcut 移动超出自己时
      if (index < 0) {
        index = 0
      }
      if (index > this.singer.length - 1) {
        index = this.singer.length - 1
      }
      this.currentIndex = index
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index])
    },
    scroll (e) {
      this.scrollY = e.y
      let y = Math.abs(Math.round(this.scrollY))
      for (let i = 0; i < this.listHeight.length - 1; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (y >= height1 && y <= height2)) {
          this.currentIndex = i
          this.diff = height2 - y
        }
      }
    },
    // 歌手列表 每一组的所在高度
    _calculateHeight () {
      let listGroup = this.$refs.listGroup
      if (listGroup) {
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < listGroup.length; i++) {
          let item = listGroup[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    selectSinger (item) {
      this.$router.push({
        path: `/singer/${item.id}`,
        query: {
          id: item.id
        }
      })
    }
  },
  watch: {
    // 当前浮动title 与 下个title的距离
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < this.titleHeight) ? newVal - this.titleHeight : 0
      // 避免过多dom操作 用 this.fixedTop = fixedTop 记住 fixedTop 在对比 相同则不操作
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer
    max-width: 640px
    position: fixed
    width: 100%
    top: 165px
    bottom: 0
    .listview
      position: relative
      width: 100%
      height: 100%
      overflow: hidden
      .title
        width: 100%
        height: 50px
        line-height: 50px
        padding-left: 30px
        font-size: $font-size-small
        color: $color-text-d
        background:  $color-background-d
      .list-group
        padding-bottom: 30px
        .list-group-item
          display: flex
          align-items: center
          padding: 15px 0 15px 40px
        .avatar
          width: 80px
          height: 80px
          border-radius: 50%
        .name
          margin-left: 30px
          color: $color-text
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 5px
      top: 50%
      transform: translateY(-50%)
      width: 24px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-a
      font-family: Helvetica
      .item
        padding: 4px
        line-height: 1
        color: $color-text-d
        font-size: 12px
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        width: 100%
        height: 50px
        line-height: 50px
        padding-left: 30px
        font-size: $font-size-small
        color: $color-text
        background: $color-background-d
    .loading-container
      position: absolute
      width:100%
      top: 50%
      transform:translateY(-50%)
</style>
