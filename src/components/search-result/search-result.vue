<template>
  <div class="search-result" ref="searchResult">
    <div class="search-tab">
      <tab :tabs="tabs" :links="links"></tab>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tab from 'components/tab/tab'

export default {
  data () {
    return {
      tabs: ['歌曲', '歌单', '专辑'],
      query: ''
    }
  },
  components: {
    Tab
  },
  computed: {
    links () {
      return [
        {
          path: '/search/searchResult/searchSongs',
          query: {
            query: this.query
          }
        },
        {
          path: '/search/searchResult/searchDisc',
          query: {
            query: this.query
          }
        },
        {
          path: '/search/searchResult/searchAlbum',
          query: {
            query: this.query
          }
        }
      ]
    }
  },
  created () {
    this.query = this.$route.query.query
  },
  watch: {
    '$route' () {
      if (this.query !== this.$route.query.query && this.$route.query.query) {
        this.query = this.$route.query.query
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search-result
    position: absolute
    top: 110px
    width: 100%
    height: 100%
    background: $color-background
    .search-tab >>> .tab-link
      color:$color-text-g
</style>
