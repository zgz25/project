<template>
  <transition name="fade">
    <div class="search" ref="search" @click="blurInput">
      <div class="search-box-wrapper">
        <search-box ref="searchBox" :back="true" :searchBtn="true" :readonly="false" @query="onQueryChange"
                    @focus="focus" @clear="clear" @onSearchBtn="addQuery(query)"></search-box>
      </div>
      <scroll class="shortcut-wrapper" ref="shortcut">
        <div class="shortcut">
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" :key="item.id" @click="addQuery(item.k)" v-html="item.k"></li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <list :datas="searchHistory" @itemEvent="addQuery" @deleteOne="deleteOne"></list>
          </div>
        </div>
      </scroll>
      <div class="wrapper" v-show="show">
        <suggest :query="query " @addQuery="addQuery"></suggest>
      </div>
      <router-view v-show="show && flag"></router-view>
      <confirm ref="confirm" text="是否清空所有搜索历史？" confirmBtnText="清空" @confirm="clearSearch"></confirm>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import {playlistMixin} from 'common/js/mixin'
import {mapActions, mapGetters} from 'vuex'
import List from 'base/list/list'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      hotKey: [],
      query: '',
      song: {},
      flag: true
    }
  },
  components: {
    SearchBox,
    Suggest,
    List,
    Scroll,
    Confirm
  },
  computed: {
    show () {
      return this.query.split(' ').join('').length !== 0
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlaylist (playlist, popup) {
      const zIndex = popup ? '9999' : '100'
      this.$refs.search.style.zIndex = zIndex
      const height = playlist.length > 0 ? '1.3rem' : '0'
      this.$refs.shortcut.$el.style.bottom = height
      this.$nextTick(() => {
        this.$refs.shortcut.refresh()
      })
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery (query) {
      // 为空 或全为空格
      if (query.split(' ').join('').length === 0) {
        return
      }
      this.$refs.searchBox.setQuery(query)
      this.saveSearchHistory(query)
      this.flag = true
      this.blurInput()
      this.$router.replace({
        path: '/search/searchResult',
        query: {
          query: query
        }
      })
    },
    onQueryChange (query) {
      this.query = query
    },
    focus () {
      this.flag = false
    },
    clear () {
      this.$refs.searchBox.setQuery('')
    },
    deleteOne (index) {
      this.deleteSearchHistory(index)
    },
    clearSearch () {
      this.clearSearchHistory()
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  created () {
    this.$nextTick(() => {
      this.$refs.searchBox.autoFocus()
    })
    this._getHotKey()
  },
  deactivated () {
    if (Object.keys(this.$route.query).length === 0) {
      this.clear()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    position: fixed
    max-width:640px
    width:100%
    top:0
    bottom: 0
    left:50%
    transform:translateX(-50%)
    background: $color-background
    .search-box-wrapper
      position:absolute
      top:0
      left: 0
      width:100%
      background:$color-background-y
      height: 80px
      padding-top: 30px
    .shortcut-wrapper
      position: absolute
      top:90px
      bottom:0px
      left: 0
      width:100%
      overflow: hidden
      z-index: -1
      .shortcut
        position: relative
        .hot-key
          margin: 0 20px 20px 20px
          height:248px
          .title
            margin: 60px 0 30px
            font-size: $font-size-medium
            color: $color-text
          .item
            display: inline-block
            height:  50px
            line-height: 50px
            padding: 0 20px
            margin: 0 20px 15px 0
            border-radius: 8px
            background: $color-background-d
            font-size: $font-size-medium
            color: $color-text-h
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            margin: 80px 0 20px
            font-size: $font-size-medium
            color: $color-text
            .text
              flex: 1
              font-size: $font-size-medium
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .wrapper
      position: fixed
      max-width: 640px
      width: 100%
      top: 110px
      bottom: 0
</style>
