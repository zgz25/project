<template>
  <search-list :result="result" :noResult="noResult" :song="song" @pullingUp="pullingUp" ref="searchList">
    <div>
      <ul>
        <li class="search-album-item" v-for="(item, index) in result" :key="index" @click="selectAlbum(item)">
          <div class="picture"><img v-lazy="item.albumPic" width="100%"/></div>
          <div class="content-wrapper">
            <span class="title" v-html="item.albumName_hilight"></span>
            <div class="desc">
              <span class="name" v-html="item.singerName_hilight"></span>
              <span>{{item.publicTime}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="load" v-show="loadShow && result.length" @click="pullingUp">{{loadMsg}}</div>
    </div>
    <router-view></router-view>
  </search-list>
</template>
<script>
import Loading from 'base/loading/loading'
import SearchList from 'base/search-list/search-list'
import {getAlbum} from 'api/search'
import {ERR_OK} from 'api/config'

export default {
  data () {
    return {
      query: '',
      result: [],
      noResult: false,
      loadShow: false,
      song: {},
      loadMsg: '加载更多',
      totalnum: 0,
      page: 0
    }
  },
  components: {
    SearchList,
    Loading
  },
  methods: {
    _getAlbum () {
      getAlbum(this.query, this.page).then(res => {
        if (res.code === ERR_OK) {
          res.data.album.list.forEach((item) => {
            this.result.push(item)
          })
          this.totalnum = res.data.album.totalnum
          this.loadMsg = '加载更多'
          if (this.result.length >= this.totalnum) {
            this.loadShow = false
          } else {
            this.loadShow = true
          }
          if (res.subcode !== 0) {
            this.noResult = true
          }
        }
      })
    },
    selectAlbum (item) {
      this.$router.push({
        path: `/album/${item.albumID}`,
        query: {
          id: item.albumID
        }
      })
    },
    pullingUp () {
      if (this.loadShow) {
        this.loadMsg = '正在加载...'
        this.page += 1
        this._getAlbum()
      }
    },
    refreshList () {
      this.result = []
      this.page = 0
      this.noResult = false
      this._getAlbum()
    }
  },
  created () {
    this.query = this.$route.query.query
    this._getAlbum()
  },
  watch: {
    '$route' (to, form) {
      if (to.path !== '/search/searchResult/searchAlbum') {
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

  .search-album-item
    display: flex
    align-items: center
    height: 100px
    .picture
      flex: 0 0 70px
      width: 100%
      margin-right: 20px
    .content-wrapper
      flex: 1
      height: 70px
      line-height: 31px
      width:100%
      .title
        display: inline-block
        width:70%
        color: $color-text
        font-size:$font-size-medium-x
        no-wrap()
      .desc
        width:70%
        color: $color-text-d
        font-size:$font-size-small
        no-wrap()
        .name
          margin-right: 10px
      >>> em
        font-style:normal
        color: $color-text-blue
  .load
    width:100%
    text-align: center
    font-size: $font-size-small-x
    color:$color-text-g
    height: 60px
    line-height: 60px
    border-top: 1px solid $color-border
</style>
