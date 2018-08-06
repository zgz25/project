<template>
  <search-list :result="result" :noResult="noResult" :song="song" @pullingUp="pullingUp" ref="searchList">
    <div>
      <ul>
        <li class="search-cd-item" v-for="(item, index) in result" :key="index" @click="selectCd(item)">
          <div class="picture"><img v-lazy="item.imgurl" width="100%"/></div>
          <div class="content-wrapper">
            <span class="title">{{item.dissname}}</span>
            <div class="desc">
              <span class="count">{{item.song_count}}首歌曲</span>
              <span v-html="item.creator.name"></span>
            </div>
          </div>
        </li>
      </ul>
      <div class="load" v-show="loadShow && result.length" @click="pullingUp">{{loadMsg}}</div>
    </div>
  </search-list>
</template>
<script>
import Loading from 'base/loading/loading'
import SearchList from 'base/search-list/search-list'
import {getSearchCd} from 'api/search'
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
      page: 0
    }
  },
  components: {
    SearchList,
    Loading
  },
  methods: {
    _getSearchCd () {
      getSearchCd(this.query, this.page).then(res => {
        if (res.code === ERR_OK && res.message !== 'engine') {
          let list = res.data.list
          if (list.length < this.result.length) {
            this.loadShow = false
          } else {
            this.loadMsg = '加载更多'
            this.loadShow = true
          }
          if (list.length === 1) {
            this.result.push(list[0])
          } else {
            list.forEach((list) => {
              this.result.push(list)
            })
          }
          if (this.result.length < 15) {
            this.page += 1
            this._getSearchCd()
          }
          if (res.subcode !== 0) {
            this.noResult = true
          }
        }
      })
    },
    selectCd (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`,
        query: {
          id: item.dissid
        }
      })
    },
    pullingUp () {
      if (this.loadShow) {
        this.loadMsg = '正在加载...'
        this.page += 1
        this._getSearchCd()
      }
    },
    refreshList () {
      this.result = []
      this.page = 0
      this.noResult = false
      this._getSearchCd()
    }
  },
  created () {
    this.query = this.$route.query.query
    this._getSearchCd()
  },
  watch: {
    '$route' (to, form) {
      if (to.path !== '/search/searchResult/searchDisc') {
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

  .search-cd-item
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
        color: $color-text-d
        font-size:$font-size-small
        .count
          margin-right: 10px
  .load
    width:100%
    text-align: center
    font-size: $font-size-small-x
    color:$color-text-g
    height: 60px
    line-height: 60px
    border-top: 1px solid $color-border
</style>
