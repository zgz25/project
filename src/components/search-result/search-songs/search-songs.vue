<template>
  <search-list :result="result" :noResult="noResult" :song="song" @pullingUp="pullingUp" ref="searchList">
    <div>
      <ul>
        <li class="search-songs-item" v-for="item in result" :key="item.id" @click="selectItem(item)">
          <span class="photo" v-show="item.type == 'singer'"><img v-lazy="imgUrl(item)" width="100%" style="border-radius: 50%"/></span>
          <div class="icon" v-show="item.type != 'singer'">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getSongName(item)"></p>
            <p class="singer" v-html="getSingerName(item)"></p>
          </div>
          <div class="more" @click.stop="showMore(item)" v-show="item.type !== 'singer'">
            <img src="./more.png" width="100%"/>
          </div>
        </li>
      </ul>
      <div class="load" v-show="loadShow && result.length" @click="pullingUp">{{loadMsg}}</div>
    </div>
  </search-list>
</template>

<script>
import {getSearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong2} from 'common/js/song'
import {mapActions} from 'vuex'
import Loading from 'base/loading/loading'
import SearchList from 'base/search-list/search-list'

const TYPE_SINGER = 'singer'

export default {
  data () {
    return {
      query: '',
      result: [],
      map: [],
      noResult: false,
      loadShow: false,
      loadMsg: '加载更多',
      total: 0,
      page: 1,
      song: {}
    }
  },
  components: {
    Loading,
    SearchList
  },
  methods: {
    _search () {
      getSearch(this.query, this.page).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this.total = res.data.song.totalnum
          this.loadMsg = '加载更多'
          if (this.page * 20 >= this.total) {
            this.loadShow = false
          } else {
            this.loadShow = true
          }
          if (res.subcode !== 0 && this.page === 1) {
            this.noResult = true
            this.map = []
          }
        }
      })
    },
    _genResult (data) {
      // 判断搜索返回的结果有没有歌手
      if (data.zhida && data.zhida.zhida_singer) {
        // 歌手只添加一次
        if (!this.result.length) {
          // 扩展
          this.map.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
      }
      if (data.song) {
        this.map = this.map.concat(this._normalizeSongs(data.song.list))
      }
      return this.map
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        ret.push(createSong2(musicData))
      })
      return ret
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return ``
      } else {
        return `icon-music`
      }
    },
    imgUrl (item) {
      if (item.type === TYPE_SINGER) {
        return `https://y.gtimg.cn/music/photo_new/T001R68x68M000${item.zhida_singer.singerMID}.jpg?max_age=2592000`
      }
    },
    getSongName (item) {
      if (item.type === TYPE_SINGER) {
        return item.zhida_singer.singerName
      } else {
        return item.name
      }
    },
    getSingerName (item) {
      if (item.type === TYPE_SINGER) {
        return `单曲：${item.zhida_singer.songNum}&nbsp;&nbsp;&nbsp;&nbsp;专辑：${item.zhida_singer.albumNum}`
      } else {
        return item.singer
      }
    },
    pullingUp () {
      if (this.loadShow) {
        this.loadMsg = '正在加载...'
        this.page += 1
        this._search()
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: `/singer/${item.zhida_singer.singerID}`,
          query: {
            id: item.zhida_singer.singerID
          }
        })
      } else {
        this.insertSong(item)
      }
    },
    showMore (song) {
      this.song = song
      this.$refs.searchList.showMore()
    },
    refreshList () {
      this.result = []
      this.map = []
      this.page = 1
      this.noResult = false
      this._search()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  created () {
    this.query = this.$route.query.query
    this._search()
  },
  watch: {
    '$route' (to, form) {
      if (to.path !== '/search/searchResult/searchSongs') {
        return ''
      }
      if (this.query !== this.$route.query.query && this.$route.query.query) {
        this.query = this.$route.query.query
        this.refreshList()
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-songs-item
    display: flex
    align-items: center
    height: 85px
    border-bottom: 1px solid $color-border-d
    &:last-child
      border-bottom:0
    .icon
      flex 0 0 70px
      width: 70px
      [class^="icon-"]
        font-size: 36px
        color:$color-theme
    .photo
      display:inline-block
      float: left
      width: 70px
      height: 70px
      margin-right: 15px
    .name
      flex: 1
      font-size: $font-size-medium-x
      color:$color-text
      overflow: hidden
      line-height:35px
      .text
        no-wrap()
      .singer
        font-size: $font-size-small
        color:$color-text-d
    .more
      flex 0 0 30px
      padding: 20px 20px 0 10px
      line-height: 65px
  .load
    width:100%
    text-align: center
    font-size: $font-size-small-x
    color:$color-text-g
    height: 60px
    line-height: 60px
    border-top: 1px solid $color-border
</style>
